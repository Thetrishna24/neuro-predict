var D = {
  alzheimers:{
    symptoms:[
      {id:'mem_short',label:'Short-term memory loss',weight:.15},
      {id:'word_find',label:'Word-finding difficulty',weight:.10},
      {id:'disoriented',label:'Disorientation to time/place',weight:.12},
      {id:'exec_func',label:'Executive function decline',weight:.10},
      {id:'repeat_q',label:'Repeating questions',weight:.09},
      {id:'face_recog',label:'Difficulty recognizing faces',weight:.08}],
    motor:[
      {id:'wander',label:'Wandering behavior',weight:.07},
      {id:'mood_change',label:'Mood/personality changes',weight:.06},
      {id:'depression',label:'Depression or apathy',weight:.05},
      {id:'sleep_disturb',label:'Sleep disturbances',weight:.05}],
    genetic:[
      {id:'apoe4',label:'APOE4 carrier (1 allele)',weight:.12},
      {id:'apoe4_hom',label:'APOE4 homozygous',weight:.20},
      {id:'fam_hist',label:'First-degree family history',weight:.15},
      {id:'down_syn',label:'Down syndrome in family',weight:.08}],
    biomarkers:[
      {id:'hippo_vol',label:'Hippocampal Vol (cm\u00B3)',placeholder:'3.5',ref:'3.5\u20135.0'},
      {id:'csf_abeta',label:'CSF A\u03B242 (pg/mL)',placeholder:'1000',ref:'>1000 normal'},
      {id:'csf_tau',label:'CSF p-tau (pg/mL)',placeholder:'50',ref:'<60 normal'}],
    factors:['Episodic Memory','Language','Orientation','Biomarkers','Genetics','Age Risk'],
    recs:[
      {icon:'&#129504;',color:'rgba(0,212,255,.15)',title:'Cognitive Battery',text:'Administer MoCA or MMSE. Consider comprehensive neuropsychological testing.'},
      {icon:'&#128444;',color:'rgba(124,58,237,.15)',title:'Neuroimaging',text:'MRI for hippocampal volume. Consider amyloid PET if uncertainty persists.'},
      {icon:'&#128300;',color:'rgba(16,185,129,.15)',title:'CSF Biomarkers',text:'LP for A\u03B242, total tau, p-tau181 significantly improves diagnostic confidence.'},
      {icon:'&#129516;',color:'rgba(245,158,11,.15)',title:'Genetic Counseling',text:'APOE genotyping with pre/post-test counseling. Refer genetics for family assessment.'}]
  },
  parkinsons:{
    symptoms:[
      {id:'tremor',label:'Resting tremor',weight:.18},
      {id:'bradykinesia',label:'Bradykinesia (slowed movement)',weight:.18},
      {id:'rigidity',label:'Muscular rigidity',weight:.15},
      {id:'postural',label:'Postural instability',weight:.12},
      {id:'micrographia',label:'Small handwriting',weight:.08},
      {id:'speech_pd',label:'Soft/slurred speech',weight:.08}],
    motor:[
      {id:'rem_sleep',label:'REM sleep behavior disorder',weight:.12},
      {id:'anosmia',label:'Loss of smell',weight:.10},
      {id:'constipation',label:'Chronic constipation',weight:.07},
      {id:'depression_pd',label:'Depression/anxiety',weight:.05}],
    genetic:[
      {id:'lrrk2',label:'LRRK2 mutation confirmed',weight:.20},
      {id:'gba',label:'GBA mutation carrier',weight:.15},
      {id:'fam_pd',label:'First-degree PD family history',weight:.12},
      {id:'head_trauma',label:'Repeated head trauma',weight:.08}],
    biomarkers:[
      {id:'dat_scan',label:'DaT Scan (0\u20133)',placeholder:'2',ref:'2\u20133 normal'},
      {id:'substantia',label:'SN echogenicity (0\u20131)',placeholder:'0',ref:'0=normal'},
      {id:'urate',label:'Serum Urate (mg/dL)',placeholder:'5.5',ref:'>5.5 protective'}],
    factors:['Motor Signs','Prodromal Sx','DAT Activity','Genetics','Age of Onset','Biomarkers'],
    recs:[
      {icon:'&#128694;',color:'rgba(0,212,255,.15)',title:'MDS-UPDRS Scale',text:'Administer for baseline motor and non-motor severity. Repeat every 6\u201312 months.'},
      {icon:'&#128444;',color:'rgba(124,58,237,.15)',title:'DaT SPECT Imaging',text:'Assesses dopaminergic integrity. High sensitivity distinguishing PD from ET.'},
      {icon:'&#128138;',color:'rgba(16,185,129,.15)',title:'Levodopa Challenge',text:'Positive response strongly supports PD diagnosis. Document systematically.'},
      {icon:'&#129516;',color:'rgba(245,158,11,.15)',title:'Genetic Panel',text:'GBA, LRRK2, SNCA testing \u2014 especially early-onset or familial cases.'}]
  },
  als:{
    symptoms:[
      {id:'limb_weak',label:'Progressive limb weakness',weight:.18},
      {id:'fascicul',label:'Muscle fasciculations',weight:.15},
      {id:'dysarthria',label:'Dysarthria (speech)',weight:.14},
      {id:'dysphagia',label:'Dysphagia (swallowing)',weight:.12},
      {id:'cramps',label:'Muscle cramps',weight:.08},
      {id:'foot_drop',label:'Foot drop / tripping',weight:.10}],
    motor:[
      {id:'hyperreflexia',label:'Hyperreflexia',weight:.12},
      {id:'babinski',label:'Babinski sign positive',weight:.14},
      {id:'bulbar',label:'Bulbar onset symptoms',weight:.10},
      {id:'emot_lability',label:'Emotional lability (PBA)',weight:.06}],
    genetic:[
      {id:'sod1',label:'SOD1 mutation confirmed',weight:.22},
      {id:'c9orf72',label:'C9orf72 expansion',weight:.22},
      {id:'fam_als',label:'Family history of ALS',weight:.15},
      {id:'ftd_hist',label:'Personal/family FTD history',weight:.10}],
    biomarkers:[
      {id:'emg',label:'EMG Abnormality (0\u20133)',placeholder:'0',ref:'0=normal'},
      {id:'neurofilament',label:'NfL plasma (pg/mL)',placeholder:'10',ref:'<10 normal'},
      {id:'conduction',label:'Nerve Conduction (0\u20131)',placeholder:'1',ref:'1=normal'}],
    factors:['UMN Signs','LMN Signs','Bulbar Involvement','Genetics','EMG/NCS','Progression Rate'],
    recs:[
      {icon:'&#9889;',color:'rgba(0,212,255,.15)',title:'EMG / Nerve Conduction',text:'Essential for ALS diagnosis. Apply El Escorial / Awaji criteria for certainty.'},
      {icon:'&#129516;',color:'rgba(124,58,237,.15)',title:'Genetic Testing',text:'Panel: SOD1, C9orf72, FUS, TARDBP, TBK1 \u2014 critical for counseling and trial eligibility.'},
      {icon:'&#128300;',color:'rgba(16,185,129,.15)',title:'Neurofilament Light Chain',text:'Plasma NfL is a promising biomarker for diagnosis and progression monitoring.'},
      {icon:'&#127973;',color:'rgba(245,158,11,.15)',title:'Multidisciplinary ALS Clinic',text:'MDA/ALS clinic referral \u2014 outcomes improved with interdisciplinary care.'}]
  },
  huntingtons:{
    symptoms:[
      {id:'chorea',label:'Choreiform movements',weight:.22},
      {id:'cog_decline',label:'Cognitive decline',weight:.16},
      {id:'psych',label:'Psychiatric symptoms',weight:.14},
      {id:'balance',label:'Balance / gait problems',weight:.12},
      {id:'slowed_eye',label:'Slowed eye movements',weight:.10},
      {id:'dysarthria_hd',label:'Dysarthria',weight:.08}],
    motor:[
      {id:'irritability',label:'Irritability / aggression',weight:.10},
      {id:'ocd',label:'OCD-like behaviors',weight:.06},
      {id:'depression_hd',label:'Depression / suicidality',weight:.08},
      {id:'sleep_hd',label:'Sleep disturbances',weight:.05}],
    genetic:[
      {id:'htt_known',label:'HTT CAG expansion confirmed',weight:.50},
      {id:'fam_hd',label:'First-degree family with HD',weight:.30},
      {id:'presymptomatic',label:'At-risk (parent affected)',weight:.20},
      {id:'juvenile',label:'Onset age <20 years',weight:.15}],
    biomarkers:[
      {id:'cag_repeat',label:'CAG repeat count',placeholder:'17',ref:'<36 normal'},
      {id:'caudate_vol',label:'Caudate volume (cm\u00B3)',placeholder:'5',ref:'varies'},
      {id:'moca_hd',label:'MoCA score (/30)',placeholder:'26',ref:'>26 normal'}],
    factors:['Motor Signs','Cognitive','Psychiatric','CAG Repeat','Caudate Atrophy','Family History'],
    recs:[
      {icon:'&#129516;',color:'rgba(0,212,255,.15)',title:'HTT CAG Repeat Testing',text:'CAG\u226540 fully penetrant. 36\u201339 reduced penetrance. Requires genetic counseling.'},
      {icon:'&#128444;',color:'rgba(124,58,237,.15)',title:'Structural MRI',text:'Caudate nucleus atrophy is a hallmark. Longitudinal imaging tracks progression.'},
      {icon:'&#129504;',color:'rgba(16,185,129,.15)',title:'Neuropsychological Testing',text:'Assess executive function, psychomotor speed, and visuospatial ability.'},
      {icon:'&#10084;',color:'rgba(245,158,11,.15)',title:'Genetic Counseling Required',text:'Mandatory pre/post-test counseling given autosomal dominant inheritance.'}]
  },
  msa:{
    symptoms:[
      {id:'autonomic',label:'Autonomic failure (OH)',weight:.20},
      {id:'cerebellar',label:'Cerebellar ataxia',weight:.16},
      {id:'parkinsonism',label:'Levodopa-poor parkinsonism',weight:.16},
      {id:'urinary',label:'Urinary incontinence',weight:.12},
      {id:'stridor',label:'Inspiratory stridor',weight:.14},
      {id:'rbd_msa',label:'REM sleep behavior disorder',weight:.10}],
    motor:[
      {id:'vertical_gaze',label:'Vertical gaze palsy',weight:.18},
      {id:'falls',label:'Early falls (PSP pattern)',weight:.14},
      {id:'axial_rigid',label:'Axial rigidity',weight:.10},
      {id:'retrocollis',label:'Retrocollis',weight:.12}],
    genetic:[
      {id:'coq2',label:'COQ2 mutation',weight:.15},
      {id:'fam_msa',label:'Family history atypical parkinsonism',weight:.10},
      {id:'male_sex_msa',label:'Male sex (PSP risk)',weight:.06},
      {id:'no_levodopa',label:'No levodopa response',weight:.15}],
    biomarkers:[
      {id:'putamen_signal',label:'Putaminal signal (0\u20132)',placeholder:'0',ref:'0=normal'},
      {id:'midbrain',label:'Midbrain area (mm\u00B2)',placeholder:'130',ref:'>130 normal'},
      {id:'skin_biopsy',label:'\u03B1-syn biopsy (0/1)',placeholder:'0',ref:'0=negative'}],
    factors:['Autonomic Failure','Parkinsonism','Cerebellar Sx','MRI Findings','Levodopa Response','Gaze Palsy'],
    recs:[
      {icon:'&#128444;',color:'rgba(0,212,255,.15)',title:'Brain MRI with SWI',text:'Putaminal rim sign, hot-cross bun sign (pons), and midbrain atrophy are key hallmarks.'},
      {icon:'&#10084;',color:'rgba(124,58,237,.15)',title:'Autonomic Testing',text:'Tilt-table, QSART, sudomotor testing to characterize autonomic failure in MSA.'},
      {icon:'&#128138;',color:'rgba(16,185,129,.15)',title:'Levodopa Trial',text:'Absent/minimal response supports MSA/PSP over PD.'},
      {icon:'&#127973;',color:'rgba(245,158,11,.15)',title:'Movement Disorders Center',text:'Atypical parkinsonism needs specialized expertise for diagnosis and management.'}]
  }
};
