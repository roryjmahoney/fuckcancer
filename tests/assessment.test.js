import test from 'node:test';
import assert from 'node:assert/strict';
import { assess, bmi, packYears, validate, changeUnits } from '../src/assessment.js';

test('metric and imperial BMI agree', () => {
  assert.ok(Math.abs(bmi({ units:'metric', height:180, weight:80 }) - bmi({ units:'imperial', heightFeet:5, heightInches:10.866, weight:176.37 })) < .01);
  assert.equal(bmi({}), null);
});
test('pack years use 20 cigarettes per pack and ignore stale never-smoker values', () => {
  assert.equal(packYears({smoking:'current', cigarettes:10, years:20}),10);
  assert.equal(packYears({smoking:'never', cigarettes:40, years:20}),0);
  assert.equal(packYears({smoking:'current'}), null);
});
test('unanswered assessment never represents low risk', () => {
  const result = assess({});
  assert.equal(result.score, null);
  assert.equal(result.level, 'Incomplete picture');
});
test('tobacco dose raises lung index, quitting does not erase smoking history', () => {
  const base = {age:45, smoking:'never'};
  const score = a => assess(a).cancers.find(c => c.id==='lung').score;
  assert.ok(score({...base, smoking:'current', cigarettes:40, years:25}) > score(base));
  assert.ok(score({...base, smoking:'former', cigarettes:20, years:20, quit:10}) > score(base));
});
test('absent organs are excluded and unknown anatomy is not silently excluded', () => {
  assert.equal(assess({age:30, prostate:'no'}).cancers.find(c => c.id==='prostate').applicable, false);
  assert.equal(assess({age:30}).cancers.find(c => c.id==='prostate').score, null);
});
test('known inherited variant and personal cancer history override reassuring copy', () => {
  const r=assess({age:22, genetic:'yes', previous:'yes'});
  assert.ok(r.alerts.length>=2);
});
test('first degree family history affects the matched cancer and explains itself', () => {
  const r=assess({age:40, family:'yes', relatives:[{relation:'parent', cancer:'colorectal', age:'under50'}]});
  assert.ok(r.cancers.find(c=>c.id==='colorectal').reasons.some(x=>x.text.includes('family')));
});
test('indices remain bounded even with many risk factors', () => {
  const r=assess({age:100, smoking:'current', cigarettes:100, years:80, alcohol:'high', genetic:'yes', activity:'low', units:'metric',height:150,weight:200});
  for(const c of r.cancers) if(c.score!==null) assert.ok(c.score>=0 && c.score<=100);
});
test('validation rejects impossible age and inconsistent smoking duration', () => {
  assert.ok(validate({age:13},0).some(x=>x.field==='age'));
  assert.ok(validate({age:30, smoking:'current', cigarettes:20, years:40},1).some(x=>x.field==='years'));
});
test('demographic labels do not change scores', () => {
  assert.equal(assess({age:50, ethnicity:'black', gender:'woman'}).score, assess({age:50, ethnicity:'asian', gender:'man'}).score);
});

test('unknown sun protection is never assumed to be absent protection',()=>{
 const c=assess({age:30,sun:'high',protection:'unknown'}).cancers.find(c=>c.id==='melanoma');
 assert.equal(c.score,0);
 assert.ok(c.missing.includes('protection'));
});
test('unspecified multiple infections do not silently assert both HPV and hepatitis',()=>{
 const r=assess({age:30,cervix:'yes',infection:'multiple'});
 assert.equal(r.cancers.find(c=>c.id==='cervical').score,0);
 assert.equal(r.cancers.find(c=>c.id==='liver').score,0);
 assert.ok(r.alerts.some(t=>t.includes('infections')));
});
test('hidden smoking history cannot block someone who corrected the answer to never',()=>{
 assert.deepEqual(validate({age:30,smoking:'never',years:50,cigarettes:20},1),[]);
});


test('feet and inches convert automatically and blank inches means zero',()=>{
 const a=changeUnits({units:'metric',height:182.88,weight:80},'imperial');
 assert.equal(a.heightFeet,6);assert.equal(a.heightInches,0);
 const back=changeUnits(a,'metric');assert.equal(back.height,182.88);
 assert.ok(Math.abs(bmi({units:'imperial',heightFeet:6,weight:176.37})-23.92)<.02);
 assert.equal(bmi({units:'imperial',heightInches:10,weight:160}),null);
});
test('imperial height validates both components and combined height',()=>{
 assert.ok(validate({age:30,units:'imperial',heightFeet:5,heightInches:12},0).some(e=>e.field==='heightInches'));
 assert.ok(validate({age:30,units:'imperial',heightFeet:5.5,heightInches:2},0).some(e=>e.field==='heightFeet'));
 assert.ok(validate({age:30,units:'imperial',heightInches:10},0).some(e=>e.field==='heightFeet'));
 assert.deepEqual(validate({age:30,units:'imperial',heightFeet:6},0),[]);
});
test('ages 14-17 get a separate exposure score even with adult answers retained',()=>{
 for(const age of [14,17]){
  assert.deepEqual(validate({age},0),[]);
  const r=assess({age,smoking:'current',cigarettes:20,years:3,units:'metric',height:140,weight:100,prostate:'yes',hormones:'combined'});
  assert.equal(r.teen,true);assert.equal(r.score,25);assert.deepEqual(r.cancers,[]);assert.equal(r.bmi,null);
  assert.ok(r.actions.some(x=>x.includes('tobacco')));
 }
 assert.notEqual(assess({age:18}).score,null);
});
test('adult BMI thresholds are not applied to ages 18 or 19',()=>{
 for(const age of [18,19]){
  const r=assess({age,units:'metric',height:140,weight:100});
  assert.equal(r.bmi,null);
  assert.ok(r.cancers.every(c=>!c.reasons.some(r=>r.text.includes('BMI'))));
 }
 assert.ok(assess({age:20,units:'metric',height:140,weight:100}).cancers.some(c=>c.reasons.some(r=>r.text.includes('BMI'))));
});


test('teen score is a bounded sum of disclosed points, without double-counting tobacco',()=>{
 const r=assess({age:14,smoking:'current',otherTobacco:'cigars',alcohol:'high',tanning:'current',burns:'many',sun:'high',protection:'rare',secondhand:'yes',exposure:'multiple',radon:'yes'});
 assert.equal(r.score,100);
 assert.equal(r.score,r.exposureFactors.reduce((sum,f)=>sum+f.points,0));
 assert.equal(r.exposureFactors.filter(f=>f.id==='tobacco').length,1);
});
test('teen unanswered inputs never receive a fabricated score',()=>{
 assert.equal(assess({age:14}).score,null);
 const r=assess({age:14,smoking:'never',sun:'high',protection:'unknown'});
 assert.equal(r.score,0);
 assert.ok(r.exposureMissing.includes('protection'));
});
test('teen medical concerns do not become exposure points or erase follow-up alerts',()=>{
 const r=assess({age:17,smoking:'never',previous:'yes',genetic:'yes',symptoms:'yes'});
 assert.equal(r.score,0);
 assert.ok(r.alerts.length>=3);
});
