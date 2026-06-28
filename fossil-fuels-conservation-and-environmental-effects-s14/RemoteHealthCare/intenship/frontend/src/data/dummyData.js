export const statsData = [
  {
    id: 'total-patients',
    title: 'Total Patients',
    value: '12,842',
    change: '+14%',
    isPositive: true,
    timeframe: 'vs last month',
    color: 'blue'
  },
  {
    id: 'active-emergencies',
    title: 'Active Emergencies',
    value: '18',
    change: '-5%',
    isPositive: false, // Decreasing emergencies is good, but standard Red/Green applies to trend
    timeframe: 'vs yesterday',
    color: 'red'
  },
  {
    id: 'admins-available',
    title: 'System Admins',
    value: '8',
    change: 'Roster active',
    isPositive: true,
    timeframe: 'staff roster',
    color: 'green'
  },
  {
    id: 'reports-uploaded',
    title: 'Reports Uploaded',
    value: '1,420',
    change: '+28%',
    isPositive: true,
    timeframe: 'this week',
    color: 'purple'
  }
];

export const patientActivityData = [
  { name: 'Jan', activePatients: 4200, outpatient: 2400, inpatient: 1800 },
  { name: 'Feb', activePatients: 4500, outpatient: 2700, inpatient: 1800 },
  { name: 'Mar', activePatients: 5100, outpatient: 3000, inpatient: 2100 },
  { name: 'Apr', activePatients: 4800, outpatient: 2900, inpatient: 1900 },
  { name: 'May', activePatients: 5600, outpatient: 3400, inpatient: 2200 },
  { name: 'Jun', activePatients: 6200, outpatient: 3800, inpatient: 2400 },
  { name: 'Jul', activePatients: 6900, outpatient: 4100, inpatient: 2800 },
];

export const emergencyCasesData = [
  { name: 'Mon', cardiac: 4, trauma: 8, stroke: 2, other: 5 },
  { name: 'Tue', cardiac: 6, trauma: 5, stroke: 4, other: 3 },
  { name: 'Wed', cardiac: 8, trauma: 9, stroke: 1, other: 6 },
  { name: 'Thu', cardiac: 3, trauma: 6, stroke: 3, other: 4 },
  { name: 'Fri', cardiac: 5, trauma: 11, stroke: 5, other: 8 },
  { name: 'Sat', cardiac: 9, trauma: 14, stroke: 2, other: 9 },
  { name: 'Sun', cardiac: 7, trauma: 12, stroke: 3, other: 7 },
];

export const recordTypesData = [
  { name: 'Prescriptions', value: 580, color: '#3b82f6' }, // Blue
  { name: 'Lab Reports', value: 390, color: '#10b981' },    // Green
  { name: 'MRI/CT Scans', value: 180, color: '#f59e0b' },   // Amber
  { name: 'Discharge Summaries', value: 110, color: '#8b5cf6' }, // Purple
  { name: 'Immunization Files', value: 95, color: '#ec4899' },  // Pink
];

export const recentActivities = [
  {
    id: 'act-1',
    user: 'Dr. Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    role: 'Cardiologist',
    action: 'Uploaded ECG Scan for Patient John Doe',
    category: 'Scan',
    date: 'Just now',
    status: 'completed'
  },
  {
    id: 'act-2',
    user: 'Ambulance Unit 4',
    avatar: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=150',
    role: 'Emergency Team',
    action: 'Dispatched response for Cardiac Arrest Alert',
    category: 'Emergency',
    date: '4 mins ago',
    status: 'active'
  },
  {
    id: 'act-3',
    user: 'Dr. Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
    role: 'General Physician',
    action: 'Prescribed Amoxicillin 500mg to Alice Smith',
    category: 'Prescription',
    date: '15 mins ago',
    status: 'completed'
  },
  {
    id: 'act-4',
    user: 'Lab Tech Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150',
    role: 'Lab Technician',
    action: 'Uploaded Complete Blood Count (CBC) report',
    category: 'Report',
    date: '1 hour ago',
    status: 'completed'
  },
  {
    id: 'act-5',
    user: 'Patient Robert Downey',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    role: 'Patient',
    action: 'Requested Video Consultation with Dr. Connor',
    category: 'Booking',
    date: '2 hours ago',
    status: 'pending'
  }
];

export const medicalRecords = [
  {
    id: 'rec-1',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Scan',
    title: 'Cardiac Ultrasound / Echocardiogram',
    date: '2026-06-15',
    shortDescription: 'Echocardiogram scan evaluating left ventricular function, valve movement, and overall cardiac efficiency.',
    doctorName: 'Dr. Sarah Connor',
    department: 'Cardiology',
    details: `
CLINICAL INDICATIONS: Atypical chest pain and history of mild hypertension.

FINDINGS:
1. Left Ventricle: Normal cavity dimensions. LVEDD 5.0 cm, LVESD 3.2 cm. Normal wall thickness. Global systolic function is preserved with an estimated ejection fraction (EF) of 62%. No regional wall motion abnormalities.
2. Right Ventricle: Normal cavity size and systolic function.
3. Left Atrium: Mildly dilated (volume index 36 ml/m²).
4. Valvular Structure:
   - Aortic Valve: Trileaflet, normal excursion, no stenosis or regurgitation.
   - Mitral Valve: Mild leaflet thickening, trace mitral regurgitation.
   - Tricuspid Valve: Normal structure, trace tricuspid regurgitation (PASP 22 mmHg).

IMPRESSION: 
1. Preserved left ventricular systolic function (EF 62%).
2. Mild left atrial enlargement.
3. Trace valvular regurgitation (physiologic).
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-2',
    patientName: 'Alice Smith',
    patientAge: 32,
    patientGender: 'Female',
    patientId: 'PT-4219',
    recordType: 'Prescription',
    title: 'Acute Bronchitis Treatment Regimen',
    date: '2026-06-14',
    shortDescription: 'Rx for respiratory treatment including broad-spectrum antibiotics, cough expectorants, and bronchodilator guidelines.',
    doctorName: 'Dr. Michael Chen',
    department: 'Pulmonology',
    details: `
DIAGNOSIS: Acute Bronchitis with secondary bacterial infection indicators.

PRESCRIPTION MEDICATION LIST:
1. Amoxicillin-Clavulanate (Augmentin) 875/125mg
   - Dosage: 1 tablet orally twice daily
   - Duration: 7 Days
   - Instructions: Take with food. Complete the entire course.
2. Benzonatate (Tessalon Perles) 100mg
   - Dosage: 1 capsule orally three times daily as needed for severe dry cough
   - Instructions: Do not chew or dissolve. Swallow whole with plenty of water.
3. Albuterol HFA Inhaler 90mcg
   - Dosage: 1-2 puffs every 4-6 hours as needed for wheezing or shortness of breath
   - Instructions: Rinse mouth with water after each use.

SUPPORTIVE CARE:
- Rest and consume at least 2-3 liters of fluids daily.
- Return to clinic if shortness of breath worsens or fever persists beyond 72 hours.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-3',
    patientName: 'Robert Downey',
    patientAge: 58,
    patientGender: 'Male',
    patientId: 'PT-1033',
    recordType: 'Lab Result',
    title: 'Comprehensive Metabolic & Lipid Panel',
    date: '2025-11-12',
    shortDescription: 'Fasting blood panel assessing blood glucose levels, liver and kidney metabolic indices, and lipid profile.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
TEST: Fasting Blood Panel (12-hour fast)

METABOLIC PROFILE:
- Glucose (Fasting): 98 mg/dL (Normal Range: 70 - 99 mg/dL)
- Blood Urea Nitrogen (BUN): 16 mg/dL (Normal Range: 7 - 20 mg/dL)
- Creatinine: 0.95 mg/dL (Normal Range: 0.60 - 1.30 mg/dL)
- eGFR: 84 mL/min/1.73m² (Normal: >60 mL/min/1.73m²)
- Sodium: 140 mEq/L (Normal Range: 135 - 145 mEq/L)
- Potassium: 4.2 mEq/L (Normal Range: 3.5 - 5.1 mEq/L)

LIPID PANEL:
- Total Cholesterol: 212 mg/dL [HIGH] (Optimal Range: <200 mg/dL)
- Triglycerides: 165 mg/dL [BORDERLINE] (Optimal Range: <150 mg/dL)
- HDL Cholesterol: 48 mg/dL (Optimal Range: >40 mg/dL)
- LDL Cholesterol: 131 mg/dL [HIGH] (Optimal Range: <100 mg/dL)

COMMENTS: 
Patient shows borderline high LDL and Total Cholesterol. Recommendation for diet modifications (low saturated fat, high fiber) and increased physical activity. Recheck lipid panel in 3 months.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-4',
    patientName: 'Emma Watson',
    patientAge: 29,
    patientGender: 'Female',
    patientId: 'PT-8831',
    recordType: 'Report',
    title: 'Orthopedic MRI Assessment',
    date: '2024-04-08',
    shortDescription: 'MRI Scan report for the right knee following a sports-related twisting injury, assessing ligament integrity.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
EXAMINATION: MRI of the Right Knee (Without Contrast)

CLINICAL HISTORY: Twisting injury during soccer, presenting with immediate swelling and joint instability.

FINDINGS:
1. Anterior Cruciate Ligament (ACL): There is a full-thickness tear of the mid-substance fibers of the ACL with associated mild bone bruising of the lateral femoral condyle.
2. Posterior Cruciate Ligament (PCL): Intact, normal thickness and signal.
3. Medial Collateral Ligament (MCL): Grade 1 sprain with mild surrounding edema. No fiber discontinuity.
4. Menisci: 
   - Medial Meniscus: Grade 2 signal change in the posterior horn, no distinct tear extending to the articular surface.
   - Lateral Meniscus: Intact.
5. Cartilage and Bone: Mild joint effusion. Normal articular cartilage thickness.

IMPRESSION:
1. Complete tear of the Anterior Cruciate Ligament (ACL).
2. Grade 1 MCL sprain.
3. Mild joint effusion.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-5',
    patientName: 'David Miller',
    patientAge: 61,
    patientGender: 'Male',
    patientId: 'PT-5573',
    recordType: 'Prescription',
    title: 'Type-2 Diabetes Maintenance Plan',
    date: '2023-08-05',
    shortDescription: 'Revised medication plan adjusting Metformin dose and introducing SGLT2 inhibitors for glucose management.',
    doctorName: 'Dr. Helen Vance',
    department: 'Endocrinology',
    details: `
DIAGNOSIS: Type-2 Diabetes Mellitus (HbA1c recently recorded at 7.6%).

PHARMACOTHERAPY ADJUSTMENTS:
1. Metformin HCl XR (Extended Release) 1000mg
   - Dose: 1 tablet orally once daily with dinner.
   - Note: Maintained dose, ensures insulin sensitivity.
2. Empagliflozin (Jardiance) 10mg
   - Dose: 1 tablet orally once daily in the morning, with or without food.
   - Note: [NEW MEDICATION] To assist with glycemic control and provide cardiovascular protection.

DIETARY GUIDELINES & SELF-MONITORING:
- Monitor Fasting Blood Glucose daily in the morning (Target: 80-130 mg/dL).
- Monitor post-prandial glucose 2 hours after meals (Target: <180 mg/dL).
- Strict carbohydrate counting and follow-up with Certified Diabetes Educator.
- Next HbA1c screening scheduled for September 2026.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-6',
    patientName: 'Sophia Loren',
    patientAge: 72,
    patientGender: 'Female',
    patientId: 'PT-3091',
    recordType: 'Lab Result',
    title: 'Thyroid Function Evaluation (TSH/T4)',
    date: '2022-09-28',
    shortDescription: 'Blood assay evaluating thyroid-stimulating hormone and free thyroxine to monitor hypothyroidism treatment.',
    doctorName: 'Dr. Helen Vance',
    department: 'Endocrinology',
    details: `
TEST: Thyroid Panel

RESULTS:
- Thyroid Stimulating Hormone (TSH): 2.45 uIU/mL (Reference Range: 0.45 - 4.50 uIU/mL)
- Free Thyroxine (Free T4): 1.18 ng/dL (Reference Range: 0.82 - 1.77 ng/dL)
- Free Triiodothyronine (Free T3): 2.9 pg/mL (Reference Range: 2.0 - 4.4 pg/mL)

IMPRESSION:
Thyroid hormone levels are within the normal reference ranges. The current dose of Levothyroxine (Synthroid) 75mcg daily is appropriate. 

PLAN:
- Continue Levothyroxine 75mcg daily, to be taken in the morning on an empty stomach at least 30-60 minutes before breakfast.
- Repeat TSH testing in 6 months or if symptoms of hypo/hyperthyroidism reappear.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-7',
    patientName: 'Bruce Wayne',
    patientAge: 38,
    patientGender: 'Male',
    patientId: 'PT-0007',
    recordType: 'Scan',
    title: 'Cervical Spine X-Ray and CT',
    date: '2021-03-24',
    shortDescription: 'Radiology study evaluating persistent cervical neck pain and checking for vertebral fractures or disk degeneration.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
EXAMINATION: CT and X-Ray of the Cervical Spine

CLINICAL HISTORY: Chronic neck stiffness, acute exacerbation after high-impact physical activity.

FINDINGS:
1. Alignment: Normal cervical lordosis is preserved. No subluxation or translation.
2. Vertebral Bodies: Intact heights. No fracture lines or destructive bony lesions.
3. Intervertebral Disks: Minimal disk space narrowing at C5-C6. Other disks are normal height.
4. Joints: Mild hypertrophic changes at the facet joints of C4-C5 and C5-C6.
5. Soft Tissues: Prevertebral soft tissues are unremarkable. No pathological calcification.

IMPRESSION:
1. No acute cervical fracture or dislocation.
2. Mild degenerative disk disease and facet arthropathy at C5-C6.
3. No spinal canal stenosis.

RECOMMENDATIONS:
- Physical therapy focusing on cervical stabilization.
- NSAIDs as needed for symptomatic pain relief.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-8',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Report',
    title: 'Annual Health Physical Assessment',
    date: '2020-07-18',
    shortDescription: 'Comprehensive annual checkup details including vitals, head-to-toe physical exams, and prevention recommendations.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
EXAMINATION: Annual Preventative Health Physical

VITALS:
- BP: 128/82 mmHg (Prehypertensive)
- HR: 72 bpm, regular
- Temp: 98.4 F (Oral)
- BMI: 24.8 kg/m² (Normal Weight)

PHYSICAL EXAMINATION:
- HEENT: Normocephalic, pupils equal, reactive to light. Extraocular movements intact.
- Respiratory: Lungs clear to auscultation bilaterally. No wheezes, rales, or rhonchi.
- Cardiovascular: Normal S1, S2. Regular rhythm. No murmurs or gallops.
- Abdomen: Soft, non-distended, non-tender. Bowel sounds active. No organomegaly.
- Extremities: No edema. Pulses intact and symmetric.
- Neurologic: Cranial nerves II-XII intact. Reflexes 2+ symmetric. Sensory and motor systems intact.

COUNSELING:
- Discussed cardiovascular health, diet, and stress management.
- Encouraged a target of 150 minutes of moderate-intensity exercise weekly.
- Scheduled routine screening labs (lipid panel, fasting blood glucose).
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-9',
    patientName: 'Peter Parker',
    patientAge: 21,
    patientGender: 'Male',
    patientId: 'PT-2099',
    recordType: 'Scan',
    title: 'Brain MRI Scan & Occipital Cortex Mapping',
    date: '2019-12-15',
    shortDescription: 'High-resolution MRI mapping neuro-synaptic transmission paths and occipital lobe sensory processing cortex efficiency.',
    doctorName: 'Dr. Charles Xavier',
    department: 'Neurology',
    details: `
EXAMINATION: Brain MRI (Magnetic Resonance Imaging) and Functional Tractography

FINDINGS:
1. Cerebrum: Normal gray-white matter distribution. Mildly accelerated synaptic transmission velocities noted in the parietal and occipital lobes (+35% above baseline).
2. Occipital Lobe: Functional mapping reveals hyper-responsive neural clusters in the visual cortex corresponding to enhanced sensory-visual stimulus integration.
3. Ventricles and Sulci: Normal size, symmetric, no indicators of hydrocephalus or intracranial mass effect.
4. Cranial Nerves: Intact. No structural lesions or compressions detected.

IMPRESSION:
1. Structurally normal brain MRI.
2. Physiological hyper-transmission and sensory-processing maps in parietal/occipital regions. No clinical intervention indicated.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-10',
    patientName: 'Diana Prince',
    patientAge: 30,
    patientGender: 'Female',
    patientId: 'PT-1941',
    recordType: 'Lab Result',
    title: 'Genetic Sequencing & Serum Biomarker Panel',
    date: '2018-05-10',
    shortDescription: 'Full chromosomal karyotype analysis mapping cellular regeneration markers, longevity indices, and heavy-metal immunity.',
    doctorName: 'Dr. Bruce Banner',
    department: 'Genetics',
    details: `
TEST: Whole-Genome Sequencing & Longevity Biomarker Scan

GENETIC MARKERS:
- Telomere Length: >95th percentile, indicating exceptional cellular replication capacity.
- DNA Repair Efficiency: Elevated expression of DNA mismatch repair enzymes (MSH2/MSH6).
- Mitochondrial Output: Enhanced ATP synthase velocity under high aerobic stress.

SERUM BIOMARKERS:
- C-Reactive Protein (CRP): 0.12 mg/L (Optimal: <1.0 mg/L - No systemic inflammation)
- Glutathione Peroxidase: 42.8 U/g Hb (Excellent antioxidant status)
- Toxic Heavy Metal Screening: Undetectable levels (complete natural excretion).

COMMENTS:
The patient displays a highly robust immune response and genomic resilience profile. Recommending standard annual wellness checkups. No genetic modifications required.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-11',
    patientName: 'Clark Kent',
    patientAge: 35,
    patientGender: 'Male',
    patientId: 'PT-1938',
    recordType: 'Prescription',
    title: 'Mineral Absorption & Lead Detoxification Plan',
    date: '2017-02-02',
    shortDescription: 'Chelation prescription and high-absorption mineral supplements targeted at toxic heavy-metal blood filtration.',
    doctorName: 'Dr. Emil Hamilton',
    department: 'Toxicology',
    details: `
DIAGNOSIS: Accidental exposure to radioactive/lead-heavy isotopes.

PRESCRIPTION MEDICATION LIST:
1. Calcium Disodium EDTA 500mg
   - Dosage: 1 tablet orally twice daily with meals.
   - Duration: 10 Days
   - Instructions: Ensure high fluid intake (at least 3 liters daily) to assist renal excretion.
2. Active Calcium & Zinc Carbonate Complex
   - Dosage: 1 capsule orally once daily in the morning.
   - Note: Assists in bone mineral density replacement.
3. Glutathione Co-Factor Booster
   - Dosage: 2 capsules orally once daily with dinner.

SUPPORTIVE ADVISORY:
Avoid high-radiation areas and isolate from isotopic emitters during the chelation cycle. Recheck cellular blood panel in 2 weeks.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-12',
    patientName: 'Tony Stark',
    patientAge: 48,
    patientGender: 'Male',
    patientId: 'PT-3000',
    recordType: 'Report',
    title: 'Cardiovascular Mechanical Valve Calibration',
    date: '2026-01-28',
    shortDescription: 'Post-operative performance tracking checking biomechanical heart valve flow velocity and electrical pacing feedback.',
    doctorName: 'Dr. Stephen Strange',
    department: 'Cardiothoracic Surgery',
    details: `
EXAMINATION: Biomechanical Heart Valve Flow Calibration and ECG Pacing Verification

VITALS:
- Paced Heart Rate: 70 bpm, stable.
- Valve Pressure Gradient: 12 mmHg (Normal limits for prosthetic mechanical valves).

FINDINGS:
1. Valve Mobility: Prosthetic aortic valve leaflets demonstrate unrestricted excursion. Excellent coaptation with trace physiological backflow.
2. Electrical Interface: Heart rhythm is synchronized with the integrated chest pacing device. No ectopic beats or conduction delays noted.
3. Myocardial Performance: Left ventricular ejection fraction is stabilized at 58%.

PLAN:
- Monthly telemetry scan of prosthetic heart interface.
- Maintain daily low-dose Aspirin 81mg as anti-platelet therapy.
- Schedule bi-annual thoracic CT mapping in October 2026.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-13',
    patientName: 'Natasha Romanoff',
    patientAge: 34,
    patientGender: 'Female',
    patientId: 'PT-1984',
    recordType: 'Report',
    title: 'Immunological Serum Antibody Assay',
    date: '2025-11-15',
    shortDescription: 'Assay measuring viral immunity indices, cellular resistance markers, and neuro-system stability under physiological stressors.',
    doctorName: 'Dr. Bruce Banner',
    department: 'Immunology',
    details: `
TEST: Immunological Profiling & Viral Antibody Scan

FINDINGS:
1. Antibody Titers: High concentration of IgG antibodies against standard viral pathogens. Excellent memory B-cell recall response.
2. Lymphocyte Count: Normal range, with highly efficient T-cell activation markers.
3. Neuro-Immune Interface: Stable neuro-transmitter levels. No signs of autoimmune visual or motor deterioration.
4. Inflammation Markers: CRP is 0.05 mg/L, indicating exceptional tissue recovery rates.

IMPRESSION:
Patient exhibits an elite immunological profile with rapid cellular defense mobilization and complete pathogen neutralizing capacity. No follow-up indicated.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-14',
    patientName: 'Steve Rogers',
    patientAge: 98,
    patientGender: 'Male',
    patientId: 'PT-1918',
    recordType: 'Prescription',
    title: 'Metabolic Pacing & Cellular Regeneration Plan',
    date: '2021-06-20',
    shortDescription: 'Revised endocrinology treatment regulating metabolic pacing, cellular replenishment, and bone mineral density support.',
    doctorName: 'Dr. Abraham Erskine',
    department: 'Endocrinology',
    details: `
DIAGNOSIS: Age-related metabolic stabilization and cellular pacing.

PRESCRIPTION:
1. High-Density Mineral Complex (Regenex-5)
   - Dosage: 1 tablet orally once daily with breakfast.
   - Purpose: Maintained bone density and cellular restoration cofactors.
2. CoQ10 Ubiquinol 200mg
   - Dosage: 1 softgel daily with lunch to sustain cardiovascular ATP efficiency.
3. Essential Amino Acid Synthesis Capsule
   - Dosage: 2 capsules daily after physical exercise.

DIETARY PROTOCOL:
Maintain high-protein, calorie-matched diet. Recheck physical performance indices and lipid panels in 6 months.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-15',
    patientName: 'Thor Odinson',
    patientAge: 42,
    patientGender: 'Male',
    patientId: 'PT-0965',
    recordType: 'Scan',
    title: 'Thoracic CT Angiogram & Electromotive Scan',
    date: '2018-10-05',
    shortDescription: 'CT Angiography mapping electrical chest conductivity, visual vascular structures, and high bio-voltage cardiac thresholds.',
    doctorName: 'Dr. Jane Foster',
    department: 'Radiology',
    details: `
EXAMINATION: Thoracic Computed Tomography Angiography (CTA) with ECG Gating

CLINICAL INDICATIONS: Assessment of thoracic vascular alignment under high electrical/bio-electric stress.

FINDINGS:
1. Coronary Arteries: Normal origins. Exceptional lumen diameter, zero calcification (Calcium Score: 0).
2. Great Vessels: Ascending thoracic aorta is normal in caliber. No dissection or aneurysm.
3. Bio-electric Conduction: Cardiographic mapping indicates hypertrophied sinus node capable of conducting high electrical potentials without arrythmia.
4. Pulmonary Vasculature: Intact, normal pressure gradients.

IMPRESSION:
1. Normal CT Thoracic Angiogram.
2. Exceptional cardiac conduction capacity, withstanding high bio-voltage discharges. No cardiac patholgies noted.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-16',
    patientName: 'David Miller',
    patientAge: 61,
    patientGender: 'Male',
    patientId: 'PT-5573',
    recordType: 'Scan',
    title: 'Abdominal Ultrasound & Liver Scan',
    date: '2020-05-12',
    shortDescription: 'Ultrasound study assessing liver dimensions, gallbladder wall thickness, and common bile duct clearance.',
    doctorName: 'Dr. Robert Carter',
    department: 'Gastroenterology',
    details: `
EXAMINATION: Abdominal Ultrasound (RUQ Focus)

FINDINGS:
1. Liver: Normal size (14.2 cm). Smooth margins. Mild, diffuse increase in echogenicity, consistent with mild hepatic steatosis (fatty liver). No focal masses or cysts.
2. Gallbladder: Normal wall thickness (2.2 mm). No gallstones or sludge detected. Negative sonographic Murphy's sign.
3. Biliary Tree: Common bile duct is normal in caliber (4.1 mm). No intra- or extra-hepatic ductal dilatation.
4. Portal Vein: Patent with normal hepatopetal flow.

IMPRESSION:
1. Mild fatty infiltration of the liver (hepatic steatosis).
2. Normal gallbladder and biliary system.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-17',
    patientName: 'David Miller',
    patientAge: 61,
    patientGender: 'Male',
    patientId: 'PT-5573',
    recordType: 'Lab Result',
    title: 'Hemoglobin A1c & Lipid Panel',
    date: '2019-03-24',
    shortDescription: 'HbA1c test and lipid fraction check monitoring diabetes progression, glucose status, and triglyceride counts.',
    doctorName: 'Dr. Helen Vance',
    department: 'Endocrinology',
    details: `
TEST: Glycemic & Lipid Evaluation

GLYCEMIC CONTROL:
- Hemoglobin A1c (HbA1c): 6.8% [HIGH] (Target for diabetic control: <7.0%)
- Estimated Average Glucose (eAG): 148 mg/dL

LIPID FRACTIONS:
- Total Cholesterol: 195 mg/dL (Desirable: <200 mg/dL)
- Triglycerides: 184 mg/dL [HIGH] (Normal: <150 mg/dL)
- HDL Cholesterol: 42 mg/dL (Normal: >40 mg/dL)
- LDL Cholesterol: 116 mg/dL [BORDERLINE] (Optimal: <100 mg/dL)

COMMENTS:
HbA1c is stable at 6.8%, representing acceptable glycemic management. Triglycerides remain elevated. Recommending continued Metformin XR dosage and addition of omega-3 dietary supplements.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-18',
    patientName: 'Alice Smith',
    patientAge: 32,
    patientGender: 'Female',
    patientId: 'PT-4219',
    recordType: 'Scan',
    title: 'Chest X-Ray / Pulmonary Mapping',
    date: '2022-05-04',
    shortDescription: 'High-resolution thoracic X-ray evaluating bronchial wall thickening and checking lung lobe clearance.',
    doctorName: 'Dr. Michael Chen',
    department: 'Pulmonology',
    details: `
EXAMINATION: Chest Radiograph (PA & Lateral views)

CLINICAL HISTORY: Persistent cough and history of recent acute bronchitis.

FINDINGS:
1. Lungs: Lungs are hyperinflated but clear of focal consolidation, effusion, or pneumothorax.
2. Airways: Mild peribronchial cuffing/wall thickening is visible in the bilateral lower lobes, consistent with resolving bronchitis.
3. Heart & Mediastinum: Cardiomediastinal contour is normal in size and configuration.
4. Bones & Pleura: Rib cages and pleural recesses are clear.

IMPRESSION:
No acute cardiopulmonary disease. Mild peribronchial thickening, consistent with resolving bronchial irritation.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-19',
    patientName: 'Alice Smith',
    patientAge: 32,
    patientGender: 'Female',
    patientId: 'PT-4219',
    recordType: 'Report',
    title: 'Pulmonary Function Test (PFT)',
    date: '2023-04-12',
    shortDescription: 'Spirometry evaluation assessing forced expiratory volume (FEV1) and vital capacity limits to check airway resistance.',
    doctorName: 'Dr. Michael Chen',
    department: 'Pulmonology',
    details: `
TEST: Spirometry & Bronchodilator Reversibility Study

SPIROMETRY RESULTS:
- FVC (Forced Vital Capacity): 3.82 L (94% of predicted)
- FEV1 (Forced Expiratory Volume in 1s): 3.12 L (91% of predicted)
- FEV1/FVC Ratio: 81.6% (Normal range: >75%)
- FEF 25-75% (Mid-expiratory flow): 2.95 L/s (84% of predicted)

POST-BRONCHODILATOR EFFECT:
No significant change in FEV1 or FVC after administration of Albuterol (less than 4% increase).

IMPRESSION:
Normal lung volumes and expiratory flow rates. No spirometric evidence of obstructive or restrictive ventilatory defects.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-20',
    patientName: 'Robert Downey',
    patientAge: 58,
    patientGender: 'Male',
    patientId: 'PT-1033',
    recordType: 'Prescription',
    title: 'Antihypertensive Adjustment Plan',
    date: '2017-05-30',
    shortDescription: 'Rx adjusting Lisinopril dose and setting daily blood pressure recording guidelines to manage prehypertension.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
DIAGNOSIS: Stage 1 Essential Hypertension.

MEDICATION MODIFICATION:
1. Lisinopril 20mg (Increased from 10mg)
   - Dosage: 1 tablet orally once daily in the morning.
   - Instructions: Take consistently at the same time. Monitor for dry cough or dizziness.
2. Hydrochlorothiazide (HCTZ) 12.5mg
   - Dosage: 1 tablet orally once daily in the morning.
   - Instructions: Ensure stable potassium intake.

MONITORING PROTOCOL:
- Record blood pressure twice daily (morning and evening).
- Target BP threshold: <130/80 mmHg.
- Return for renal panel check (electrolytes/creatinine) in 4 weeks.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-21',
    patientName: 'Robert Downey',
    patientAge: 58,
    patientGender: 'Male',
    patientId: 'PT-1033',
    recordType: 'Scan',
    title: 'Carotid Doppler Ultrasound',
    date: '2020-10-18',
    shortDescription: 'Doppler vascular imaging checking blood flow velocities and carotid artery wall thickness to rule out stenosis.',
    doctorName: 'Dr. Sarah Connor',
    department: 'Cardiology',
    details: `
EXAMINATION: Duplex Ultrasound of Carotid Arteries

FINDINGS:
1. Left Carotid System:
   - Common Carotid Artery (CCA): Peak systolic velocity (PSV) is 78 cm/s. Mild intimal thickening (IMT 0.78 mm).
   - Internal Carotid Artery (ICA): PSV is 84 cm/s. No hemodynamically significant stenosis (less than 20% diameter reduction).
2. Right Carotid System:
   - Common Carotid Artery (CCA): PSV is 82 cm/s. IMT is 0.74 mm.
   - Internal Carotid Artery (ICA): PSV is 90 cm/s. No significant stenosis.
3. Vertebral Arteries: Patent with normal antegrade flow bilaterally.

IMPRESSION:
No hemodynamically significant stenosis in either internal or external carotid artery systems. Mild bilateral carotid intimal thickening.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-22',
    patientName: 'Emma Watson',
    patientAge: 29,
    patientGender: 'Female',
    patientId: 'PT-8831',
    recordType: 'Lab Result',
    title: 'Serum Vitamin D & Calcium Assay',
    date: '2021-05-14',
    shortDescription: 'Assay evaluating systemic serum Vitamin D3 and calcium levels for bone density health and injury recovery.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
TEST: Bone Health Panel

RESULTS:
- 25-Hydroxy Vitamin D: 22.4 ng/mL [LOW] (Deficient: <20 ng/mL, Insufficient: 20-30 ng/mL, Sufficient: >30 ng/mL)
- Calcium (Serum): 9.4 mg/dL (Normal Range: 8.6 - 10.2 mg/dL)
- Phosphorus (Serum): 3.6 mg/dL (Normal Range: 2.5 - 4.5 mg/dL)
- Alkaline Phosphatase (ALP): 78 U/L (Normal Range: 30 - 120 U/L)

PLAN:
1. Supplement with Ergocalciferol (Vitamin D2) 50,000 IU capsule orally once weekly for 8 weeks.
2. Daily Maintenance: Transition to Cholecalciferol (D3) 2,000 IU daily thereafter.
3. Recheck 25-Hydroxy Vitamin D in 3 months.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-23',
    patientName: 'Emma Watson',
    patientAge: 29,
    patientGender: 'Female',
    patientId: 'PT-8831',
    recordType: 'Prescription',
    title: 'Post-Injury Pain Management Plan',
    date: '2024-06-09',
    shortDescription: 'Rx for anti-inflammatory agents and gastro-protective guidelines following joint injury and ACL tear.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
DIAGNOSIS: Status post ACL tear (right knee), severe acute inflammation.

PRESCRIPTION:
1. Celecoxib (Celebrex) 200mg
   - Dosage: 1 capsule orally once daily as needed for severe joint pain and swelling.
   - Duration: 14 Days
   - Instructions: Take with food. Do not take with other NSAIDs.
2. Famotidine (Pepcid) 20mg
   - Dosage: 1 tablet orally twice daily.
   - Purpose: Gastro-protection during Celecoxib regimen.
3. Acetaminophen (Tylenol) 325mg
   - Dosage: 1-2 tablets orally every 6 hours as needed for mild breakthrough pain (Max 3,000mg/day).

SUPPORTIVE PROTOCOL:
- Apply ice pack for 20 minutes 4 times daily.
- Wear knee immobilizer when ambulatory.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-24',
    patientName: 'Bruce Wayne',
    patientAge: 38,
    patientGender: 'Male',
    patientId: 'PT-0007',
    recordType: 'Prescription',
    title: 'Skeletal Muscle Relaxant Protocol',
    date: '2019-05-25',
    shortDescription: 'Rx prescribing muscle relaxants and physical rehabilitation schedules for spinal strain recovery.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
DIAGNOSIS: Acute Cervicothoracic Muscle Spasm and Facet Joint Strain.

PRESCRIPTION:
1. Cyclobenzaprine (Flexeril) 10mg
   - Dosage: 1 tablet orally at bedtime as needed for severe neck spasms.
   - Note: May cause drowsiness. Avoid driving or operating machinery.
   - Duration: 7 Days.
2. Naproxen (Aleve) 500mg
   - Dosage: 1 tablet orally twice daily with meals.
   - Duration: 10 Days.

REHABILITATION PLAN:
- Initiate passive cervical stretching with physical therapist twice weekly.
- Avoid heavy lumbar or cervical loading for 2 weeks.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-25',
    patientName: 'Bruce Wayne',
    patientAge: 38,
    patientGender: 'Male',
    patientId: 'PT-0007',
    recordType: 'Lab Result',
    title: 'Serum Creatine Kinase (CK) Test',
    date: '2018-12-04',
    shortDescription: 'Lab report checking muscle enzyme leakage and overall muscle damage markers after high-impact training.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
TEST: Creatine Kinase (CK) Total Assay

RESULTS:
- Creatine Kinase (CK) Total: 420 U/L [HIGH] (Reference Range for Males: 39 - 308 U/L)
- Myoglobin (Serum): 82 mcg/L [HIGH] (Reference Range: <72 mcg/L)
- Serum Creatinine: 1.05 mg/dL (Normal: 0.60 - 1.30 mg/dL)

COMMENTS:
CK is elevated at 420 U/L, indicative of acute skeletal muscle exertion or mild rhabdomyolysis post intense athletic strain. Renal function is preserved (Creatinine 1.05).
Recommendation: Immediate cessation of high-impact loading, double fluid intake to flush kidneys. Recheck renal panel and CK in 72 hours.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-26',
    patientName: 'Tony Stark',
    patientAge: 48,
    patientGender: 'Male',
    patientId: 'PT-3000',
    recordType: 'Prescription',
    title: 'Cardiovascular Anticoagulant Protocol',
    date: '2020-04-30',
    shortDescription: 'Rx adjusting Warfarin dosages and regulating daily prothrombin time tracking for prosthetic mechanical valve.',
    doctorName: 'Dr. Stephen Strange',
    department: 'Cardiothoracic Surgery',
    details: `
DIAGNOSIS: Status post mechanical aortic valve replacement. Maintenance anticoagulation.

PRESCRIPTION:
1. Warfarin Sodium (Coumadin) 5mg
   - Dosage: 1 tablet orally daily at 6:00 PM.
   - Instructions: Maintain consistent dietary intake of Vitamin K. Check INR weekly.
   - Target INR Range: 2.0 - 3.0

INR TRACKING PARAMETERS:
- Last recorded INR (2026-04-29): 2.45 (Therapeutic range).
- Next blood test (Prothrombin Time / INR) scheduled for May 7, 2026.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-27',
    patientName: 'Tony Stark',
    patientAge: 48,
    patientGender: 'Male',
    patientId: 'PT-3000',
    recordType: 'Scan',
    title: 'CT Chest & Mediastinum Scan',
    date: '2021-08-14',
    shortDescription: 'Chest CT tracking biomechanical thoracic pacing structural integration and electrode placement.',
    doctorName: 'Dr. Stephen Strange',
    department: 'Cardiothoracic Surgery',
    details: `
EXAMINATION: Computed Tomography (CT) of the Chest (With and Without Contrast)

FINDINGS:
1. Prosthetic Valve: Mechanical aortic valve is in excellent anatomical position. No perivalvular leakage or thrombus visualized.
2. Pacing Leads: Pacemaker electrodes are securely anchored within the right atrium and right ventricle, intact with no evidence of displacement or lead fracture.
3. Mediastinum: No mediastinal adenopathy. Thymic remnant is normal.
4. Lungs: No pleural effusions, pneumothorax, or active infiltrates.

IMPRESSION:
1. Biomechanically stable prosthetic heart valve and pacing leads.
2. Unremarkable CT scan of the chest.
    `,
    fileUrl: '#'
  },
  {
    id: 'rec-28',
    patientName: 'Peter Parker',
    patientAge: 21,
    patientGender: 'Male',
    patientId: 'PT-2099',
    recordType: 'Lab Result',
    title: 'Comprehensive Serum Chemistry Scan',
    date: '2019-05-16',
    shortDescription: 'Fasting blood panel verifying high metabolic activity markers and baseline chemistry limits.',
    doctorName: 'Dr. Charles Xavier',
    department: 'Neurology',
    details: `
TEST: Fasting Biochemical Serum Screening

RESULTS:
- Total Serum Protein: 8.8 g/dL [HIGH] (Normal: 6.0 - 8.3 g/dL)
- Albumin: 5.1 g/dL [HIGH] (Normal: 3.5 - 5.0 g/dL)
- Blood Glucose (Fasting): 74 mg/dL (Normal: 70 - 99 mg/dL)
- BUN: 12 mg/dL (Normal: 7 - 20 mg/dL)
- Lactic Acid (Resting): 0.4 mmol/L [LOW] (Normal: 0.5 - 2.2 mmol/L - extremely efficient clearance)

COMMENTS:
The patient's blood chemistry displays highly efficient glucose metabolism and low lactic acid buildup, verifying rapid lactate clearance. Total protein is slightly elevated. Recommendation: Increase daily hydration.
    `
  },
  {
    id: 'rec-29',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Report',
    title: 'Post-Trauma Neurological Recovery Review',
    date: '2026-06-18',
    shortDescription: 'Clinical review tracking cognitive recovery, vestibular alignment, and synaptic reflexes following mild concussion.',
    doctorName: 'Dr. Charles Xavier',
    department: 'Neurology',
    details: `
CLINICAL DIAGNOSIS: Mild Concussion with transient post-concussive headache indicators.

EXAMINATION FINDINGS:
1. Cognitive Processing: Excellent recall accuracy. No lapses in memory.
2. Motor Reflexes: Patellar and Achilles reflexes are 2+ symmetric. Pupils equal and reactive (PERRLA).
3. Vestibular Balance: Rhomberg test is negative. Normal tandem gait.
4. Patient Symptoms: Occasional mild photophobia resolving within 48 hours.

IMPRESSION & PLAN:
1. Normal neurological progression. Post-concussive syndrome resolved.
2. Patient cleared for normal exercise routines. Limit screen exposure to 6 hours daily.
    `
  },
  {
    id: 'rec-30',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Prescription',
    title: 'Chronic Migraine & Nerve Management',
    date: '2026-06-17',
    shortDescription: 'Rx for prophylactic migraine therapy and symptomatic relief rules to regulate neuro-inflammatory feedback.',
    doctorName: 'Dr. Charles Xavier',
    department: 'Neurology',
    details: `
DIAGNOSIS: Prophylaxis for recurrent tension-type migraines.

PRESCRIPTIONS:
1. Topiramate (Topamax) 50mg
   - Dose: 1 tablet orally daily at bedtime.
   - Note: Increase to twice daily if headaches occur >3 times per week.
2. Sumatriptan (Imitrex) 50mg
   - Dose: 1 tablet orally at onset of acute migraine pain.
   - Limit: Maximum 2 tablets in 24 hours.
3. Magnesium Oxide 400mg
   - Dose: 1 tablet orally daily with dinner.

ADVISORY:
Avoid aged cheeses, red wines, and erratic sleep cycles. Maintain hydration log.
    `
  },
  {
    id: 'rec-31',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Lab Result',
    title: 'Metabolic & Complete Blood Count (CBC)',
    date: '2025-06-10',
    shortDescription: 'Blood count mapping electrolyte levels, white blood cell counts, and baseline renal indices.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
TEST: Complete Blood Count & Renal Filtration Check

HEPATIC & RENAL:
- White Blood Cells (WBC): 6.4 x10^3/uL (Normal: 4.0 - 11.0)
- Red Blood Cells (RBC): 4.85 x10^6/uL (Normal: 4.30 - 5.90)
- Hemoglobin: 15.2 g/dL (Normal: 13.5 - 17.5)
- Hematocrit: 44.8% (Normal: 41.0 - 50.0)
- Platelets: 220 x10^3/uL (Normal: 150 - 450)
- Serum Creatinine: 0.98 mg/dL (Normal: 0.60 - 1.30)
- BUN: 14 mg/dL (Normal: 7 - 20)

COMMENTS:
All hematological values are within optimal physiological limits. Stable kidney function.
    `
  },
  {
    id: 'rec-32',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Scan',
    title: 'Brain MRI & Synaptic Tractography',
    date: '2023-06-01',
    shortDescription: 'High-resolution neuro-imaging scan evaluating cerebral white matter and mapping cortical vascular flows.',
    doctorName: 'Dr. Charles Xavier',
    department: 'Neurology',
    details: `
EXAMINATION: Brain MRI (Without Contrast)

FINDINGS:
1. Ventricles & Sulci: Normal size and configuration. No mass effect, midline shift, or herniation.
2. Brain Parenchyma: No acute infarcts, hemorrhage, or demyelinating lesions.
3. Vessels: Normal flow voids in major intracranial arteries.
4. Cranial Nerves: Symmetric, normal course.

IMPRESSION:
Unremarkable MRI scan of the brain. No structural correlates for clinical complaints.
    `
  },
  {
    id: 'rec-33',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Prescription',
    title: 'Allergy and Immunology Maintenance',
    date: '2022-05-12',
    shortDescription: 'Rx for seasonal allergic rhinitis prophylaxis and histamine block guidelines.',
    doctorName: 'Dr. Bruce Banner',
    department: 'Immunology',
    details: `
DIAGNOSIS: Moderate seasonal allergic rhinitis.

PRESCRIPTION:
1. Fluticasone Propionate (Flonase) Nasal Spray
   - Dose: 2 sprays in each nostril once daily.
   - Instructions: Shake well. Clean nozzle after use.
2. Montelukast (Singulair) 10mg
   - Dose: 1 tablet orally once daily in the evening.
3. Loratadine (Claritin) 10mg
   - Dose: 1 tablet orally once daily in the morning as needed for itching.

SUPPORTIVE ADVISORY:
Keep windows closed during high-pollen hours. Wash bedding weekly in hot water.
    `
  },
  {
    id: 'rec-34',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Lab Result',
    title: 'Allergen Specific IgE Blood Test',
    date: '2021-05-01',
    shortDescription: 'Blood serum assay measuring allergen sensitivity profiles and immune antibody counts.',
    doctorName: 'Dr. Bruce Banner',
    department: 'Immunology',
    details: `
TEST: Allergen-Specific IgE Blood Test

RESULTS:
- Total IgE: 142 kU/L [HIGH] (Reference: <100 kU/L)
- Tree Pollen mix: 3.45 kU/L [Class 2 - Moderate]
- Grass Pollen mix: 4.80 kU/L [Class 3 - High]
- House Dust Mites: 1.25 kU/L [Class 1 - Low]
- Animal Dander (Cat): 0.12 kU/L [Class 0 - Negative]

IMPRESSION:
Systemic atopy confirmed. High Grass/Tree pollen reactivity. Initiate antihistamine therapy.
    `
  },
  {
    id: 'rec-35',
    patientName: 'Alice Smith',
    patientAge: 32,
    patientGender: 'Female',
    patientId: 'PT-4219',
    recordType: 'Report',
    title: 'Post-Bronchitis Pulmonary Assessment',
    date: '2024-06-16',
    shortDescription: 'Clinical report validating complete resolution of bronchial congestion and airway recovery.',
    doctorName: 'Dr. Michael Chen',
    department: 'Pulmonology',
    details: `
CLINICAL REVIEW: Follow-up for severe acute bronchitis.

FINDINGS:
1. Auscultation: Lungs clear to percussion. Good vesicular air entry bilaterally. No adventitious sounds.
2. Vital Signs: SpO2 99% on room air. Respiratory rate 14 breaths/min.
3. Symptoms: Resolving productive cough, zero dyspnea on exertion.

IMPRESSION:
Complete clinical recovery from acute bronchitis. Clear lungs. No active restrictions.
    `
  },
  {
    id: 'rec-36',
    patientName: 'Alice Smith',
    patientAge: 32,
    patientGender: 'Female',
    patientId: 'PT-4219',
    recordType: 'Prescription',
    title: 'Asthma Preventative Inhaler Therapy',
    date: '2018-05-20',
    shortDescription: 'Rx for long-acting bronchial anti-inflammatory controllers and emergency relief protocols.',
    doctorName: 'Dr. Michael Chen',
    department: 'Pulmonology',
    details: `
DIAGNOSIS: Mild persistent asthma, exacerbated by seasonal bronchitis.

PRESCRIPTION:
1. Budesonide-Formoterol (Symbicort) 160/4.5mcg
   - Dose: 2 inhalations twice daily.
   - Note: Controller therapy. Rinse mouth after each use.
2. Levalbuterol (Xopenex) HFA Inhaler
   - Dose: 1-2 puffs every 4 hours as needed for sudden wheezing or asthma attacks.

PLAN:
Follow asthma action plan. Re-evaluate spirometry metrics in 8 weeks.
    `
  },
  {
    id: 'rec-37',
    patientName: 'Robert Downey',
    patientAge: 58,
    patientGender: 'Male',
    patientId: 'PT-1033',
    recordType: 'Report',
    title: 'Cardiovascular Hypertension Review',
    date: '2017-06-14',
    shortDescription: 'Physician log outlining blood pressure stabilization and therapeutic compliance audits.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
CLINICAL REVIEW: Essential Hypertension Follow-up.

VITALS:
- Avg Blood Pressure (Home Log): 124/76 mmHg.
- Clinic Blood Pressure: 126/78 mmHg.
- Heart Rate: 68 bpm.

IMPRESSION:
Lisinopril 20mg daily has effectively stabilized blood pressure into the prehypertensive/normal range. Compliance is excellent.

PLAN:
Continue current Lisinopril regimen. Re-evaluate renal panel and lipid levels in 6 months.
    `
  },
  {
    id: 'rec-38',
    patientName: 'Emma Watson',
    patientAge: 29,
    patientGender: 'Female',
    patientId: 'PT-8831',
    recordType: 'Scan',
    title: 'Right Knee Post-Op X-Ray',
    date: '2020-06-15',
    shortDescription: 'Orthopedic radiograph evaluating anatomical ligament alignment and joint alignment post ACL repair.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
EXAMINATION: X-Ray of the Right Knee (Post-Operative Baseline)

FINDINGS:
1. Alignment: Femoral and tibial tunnels are in optimal anatomic position.
2. Hardware: Interference screws are intact and securely positioned in the distal femur and proximal tibia.
3. Joint: Normal joint space width. No subluxation or fracture. No significant soft tissue swelling.

IMPRESSION:
Normal post-operative appearance of right knee reconstruction. Normal hardware position.
    `
  },
  {
    id: 'rec-39',
    patientName: 'Emma Watson',
    patientAge: 29,
    patientGender: 'Female',
    patientId: 'PT-8831',
    recordType: 'Report',
    title: 'Physical Rehabilitation Assessment',
    date: '2021-06-02',
    shortDescription: 'Clinical milestones log recording range of motion, extension, and flexion parameters post-injury.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
CLINICAL REVIEW: Post-op Week 4 Rehabilitation Progress.

FINDINGS:
1. Range of Motion: Passive extension is 0 degrees. Flexion is stabilized at 110 degrees.
2. Muscle Strength: Quadriceps activation is intact with minimal atrophy.
3. Edema: Trace joint effusion noted.
4. Pain: Controlled with Celecoxib and icing.

PLAN:
Progress physical therapy to weight-bearing exercises as tolerated. Maintain brace lock.
    `
  },
  {
    id: 'rec-40',
    patientName: 'David Miller',
    patientAge: 61,
    patientGender: 'Male',
    patientId: 'PT-5573',
    recordType: 'Report',
    title: 'Diabetic Nephropathy Screening',
    date: '2018-06-11',
    shortDescription: 'Renal panel report validating absence of microalbuminuria or diabetic kidney changes.',
    doctorName: 'Dr. Helen Vance',
    department: 'Endocrinology',
    details: `
SCREENING: Microalbuminuria & Nephropathy Assessment.

TEST RESULTS:
- Urine Albumin-to-Creatinine Ratio (ACR): 14.2 mg/g (Normal: <30 mg/g)
- Serum Creatinine: 1.02 mg/dL
- eGFR: 82 mL/min/1.73m²

IMPRESSION:
No microalbuminuria detected. Renal function is stable and well-preserved. Metformin/Jardiance therapies show no adverse kidney interaction. Recheck ACR annually.
    `
  },
  {
    id: 'rec-41',
    patientName: 'David Miller',
    patientAge: 61,
    patientGender: 'Male',
    patientId: 'PT-5573',
    recordType: 'Prescription',
    title: 'Cardioprotective Statin Supplementation',
    date: '2019-05-18',
    shortDescription: 'Rx adjusting Atorvastatin dosage for cardiac risk reduction and cholesterol management.',
    doctorName: 'Dr. Helen Vance',
    department: 'Endocrinology',
    details: `
DIAGNOSIS: Dyslipidemia in a patient with Type 2 Diabetes.

PRESCRIPTION:
1. Atorvastatin (Lipitor) 20mg
   - Dose: 1 tablet orally daily at bedtime.
   - Purpose: Cardiovascular protection and LDL lowering.
   - Instructions: Take daily. Report muscle soreness or unexplained fatigue immediately.

PLAN:
Maintain diet control. Repeat comprehensive lipid panel in 12 weeks.
    `
  },
  {
    id: 'rec-42',
    patientName: 'Tony Stark',
    patientAge: 48,
    patientGender: 'Male',
    patientId: 'PT-3000',
    recordType: 'Lab Result',
    title: 'Arterial Blood Gas (ABG) Analysis',
    date: '2017-06-07',
    shortDescription: 'Vascular blood gas scan checking oxygen partial pressure and respiratory pH profiles.',
    doctorName: 'Dr. Stephen Strange',
    department: 'Cardiothoracic Surgery',
    details: `
TEST: Arterial Blood Gas (ABG) Analysis

RESULTS:
- pH: 7.41 (Normal: 7.35 - 7.45)
- PaCO2: 38 mmHg (Normal: 35 - 45)
- PaO2: 96 mmHg (Normal: 80 - 100)
- HCO3: 24 mEq/L (Normal: 22 - 26)
- SaO2: 98.2% (Normal: >95%)

IMPRESSION:
Normal acid-base status and excellent arterial oxygenation. Cardiopulmonary functions are normal.
    `
  },
  {
    id: 'rec-43',
    patientName: 'Clark Kent',
    patientAge: 35,
    patientGender: 'Male',
    patientId: 'PT-1938',
    recordType: 'Scan',
    title: 'Solar Absorption Cell CT Scan',
    date: '2022-06-16',
    shortDescription: 'Computed tomography scan analyzing intracellular mitochondrial density and density bounds.',
    doctorName: 'Dr. Emil Hamilton',
    department: 'Toxicology',
    details: `
EXAMINATION: High-Resolution Intracellular Computed Tomography

FINDINGS:
1. Mitochondria: Density parameters demonstrate elevated cellular storage efficiency (+120% above normal baselines).
2. Bone Cortex: Exceptional mineral mineralization, providing high structural resistance.
3. Tissue Interfaces: Intact, normal vasculature, with no abnormalities.

IMPRESSION:
Highly resilient tissue profiles showing exceptional solar cellular density. No clinical anomalies detected.
    `
  },
  {
    id: 'rec-44',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Prescription',
    title: 'Post-Concussion Recovery Supplementation',
    date: '2026-06-10',
    shortDescription: 'Targeted neurological supplements to assist recovery and reduce mild light sensitivity.',
    doctorName: 'Dr. Charles Xavier',
    department: 'Neurology',
    details: `
DIAGNOSIS: Recovery phase of mild concussion with persistent photophobia.

PRESCRIPTIONS:
1. Coenzyme Q10 (CoQ10) 100mg
   - Dose: 1 capsule orally twice daily with meals.
2. Magnesium L-Threonate 500mg
   - Dose: 1 capsule orally daily at bedtime.
3. Riboflavin (Vitamin B2) 400mg
   - Dose: 1 tablet orally daily with breakfast.

ADVISORY:
Use polarized glasses outdoors. Avoid direct bright screen exposures after 8 PM.
    `
  },
  {
    id: 'rec-45',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Lab Result',
    title: 'Serum Electrolytes & Kidney Functions',
    date: '2026-05-20',
    shortDescription: 'Complete panel monitoring sodium, potassium, chloride, and metabolic parameters.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
TEST: Serum Electrolytes & Renal Function Panel

RESULTS:
- Sodium: 140 mEq/L (Normal: 135 - 145)
- Potassium: 4.1 mEq/L (Normal: 3.5 - 5.0)
- Chloride: 102 mEq/L (Normal: 98 - 107)
- Carbon Dioxide: 25 mEq/L (Normal: 22 - 29)
- BUN: 12 mg/dL (Normal: 7 - 20)
- Creatinine: 0.92 mg/dL (Normal: 0.60 - 1.30)
- eGFR: 98 mL/min/1.73m² (Normal: >90)

IMPRESSION:
Normal electrolyte balances and stable renal filtration functions. Hydration index is excellent.
    `
  },
  {
    id: 'rec-46',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Scan',
    title: 'Chest X-Ray 2-View (PA & Lateral)',
    date: '2026-04-12',
    shortDescription: 'Radiology scan checking for cardiopulmonary pathology or active lung infiltrates.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
EXAMINATION: Chest Radiograph, 2 Views (Posterior-Anterior and Lateral)

FINDINGS:
1. Lungs: Lungs are clear. No focal consolidation, pleural effusion, or pneumothorax is identified.
2. Heart: The cardiomediastinal silhouette is normal in size and configuration.
3. Bones: Visualized osseous structures are intact. No acute fractures.

IMPRESSION:
No acute cardiopulmonary disease detected. Lungs are clear.
    `
  },
  {
    id: 'rec-47',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Report',
    title: 'Hypertension and Dietetics Progress Report',
    date: '2026-03-05',
    shortDescription: 'Clinical log reviewing cardiovascular pressure management and low-sodium nutrition logs.',
    doctorName: 'Dr. Robert Carter',
    department: 'Internal Medicine',
    details: `
CLINICAL STATUS: Essential Hypertension follow-up and lifestyle modification assessment.

VITALS:
- Baseline BP: 122/78 mmHg (controlled).
- Pulse: 64 bpm.

ASSESSMENT:
The patient's compliance with a low-sodium DASH diet has effectively reduced systolic pressure. Exercise routines are maintained at 30 minutes of cardiovascular walking daily.

PLAN:
1. Continue current lifestyle regimen.
2. Monitor blood pressure twice weekly at home.
    `
  },
  {
    id: 'rec-48',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Prescription',
    title: 'Anti-Inflammatory Knee Joint Care',
    date: '2026-02-14',
    shortDescription: 'NSAID regimen and supportive physical therapy directions for mild patellar inflammation.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
DIAGNOSIS: Mild right patellar tendonitis following overuse.

PRESCRIPTION:
1. Meloxicam (Mobic) 7.5mg
   - Dose: 1 tablet orally once daily with food.
   - Duration: 10 days as needed for inflammation.
2. Topical Diclofenac Sodium (Voltaren) 1% Gel
   - Dose: Apply to right knee joint 3-4 times daily.

ADVISORY:
Rest the joint from high-impact activities. Perform quad-strengthening isometric routines daily.
    `
  },
  {
    id: 'rec-49',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Lab Result',
    title: 'Thyroid Stimulating Hormone (TSH) Screen',
    date: '2025-11-28',
    shortDescription: 'Endocrine assay monitoring free T4 and active metabolic thyroid balances.',
    doctorName: 'Dr. Helen Vance',
    department: 'Endocrinology',
    details: `
TEST: Thyroid Stimulating Hormone (TSH) and Free T4 Panel

RESULTS:
- TSH: 2.15 uIU/mL (Normal: 0.45 - 4.50)
- Free T4: 1.22 ng/dL (Normal: 0.82 - 1.77)

IMPRESSION:
Normal thyroid function. Values indicate stable metabolic homeostasis.
    `
  },
  {
    id: 'rec-50',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientId: 'PT-9942',
    recordType: 'Scan',
    title: 'Right Knee Ultrasound Diagnostic Scan',
    date: '2025-10-05',
    shortDescription: 'Soft tissue diagnostic ultrasound evaluating patellar tendon thickness and synovial fluid checks.',
    doctorName: 'Dr. David Foster',
    department: 'Orthopedics',
    details: `
EXAMINATION: Diagnostic Ultrasound of the Right Knee Patellar Tendon

FINDINGS:
1. Patellar Tendon: Mild thickening at the proximal attachment. No tears or calcifications.
2. Joint Space: Trace fluid accumulation, normal synovial lining.
3. Surrounding Muscles: Quadriceps tendon is normal.

IMPRESSION:
Mild proximal patellar tendonitis. Minimal joint effusion. No acute structural tearing.
    `
  }
];
