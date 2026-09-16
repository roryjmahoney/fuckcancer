export const unknown = ['unknown', 'Not sure / prefer not to say'];
const yesno = [['no','No'],['yes','Yes'],unknown];
const choose=(id,label,options,hint='',when=null)=>({id,label,options,hint,when,type:'select'});
const num=(id,label,min,max,hint='',when=null)=>({id,label,min,max,hint,when,type:'number'});
export const steps = [
 { short:'The basics', title:'First, a little about you.', intro:'No names. No emails. Just the basics that help put your answers in context.', fields:[
  num('age','How old are you?',14,100,'For ages 14–100. Ages 14–17 receive a teen exposure score with clear accuracy limitations.'),
  choose('sex','Sex assigned at birth',[['female','Female'],['male','Male'],['intersex','Intersex'],unknown],'Context only. We ask about relevant organs separately.'),
  choose('gender','Gender identity',[['woman','Woman'],['man','Man'],['nonbinary','Non-binary'],['self','Another identity'],unknown]),
  choose('ethnicity','Ethnicity / ancestry',[['asian','Asian'],['black','Black / African ancestry'],['hispanic','Hispanic / Latino'],['indigenous','Indigenous'],['middle','Middle Eastern / North African'],['white','White / European ancestry'],['mixed','Mixed / another ancestry'],unknown],'Not used to assign points. Broad identity categories cannot describe your individual risk.'),
  {id:'units',type:'radio',label:'Height & weight units',options:[['metric','Metric · cm / kg'],['imperial','Imperial · ft + in / lb']]},
  num('height','Height',90,250,'An estimate is fine. Leave blank if you prefer.',a=>a.units!=='imperial'),
  num('heightFeet','Height — feet',2,8,'Whole feet. Both height fields are optional.',a=>a.units==='imperial'),
  num('heightInches','Height — inches',0,11.99,'Extra inches, from 0 to under 12. Blank means 0 when feet are entered.',a=>a.units==='imperial'),
  num('weight','Weight',25,400,'Optional. For people under 20, this tool does not interpret weight or BMI.')
 ]},
 {short:'Smoking & alcohol',title:'Let’s talk about the usual suspects.',intro:'Be honest. You’re not being graded, and shame doesn’t help anyone.',fields:[
  {id:'smoking',type:'radio',label:'Have you smoked cigarettes?',options:[['never','Never'],['former','Used to'],['current','Currently'],unknown]},
  num('cigarettes','Average cigarettes per day',1,100,'Use the average across the years you smoked.',a=>['current','former'].includes(a.smoking)),
  num('years','Total years smoked',.5,85,'Add separate periods together.',a=>['current','former'].includes(a.smoking)),
  num('quit','Years since quitting',0,85,'Enter 0 if you stopped less than a year ago.',a=>a.smoking==='former'),
  choose('secondhand','Regular secondhand smoke exposure?',yesno,'At home, in a vehicle, or at work.'),
  choose('otherTobacco','Other tobacco or nicotine products',[['none','None'],['smokeless','Chewing tobacco / snuff'],['cigars','Cigars / pipe'],['vape','Vaping only'],['multiple','Several products'],unknown],'Vaping does not receive cancer points here: long-term cancer risk cannot be reliably quantified.'),
  choose('alcohol','Alcohol in a typical week',[['none','None'],['light','1–3 drinks'],['moderate','4–7 drinks'],['higher','8–14 drinks'],['high','15+ drinks'],unknown],'One US standard drink: 12 oz beer (5%), 5 oz wine (12%), or 1.5 oz spirits (40%).')
 ]},
 {short:'Family history',title:'Some things run in the family.',intro:'Family history isn’t destiny. But it can be a damn good reason to start a conversation.',fields:[
  choose('family','Have any blood relatives had cancer?',yesno,'Include parents, siblings, children, grandparents, aunts and uncles.'),
  {id:'relatives',type:'family',label:'Tell us about each relative',when:a=>a.family==='yes'},
  choose('genetic','Known inherited cancer-risk variant?',yesno,'For example BRCA1, BRCA2, Lynch syndrome or a clinician-confirmed inherited cancer syndrome. “Not sure” is completely valid.')
 ]},
 {short:'Food & movement',title:'Your everyday adds up.',intro:'No miracle foods. No detox bullshit. Just patterns over time.',fields:[
  choose('activity','Moderate physical activity per week',[['low','Under 30 minutes'],['some','30–149 minutes'],['active','150+ minutes'],unknown],'Brisk walking counts. For vigorous activity, count each minute as about two moderate minutes.'),
  choose('sitting','Typical sitting time per day',[['low','Under 6 hours'],['middle','6–9 hours'],['high','10+ hours'],unknown],'Recorded for your discussion notes; not scored separately.'),
  choose('processed','Processed meat per week',[['none','Rarely / never'],['some','1–3 servings'],['often','4+ servings'],unknown],'Bacon, sausages, hot dogs and deli meats. A serving is roughly 50 g.'),
  choose('redmeat','Red meat per week',[['low','Under 350 g cooked'],['middle','350–500 g cooked'],['high','Over 500 g cooked'],unknown]),
  choose('plants','Whole grains, beans, fruit & vegetables',[['often','Most meals'],['some','About once a day'],['rare','Less than daily'],unknown],'A rough dietary pattern, not a nutrient calculation.')
 ]},
 {short:'Sun & environment',title:'What you’re exposed to matters.',intro:'The sun. The job. The air. Let’s look beyond your daily habits.',fields:[
  choose('sun','Time outdoors in strong midday sun',[['low','Usually under 30 minutes'],['middle','30 minutes–2 hours most days'],['high','Over 2 hours most days'],unknown]),
  choose('protection','Sun protection when outdoors',[['usually','Usually: shade, clothing and sunscreen'],['sometimes','Sometimes'],['rare','Rarely'],unknown]),
  choose('burns','Severe / blistering sunburns in your lifetime',[['none','None'],['some','1–4'],['many','5 or more'],unknown]),
  choose('tanning','Indoor tanning bed use',[['never','Never'],['past','Used in the past'],['current','Currently use'],unknown]),
  choose('skin','How does your skin usually react to sun?',[['burns','Burns easily / rarely tans'],['both','Sometimes burns / sometimes tans'],['tans','Rarely burns'],unknown],'All skin tones can develop skin cancer.'),
  choose('exposure','Known occupational carcinogen exposure',[['none','No known exposure'],['asbestos','Asbestos / silica / diesel exhaust'],['benzene','Benzene'],['multiple','Several of these'],unknown],'Think repeated workplace exposure, not a single passing encounter. This is not a complete occupational assessment.'),
  choose('radon','Has your home had an elevated radon test?',yesno,'Radon is an invisible gas. “No” means tested and not elevated; choose “Not sure” if untested.')
 ]},
 {short:'Medical history',title:'The bigger medical picture.',intro:'These answers may matter more than any score. Keep your care team in the loop.',fields:[
  choose('previous','Have you ever been diagnosed with cancer?',yesno),
  {id:'previousType',type:'text',label:'Which cancer, and approximately when?',hint:'Optional. These notes are not scored.',when:a=>a.previous==='yes'},
  choose('radiation','Previous radiation therapy?',yesno,'Cancer treatment radiation, especially to the chest. Routine X-rays and CT scans are not counted here. Do not avoid a medically needed scan.'),
  choose('polyps','Colorectal polyps or inflammatory bowel disease?',[['no','Neither'],['polyps','Previous colorectal polyps'],['ibd','Crohn’s colitis / ulcerative colitis'],['both','Both'],unknown]),
  choose('diabetes','Have you been diagnosed with type 2 diabetes?',yesno),
  choose('infection','Known persistent infection',[['none','None known'],['hpv','High-risk HPV'],['hepatitis','Hepatitis B or C'],['hpylori','H. pylori'],['multiple','More than one of these'],unknown]),
  choose('immune','Long-term immune suppression?',yesno,'For example after an organ transplant, or from a diagnosed immune condition.'),
  choose('symptoms','New or persistent unexplained symptoms?',yesno,'For example a lump, bleeding, changing mole or unexplained weight loss. This tool cannot assess symptoms.')
 ]},
 {short:'Hormones & anatomy',title:'Your body. Your context.',intro:'Only answer what applies. Identity alone does not tell us which organs you have.',fields:[
  choose('breast','Do you have breast tissue?',yesno,'Most people, including men, have breast tissue. After surgery, ask your clinician what screening applies.'),
  choose('prostate','Do you have a prostate?',yesno),
  choose('cervix','Do you have a cervix?',yesno),
  choose('uterus','Do you have a uterus?',yesno),
  choose('ovaries','Do you have ovaries?',yesno),
  choose('menopause','Have you gone through menopause?',[['no','No'],['yes','Yes'],['na','Not applicable'],unknown]),
  choose('hormones','Current or previous hormone use',[['none','None'],['combined','Combined estrogen + progestin menopausal therapy'],['estrogen','Estrogen-only menopausal therapy'],['contraception','Hormonal contraception'],['affirming','Gender-affirming hormones'],['other','Other / multiple'],unknown],'Never stop prescribed hormones based on this tool. Duration, dose and formulation matter.'),
  choose('period','Age at first menstrual period',[['early','Before 12'],['later','12 or older'],['na','Not applicable'],unknown]),
  choose('birth','First full-term pregnancy',[['before','Before age 30'],['after','Age 30 or older'],['never','No full-term pregnancy'],['na','Not applicable'],unknown],'Reproductive history is complex. These answers are discussion context and do not receive points.'),
  choose('feeding','Lifetime breastfeeding',[['none','None'],['short','Under 12 months'],['long','12+ months'],['na','Not applicable'],unknown])
 ]},
 {short:'Review & results',title:'One last look. Then a plan.',intro:'Check your answers. You can change anything before seeing your risk-factor profile.',fields:[
  choose('screening','Are you up to date with recommended screening?',[['yes','Yes, as far as I know'],['no','No / overdue'],['unknown','Not sure'],['na','None currently recommended']], 'Recorded as an action item, not scored. Eligibility depends on your medical history and local guidelines.'),
  {id:'consent',type:'checkbox',label:'I understand this is an educational, unvalidated risk-factor estimate—not a diagnosis or a prediction of whether I will get cancer.'}
 ]}
];
export const isTeen=a=>Number(a.age)>=14&&Number(a.age)<18;
export function stepDefinition(index,a){
 if(!isTeen(a))return steps[index];
 if(index===6)return {short:'Support & prevention',title:'You don’t have to figure this out alone.',intro:'A doctor, nurse or trusted adult can help. These questions are optional.',fields:[
  choose('hpvVaccine','Have you received the HPV vaccine?',[['yes','Yes'],['no','No'],unknown],'If you’re unsure, ask your healthcare team about your vaccination record. This does not change a cancer score.'),
  choose('support','Is there someone safe you can talk to about your health?',[['yes','Yes'],['no','Not right now'],unknown],'This could be a trusted adult, school nurse or healthcare professional. You do not have to share answers with anyone who makes you feel unsafe.')
 ]};
 const fields=steps[index].fields.map(f=>{
  if(f.id==='activity')return choose('teenActivity','How often do you move or play actively?',[['daily','Most days'],['some','Some days'],['rare','Rarely'],unknown],'Walking, dancing, sports and accessible activities all count. This is for discussion, not cancer scoring.');
  if(f.id==='exposure')return {...f,label:'Known repeated exposure to harmful substances?',hint:'For example at a job or through hobbies. If you’re unsure, a trusted adult or healthcare professional can help.'};
  if(f.id==='screening')return choose('followup','Has a clinician recommended follow-up for you?',[['yes','Yes, and I’m following the plan'],['help','Yes, but I need help arranging it'],['no','No'],unknown],'For example after treatment or because of a medical condition. Adult screening schedules do not apply automatically to teens.');
  if(f.id==='consent')return {...f,label:'I understand this is an unvalidated, potentially inaccurate exposure score and prevention summary—not a cancer probability, diagnosis or medical advice.'};
  return f;
 });
 return {...steps[index],fields};
}
export const visibleFields=(step,a)=>stepDefinition(step,a).fields.filter(f=>!f.when||f.when(a));
export const cancerOptions=[['lung','Lung'],['breast','Breast'],['colorectal','Colorectal'],['prostate','Prostate'],['melanoma','Skin / melanoma'],['pancreatic','Pancreatic'],['ovarian','Ovarian'],['uterine','Uterine / endometrial'],['cervical','Cervical'],['liver','Liver'],['kidney','Kidney'],['bladder','Bladder'],['other','Other / not sure']];
export const relationOptions=[['parent','Parent'],['sibling','Sibling'],['child','Child'],['grandparent','Grandparent'],['auntuncle','Aunt / uncle'],['other','Other blood relative']];
