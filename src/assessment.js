import { visibleFields, isTeen } from './questions.js';
export const SOURCES={
 childhood:'https://www.cancer.gov/types/childhood-cancers/child-adolescent-cancers-fact-sheet',
 teenBmi:'https://www.cdc.gov/bmi/child-teen-calculator/bmi-categories.html',
 nci:'https://www.cancer.gov/about-cancer/causes-prevention/risk',
 prevention:'https://www.cancer.gov/about-cancer/causes-prevention/patient-prevention-overview-pdq',
 screening:'https://www.cancer.org/cancer/screening/american-cancer-society-guidelines-for-the-early-detection-of-cancer.html',
 cdc:'https://www.cdc.gov/cancer/prevention/index.html',
 donation:'https://www.stjude.org/donate/donate-to-st-jude.html'
};
export const DISCLAIMER='This is only a rough estimate based on population-level risk factors. It is not a medical diagnosis, not personalized medical advice, and should never replace talking to a real doctor.';
export function heightCm(a){
 if(a.units!=='imperial')return Number(a.height)>0?Number(a.height):null;
 if(!Number.isInteger(Number(a.heightFeet))||Number(a.heightFeet)<=0)return null;
 const inches=Number(a.heightInches||0);
 if(!Number.isFinite(inches)||inches<0||inches>=12)return null;
 return (Number(a.heightFeet)*12+inches)*2.54;
}
export function changeUnits(a,units){
 if(a.units===units)return {...a};
 const h=heightCm(a),next={...a,units};
 if(units==='imperial'){
  const inches=h===null?null:Math.round(h/2.54*100)/100;
  next.heightFeet=inches===null?'':Math.floor(inches/12);
  next.heightInches=inches===null?'':+(inches%12).toFixed(2);
 }else next.height=h===null?'':+h.toFixed(2);
 if(a.weight!==undefined&&a.weight!=='')next.weight=+(Number(a.weight)*(units==='imperial'?1/.45359237:.45359237)).toFixed(2);
 return next;
}
export function bmi(a){
 const h=heightCm(a);
 if(!h||!Number(a.weight))return null;
 const w=a.units==='imperial'?Number(a.weight)*.45359237:Number(a.weight);
 return w/((h/100)**2);
}
export function packYears(a){
 if(a.smoking==='never')return 0;
 if(!['former','current'].includes(a.smoking)||!Number(a.cigarettes)||!Number(a.years))return null;
 return Number(a.cigarettes)/20*Number(a.years);
}
export function validate(a,step){
 const errors=[];
 for(const f of visibleFields(step,a)){
  const v=a[f.id];
  if(f.id==='age' && (v===''||v===undefined))errors.push({field:f.id,message:'Enter your age to continue.'});
  if(f.type==='number' && v!=='' && v!==undefined){
   let min=f.min,max=f.max;
      if(a.units==='imperial'&&f.id==='weight'){min=55;max=880;}
   if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max||(['age','heightFeet'].includes(f.id)&&!Number.isInteger(Number(v))))errors.push({field:f.id,message:`Enter ${['age','heightFeet'].includes(f.id)?'a whole number':'a number'} from ${min} to ${max}.`});
  }
  if(f.id==='consent'&&!v)errors.push({field:f.id,message:'Please acknowledge the limitations before viewing your results.'});
 }
 if(step===0&&a.units==='imperial'){
  if(a.heightInches!==undefined&&a.heightInches!==''&&!Number(a.heightFeet))errors.push({field:'heightFeet',message:'Enter feet as well as inches, or leave both height fields blank.'});
  const h=heightCm(a);
  if(h!==null&&(h<90||h>250))errors.push({field:'heightFeet',message:'Total height must be between approximately 2 ft 11.44 in and 8 ft 2.42 in.'});
 }
 if(step===1&&['current','former'].includes(a.smoking)){
  if(Number(a.years)>Number(a.age))errors.push({field:'years',message:'Years smoked cannot exceed your age.'});
  if(a.smoking==='former'&&Number(a.years)+Number(a.quit)>Number(a.age))errors.push({field:'quit',message:'Years smoked plus years since quitting cannot exceed your age.'});
 }
 if(step===2&&a.family==='yes'&&(!a.relatives?.length||a.relatives.some(r=>!r.relation||!r.cancer||!r.age)))errors.push({field:'relatives',message:'Complete each relative’s details, or choose “Not sure” above.'});
 return errors;
}
const TYPES=[
 ['lung','Lung',null,['smoking','secondhand','exposure','radon']],
 ['breast','Breast','breast',['alcohol','menopause','hormones','radiation']],
 ['colorectal','Colorectal',null,['processed','redmeat','activity','polyps','alcohol']],
 ['prostate','Prostate','prostate',[]],
 ['melanoma','Skin / melanoma',null,['sun','protection','burns','tanning','skin']],
 ['pancreatic','Pancreatic',null,['smoking','diabetes']],
 ['bladder','Bladder',null,['smoking']],
 ['kidney','Kidney',null,['smoking']],
 ['liver','Liver',null,['alcohol','infection','diabetes']],
 ['cervical','Cervical','cervix',['infection','smoking','immune']],
 ['ovarian','Ovarian','ovaries',[]],
 ['uterine','Uterine / endometrial','uterus',['hormones','diabetes']]
];
const known=v=>v!==undefined&&v!==''&&v!=='unknown';
const band=s=>s>=50?'More factors flagged':s>=25?'Some factors flagged':'Fewer factors flagged';
// An editorial exposure checklist, deliberately separate from the adult cancer profiles.
// These point values have no calibrated relationship to childhood cancer likelihood.
function teenExposure(a){
 const fields=['smoking','otherTobacco','alcohol','tanning','burns','sun','protection','secondhand','exposure','radon'];
 const exposureMissing=fields.filter(k=>!known(a[k]));
 const exposureFactors=[];
 const add=(id,points,text)=>{if(points>0)exposureFactors.push({id,points,text});};
 const cigarettes=a.smoking==='current'?25:a.smoking==='former'?10:0;
 const other=['cigars','multiple'].includes(a.otherTobacco)?25:a.otherTobacco==='smokeless'?20:0;
 add('tobacco',Math.max(cigarettes,other),'Reported current or past tobacco use. Only the highest tobacco category is counted. Vaping alone receives no points in this checklist.');
 add('alcohol',({light:5,moderate:8,higher:12,high:15})[a.alcohol]||0,'Reported weekly alcohol consumption. These points are a rough exposure flag, not a dose-to-cancer calculation.');
 const tanning=['past','current'].includes(a.tanning)?15:0;
 const burns=['some','many'].includes(a.burns)?5:0;
 const sun=a.sun==='high'&&['sometimes','rare'].includes(a.protection)?5:0;
 add('uv',tanning+burns+sun,`Reported UV exposure: tanning beds +${tanning}, severe sunburns +${burns}, frequent strong sun with inconsistent protection +${sun}.`);
 add('secondhand',a.secondhand==='yes'?10:0,'Reported regular secondhand smoke exposure.');
 add('exposure',['asbestos','benzene','multiple'].includes(a.exposure)?15:0,'Reported repeated exposure to listed harmful substances. The type and dose need individual review.');
 add('radon',a.radon==='yes'?10:0,'Reported elevated home radon test.');
 const score=exposureMissing.length===fields.length?null:exposureFactors.reduce((sum,f)=>sum+f.points,0);
 return {score,exposureFactors,exposureMissing,exposureTotal:fields.length};
}
export function assess(a){
 const py=packYears(a), body=Number(a.age)>=20?bmi(a):null, alerts=[];
 if(a.infection==='multiple')alerts.push('You reported multiple infections. Their exact types need individual review; this tool does not assign infection-specific points without a clearly identified infection. Discuss treatment and monitoring with your clinician.');
 if(a.symptoms==='yes')alerts.push('New or persistent unexplained symptoms need medical evaluation. Book a clinician appointment; this tool cannot rule out cancer. Seek urgent care for severe symptoms.');
 if(a.previous==='yes')alerts.push('A previous cancer diagnosis needs an individual follow-up or survivorship plan. This general-population tool cannot estimate recurrence or second-cancer risk.');
 if(a.genetic==='yes')alerts.push('A known inherited cancer-risk variant needs an individual assessment. Talk with your care team or a genetic counselor about a syndrome-specific plan.');
 if(a.family==='yes')alerts.push('Bring your family history to a clinician, especially if a close relative was diagnosed young or several relatives had related cancers.');
 if(isTeen(a)){
  const relevant=Array.from({length:8},(_,i)=>visibleFields(i,a)).flat().filter(f=>!['consent','units','relatives','previousType'].includes(f.id));
  const answered=relevant.filter(f=>known(a[f.id])).length;
  const actions=[];
  if(['current','former'].includes(a.smoking)||['smokeless','cigars','vape','multiple'].includes(a.otherTobacco))actions.push('You mentioned tobacco or vaping. A healthcare professional can help you stop or stay stopped without judging you.');
  if(known(a.alcohol)&&a.alcohol!=='none')actions.push('You reported drinking alcohol. For teens, avoiding alcohol is the safest choice; ask a healthcare professional for support if you need it.');
  if(['past','current'].includes(a.tanning)||['some','many'].includes(a.burns)||a.sun==='high')actions.push('You reported UV exposure or sunburns. Avoid tanning beds and use shade, protective clothing and sunscreen.');
  if(a.hpvVaccine!=='yes')actions.push('Ask a healthcare professional about your HPV vaccination record and whether you need any doses.');
  if(a.followup==='help')actions.push('You said you need help arranging follow-up. A school nurse, healthcare professional or trusted adult can help you make that appointment.');
  if(a.support==='no')actions.push('You don’t have to handle health concerns alone. A school nurse or healthcare professional can be a starting point if there is no trusted adult available.');
  actions.push('Choose movement you enjoy, eat a varied diet and avoid tobacco. These support long-term health; they do not predict or guarantee protection from childhood cancer.');
  return {teen:true,...teenExposure(a),level:'Reported exposure score',cancers:[],alerts,actions,answered,total:relevant.length,unknown:relevant.length-answered,bmi:null,packYears:py};
 }
 const cancers=TYPES.map(([id,name,organ,keys])=>{
  const applicable=organ?(a[organ]==='yes'?true:a[organ]==='no'?false:null):true;
  const reasons=[];
  const add=(points,text,source=SOURCES.nci)=>reasons.push({points,text,source});
  // Editorial points: association directions are evidence-informed; magnitudes are NOT clinical coefficients.
  if(Number(a.age)>=65)add(20,'Older age is associated with many cancers. This broad age rule is not a cancer-specific probability.');
  else if(Number(a.age)>=45)add(10,'Age adds context: many cancers become more common with increasing age.');
  if(['lung','pancreatic','bladder','kidney','cervical','colorectal'].includes(id)&&['current','former'].includes(a.smoking)){
   const dose=py===null?12:Math.min(40,12+Math.round(py*.65));
   add(id==='lung'?dose:Math.round(dose*.45),`${a.smoking==='former'?'Past':'Current'} cigarette smoking${py===null?' (dose unknown)':` · ${py.toFixed(1)} pack-years`}. ${a.smoking==='former'?'Quitting helps, but past exposure still matters.':'Tobacco is a major preventable cancer exposure.'}`);
  }
  if(id==='lung'){
   if(a.secondhand==='yes')add(8,'Regular secondhand smoke exposure adds a lung cancer risk factor.');
   if(['asbestos','multiple'].includes(a.exposure))add(18,'Reported workplace lung carcinogen exposure warrants occupational health advice.');
   if(a.radon==='yes')add(15,'An elevated home radon test is actionable. Arrange mitigation.');
  }
  if(['breast','colorectal','liver'].includes(id)&&known(a.alcohol)&&a.alcohol!=='none')add(({light:4,moderate:8,higher:13,high:20})[a.alcohol]||0,'Alcohol adds risk. Less is better for cancer prevention; no amount is risk-free.');
  if(body>=30&&(['colorectal','pancreatic','kidney','liver','uterine'].includes(id)||(id==='breast'&&a.menopause==='yes')))add(12,'BMI in the obesity range is linked with this cancer. BMI is limited and does not capture your whole health.');
  if(id==='colorectal'){
   if(a.processed==='often')add(12,'Frequent processed meat intake adds a colorectal risk factor.');
   else if(a.processed==='some')add(5,'Regular processed meat intake adds a colorectal risk factor.');
   if(a.redmeat==='high')add(6,'High red meat intake adds a colorectal risk factor.');
   if(a.plants==='rare')add(5,'Your reported pattern may be low in fiber-rich foods.');
   if(['polyps','ibd','both'].includes(a.polyps))add(20,'Colorectal polyps or inflammatory bowel disease may need a tailored screening plan.');
  }
  if(['colorectal','breast','uterine'].includes(id)&&a.activity==='low')add(7,'Low physical activity adds a potentially modifiable factor.');
  if(id==='breast'){
   if(a.hormones==='combined')add(12,'Combined menopausal hormone therapy can increase breast cancer risk. Discuss formulation and duration with your prescriber.');
   if(a.radiation==='yes')add(12,'Past radiation therapy needs individual review; field, dose and age at treatment matter.');
  }
  if(id==='uterine'&&a.hormones==='estrogen')add(18,'Estrogen-only menopausal therapy with a uterus needs prescriber review for endometrial protection.');
  if(id==='melanoma'){
   if(a.sun==='high'&&['sometimes','rare'].includes(a.protection))add(10,'Frequent strong sun exposure without consistent protection adds UV exposure.');
   if(a.burns==='some')add(8,'A history of severe sunburns adds risk.');
   if(a.burns==='many')add(18,'Repeated severe sunburns add a substantial UV-related factor.');
   if(['past','current'].includes(a.tanning))add(a.tanning==='current'?25:18,'Tanning beds expose skin to carcinogenic ultraviolet radiation.');
   if(a.skin==='burns')add(8,'Skin that burns easily is more susceptible to UV damage.');
   if(a.immune==='yes')add(10,'Immune suppression warrants an individual skin surveillance plan.');
  }
  if(['pancreatic','liver','uterine'].includes(id)&&a.diabetes==='yes')add(8,'Type 2 diabetes is associated with this cancer; it does not mean cancer is present.');
  if(id==='liver'&&a.infection==='hepatitis')add(30,'Hepatitis B or C can substantially affect liver cancer risk. Infection treatment and monitoring matter.');
  if(id==='cervical'&&a.infection==='hpv')add(30,'Persistent high-risk HPV is a major cervical cancer risk factor. Follow your clinician’s screening advice.');
  if(id==='cervical'&&a.immune==='yes')add(12,'Immune suppression can affect HPV persistence and cervical screening needs.');
  if(a.family==='yes')for(const r of a.relatives||[]){
   if(r.cancer===id)add(['parent','sibling','child'].includes(r.relation)?(r.age==='under50'?22:15):7,`Reported family history: ${r.relation==='auntuncle'?'aunt / uncle':r.relation}, ${r.age==='under50'?'diagnosed before 50':r.age==='over50'?'diagnosed at 50 or older':'age unknown'}.`);
  }
  const inputs=['age','family','genetic',...keys,...(organ?[organ]:[])];
  const missing=inputs.filter(k=>!known(a[k]));
  const score=applicable===true&&known(a.age)?Math.min(100,reasons.reduce((s,r)=>s+r.points,0)):null;
  return {id,name,applicable,score,reasons,missing,level:applicable===false?'Not applicable':score===null?'Not enough information':band(score)};
 });
 const scores=cancers.filter(c=>c.score!==null).map(c=>c.score);
 // The peak, not an average: a single exposure should not be diluted by unrelated cancer categories.
 const score=scores.length?Math.max(...scores):null;
 const relevant=Array.from({length:8},(_,i)=>visibleFields(i,a)).flat().filter(f=>!['consent','units','relatives','previousType'].includes(f.id));
 const answered=relevant.filter(f=>known(a[f.id])).length;
 return {score,level:score===null?'Incomplete picture':band(score),cancers,alerts,answered,total:relevant.length,unknown:relevant.length-answered,bmi:body,packYears:py};
}
