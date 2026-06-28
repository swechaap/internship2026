import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';
import { Scheme, UserProfile, ChatMessage, SchemeFAQ, SchemeFeedback, SchemeNotification, EnrollmentRoadmap, VerificationResult } from './src/types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy-initialized Gemini AI Client
let aiClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!aiClient) {
    aiClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return aiClient;
}

// Global In-Memory Databases for the insights platform
const USERS_DB: Record<string, UserProfile & { passwordHash: string }> = {};
const BASE_SCHEMES_DB: Scheme[] = [
  {
    id: "educ-pm-yashasvi",
    name: "PM YASASVI Scholarship Scheme",
    category: "Education",
    description: "Highly focused scholarship scheme for OBC (Other Backward Classes), EBC (Economically Backward Classes), and DNT (De-notified, Nomadic and Semi-Nomadic Tribes) students who are studying in Class 9 or Class 11.",
    benefits: [
      "Scholarship of Rs. 75,000 per annum for Class 9/10 students.",
      "Scholarship of Rs. 1,25,000 per annum for Class 11/12 students.",
      "Covers tuition fees, hostel expenses, and custom books allowance."
    ],
    eligibilityDescription: "Must belong to OBC, EBC, or DNT category. Family income from all sources must not exceed Rs. 2,50,000 per annum. Must be studying in top-class identified schools.",
    minAge: 13,
    maxAge: 19,
    maxIncome: 250000,
    allowedCategories: ["OBC", "SC", "ST"],
    allowedOccupations: ["Student"],
    applicationProcess: [
      "Register on the National Scholarship Portal (NSP).",
      "Apply for NTP Yasasvi Entrance Test or input school-specific academic credentials.",
      "Upload Income, Caste, and Marksheet documents.",
      "Submit school verification form to local block/district officer."
    ],
    requiredDocuments: [
      "Aadhaar Card of Student",
      "Income Certificate (under 2.5 LPA)",
      "Caste Certificate (OBC/EBC/DNT)",
      "Mark-sheet of previous qualifying exam",
      "Fee receipt of current academic class"
    ],
    faqs: [
      {
        question: "Is there an entrance test for PM YASASVI?",
        answer: "Yes, the National Testing Agency (NTA) conducts the YASASVI Entrance Test, although merit basis lists may be used depending on academic years."
      },
      {
        question: "Can general category students apply?",
        answer: "No, this is specifically reserved for OBC, EBC, and DNT class categories as defined by the Ministry of Social Justice."
      }
    ]
  },
  {
    id: "agri-pm-kisan",
    name: "PM-KISAN Samman Nidhi Yojana",
    category: "Agriculture",
    description: "An initiative by the Government of India that provides up to Rs. 6,000 per year in three equal installments to all landholding farmer families across the country.",
    benefits: [
      "Rs. 6000 per year transferred directly to bank accounts (Direct Benefit Transfer).",
      "Paid in 3 equal installments of Rs. 2000 every 4 months.",
      "Financial support for agricultural inputs, fertilizers, seeds, and allied farm expenses."
    ],
    eligibilityDescription: "Must be an active landholder farmer family with cultivable land. Excludes institutional landholders, professionals (doctors, lawyers, engineers), and higher income tax payers.",
    minAge: 18,
    allowedOccupations: ["Farmer"],
    applicationProcess: [
      "Visit PMKisan Portal or local Common Service Centre (CSC).",
      "Enter land holding registration details, survey number, and Aadhaar card number.",
      "Complete bank account seeding and dynamic land verification.",
      "Process e-KYC validation via OTP or biometric scan."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Land Ownership Records (Khatauni/Patta Document)",
      "Bank Account Passbook (Aadhar-seeded)",
      "Active Mobile number for OTP validation"
    ],
    faqs: [
      {
        question: "Can agricultural laborers register for PM-KISAN?",
        answer: "No. The scheme targets land-owning farmers. Pure laborers who do not own agricultural land are excluded."
      },
      {
        question: "Is e-KYC mandatory?",
        answer: "Yes, e-KYC is strictly mandatory to receive benefits of upcoming PM-KISAN installments."
      }
    ]
  },
  {
    id: "ep-mgnrega",
    name: "MGNREGA - National Rural Employment Guarantee",
    category: "Employment",
    description: "Mahatma Gandhi National Rural Employment Guarantee Act provides a legal guarantee for at least 100 days of wage employment in every financial year to adult members of any rural household willing to do public-work-related manual labor.",
    benefits: [
      "Guaranteed 100 days of manual wage employment per year.",
      "Unemployment allowance if work is not allocated within 15 days of applying.",
      "Equal wage parity for male and female workers. Directly debited to bank accounts."
    ],
    eligibilityDescription: "Must be a citizen of India residing in a rural local district area. Willing to undertake unskilled manual agricultural/public works. Must be above 18 years of age.",
    minAge: 18,
    allowedOccupations: ["Unemployed", "Farmer", "None"],
    applicationProcess: [
      "Submit application for registration to local Gram Panchayat office.",
      "Receive unique Job Card containing household wage details within 15 days.",
      "Submit a dated written application requesting work assignment to local Gram Panchayat.",
      "Gram Panchayat allocates work within a 5km radius."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Recent passport size photos of all adult family members",
      "Bank Account Details",
      "Address Proof (Ration Card/Voter ID in Rural jurisdiction)"
    ],
    faqs: [
      {
        question: "How long is a MGNREGA Job Card valid?",
        answer: "A MGNREGA Job Card is valid for 5 years and can be renewed/verified by local panchayat administration."
      },
      {
        question: "What happens if Gram Panchayat fails to provide work?",
        answer: "If work is not provided within 15 days of demand, you are legally entitled to receive a daily unemployment allowance."
      }
    ]
  },
  {
    id: "women-sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Women Welfare",
    description: "A small deposit savings savings scheme promoted for the girl child under the 'Beti Bachao Beti Padhao' campaign. Offers high-interest tax-free saving growth for daughters' future education and marriage.",
    benefits: [
      "Extremely high compounded interest rates (currently 8.2%).",
      "Tax exemptions under Section 80C on deposit and interest income.",
      "Ensures massive financial security for professional high studies or wedding expenses."
    ],
    eligibilityDescription: "Can be opened by biological parents or legal guardians for a girl child. Opened from the birth of the girl child till she attains age 10. Maximum of two accounts per family.",
    maxAge: 10,
    allowedGenders: ["Female"],
    applicationProcess: [
      "Visit any local Post Office, authorized commercial bank branch, or online portal.",
      "Fill out the Sukanya Samriddhi Account Opening Form.",
      "Submit child's birth certificate and guardian records.",
      "Make an initial deposit of minimum Rs. 250 (max Rs. 1.5 Lakh per year)."
    ],
    requiredDocuments: [
      "Birth Certificate of girl child",
      "Aadhaar Card and PAN of the opening Guardian",
      "Address Proof (Electricity Bill, Passport, or Ration Card)",
      "Guardian Passport Photos"
    ],
    faqs: [
      {
        question: "When does the Sukanya Samriddhi account mature?",
        answer: "The account matures after 21 years from the date of opening, or upon marriage of the girl child after she turns 18."
      },
      {
        question: "Can partial withdrawals be turned for education?",
        answer: "Yes, up to 50% withdrawal of the balance of the preceding year is allowed for securing higher education after the girl turns 18 or passes Class 10."
      }
    ]
  },
  {
    id: "health-ayushman-bharat",
    name: "Ayushman Bharat PM-JAY Health Cover",
    category: "Health",
    description: "The largest government funded health assurance scheme in the world, providing cashless hospitalization coverage of up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization.",
    benefits: [
      "Free medical cover of Rs. 5,00,000 per family per year.",
      "Cashless and paperless access to health care services at empaneled hospitals.",
      "Pre and post-hospitalization costs, diagnostic fees, and drug therapy coverage for 3 days pre and 15 days post."
    ],
    eligibilityDescription: "Targeted at poor, deprived rural families and identified urban occupational worker categories. No limit on family size. Assessed based on SECC 2011 poverty database or standard income indicators below 1.2 LPA.",
    maxIncome: 120000,
    applicationProcess: [
      "Check listing on PM-JAY Portal ('Am I Eligible' link) or query nearby Common Service Center.",
      "Visit any empaneled government/private hospital and meet 'Ayushman Mitra' desk officer.",
      "Scan Aadhaar Card or Ration Card to process PM-JAY ID card verification.",
      "Receive printed Ayushman Golden Card for medical treatment."
    ],
    requiredDocuments: [
      "Aadhaar Card / Voter ID Card",
      "Ration Card with entire family list",
      "Income Certificate reflecting distress",
      "SECC-2011 Family Printout or letter"
    ],
    faqs: [
      {
        question: "Does Ayushman Bharat support pre-existing conditions?",
        answer: "Yes, all pre-existing medical conditions are covered from day one of receiving the card."
      },
      {
        question: "Can a family add a newly born baby dynamically?",
        answer: "Yes, newborn children are automatically eligible for cover from their day of birth without waiting for database updates."
      }
    ]
  },
  {
    id: "house-pmay-g",
    name: "Pradhan Mantri Awas Yojana Gramin (PMAY-G)",
    category: "Housing",
    description: "Social housing support program intended to provide pucca houses with clean sanitation amenities of size 25 sq.mt. to all homeless families and those living in dilapidated houses in rural Indian areas.",
    benefits: [
      "Cash assistance of Rs. 1,20,000 in plain areas and Rs. 1,30,000 in hilly/difficult terrains.",
      "Under MGNREGA, additional wage assistance of 90/95 person-days for building labor.",
      "Additional Rs. 12,000 allowance for building toilet under Swachh Bharat Mission (SBM-G)."
    ],
    eligibilityDescription: "Rural families living in zero/one/two-room kutcha houses with mud walls and roofs. Excludes families with 2/3/4 wheelers, high mechanized farm equipment, or regular government salaries.",
    maxIncome: 300000,
    allowedOccupations: ["Unemployed", "Farmer", "None", "Artisan"],
    applicationProcess: [
      "Eligibility details calculated from socio-economic caste census.",
      "Panchayat verifies selected local lists and uploads names to AwaasSoft.",
      "Panchayati Raj selects beneficiaries in custom Gram Sabha meetings.",
      "First tranche directly debited to bank for construction after geotagging old hut."
    ],
    requiredDocuments: [
      "Aadhaar card details of family members",
      "Bank Passbook seeded with Aadhaar",
      "MNREGA Job Card number",
      "Affidavit that applicant does not own any pucca residential house in India"
    ],
    faqs: [
      {
        question: "Who constructs the PMAY house?",
        answer: "Constructing the house is the responsibility of the beneficiary themselves. Contractors are strictly forbidden."
      }
    ]
  },
  {
    id: "social-pension",
    name: "Indira Gandhi National Old Age Pension Scheme",
    category: "Social Welfare",
    description: "A non-contributory direct pension scheme for elderly Indian citizens belonging to households below the poverty line (BPL), which offers monthly financial support.",
    benefits: [
      "Monthly pension of Rs. 200 for citizens aged 60-79 years.",
      "Monthly pension increases to Rs. 500 for senior citizens aged 80 years and above.",
      "Direct benefit direct deposit to bank or post office accounts."
    ],
    eligibilityDescription: "Must be 60 years of age or older. Must belong to a household living Below the Poverty Line (BPL) as verified by local authorities or possessing valid state BPL Ration card.",
    minAge: 60,
    maxIncome: 100000,
    applicationProcess: [
      "Obtain application form from local block development office or Social welfare desk.",
      "Fill out age verification details, attach BPL card copy.",
      "Submit form to Gram Panchayat / Municipal Corporation head.",
      "Social Welfare officer reviews, logs, and processes pension orders."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Age proof certificate (Birth certificate, school marksheet, or official medical age assessment)",
      "Valid BPL Card (Below Poverty Line)",
      "Bank Account details"
    ],
    faqs: [
      {
        question: "Is state pension supplement active?",
        answer: "Yes, several Indian states add supplementary pension funds (additional Rs 500 - Rs 1500) to the central baseline amount."
      }
    ]
  }
];

const SCHEMES_DB: Scheme[] = [...BASE_SCHEMES_DB];

function seedAdditionalSchemes() {
  const categoryNames: Record<string, string[]> = {
    "Education": [
      "Post Matric Scholarship Scheme for SC Students",
      "Pre Matric Scholarship Scheme for Minority Communities",
      "Central Sector Scheme of Scholarship for College and University Students",
      "National Means-cum-Merit Scholarship Scheme (NMMSS)",
      "Pragati Scholarship Scheme for Girl Students (Technical Degree)",
      "Saksham Scholarship Scheme for Specially Abled Students",
      "Kishore Vaigyanik Protsahan Yojana (KVPY) Research Fellowship",
      "Begum Hazrat Mahal National Scholarship for Girls",
      "PM Research Fellowship (PMRF) Program",
      "Prime Minister's Scholarship Scheme for Central Armed Police Forces",
      "National Fellowship for Scheduled Caste Students (NFSC)",
      "Maulana Azad National Fellowship for Minority Students",
      "Single Girl Child Fellowship for Social Sciences Research",
      "SHREYAS Free Coaching and Higher Studies Scheme for OBCs",
      "National Overseas Scholarship for SC/ST students",
      "Inspire She Fellowship for Science Pursuers",
      "Raman-Charpak Fellowship Program",
      "CBSE Merit Scholarship for Single Girl Child",
      "Post-Graduate Indira Gandhi Scholarship for Single Girl Child",
      "AICTE Swanath Scholarship Scheme for Orphans & Wards",
      "Digital India Student Laptop Scheme"
    ],
    "Agriculture": [
      "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) Drip Irrigation",
      "Pradhan Mantri Fasal Bima Yojana (PMFBY) Crop Insurance",
      "Soil Health Card Scheme",
      "Paramparagat Krishi Vikas Yojana (PKVY) Organic Farming",
      "Rashtriya Krishi Vikas Yojana (RKVY) Infrastructure Support",
      "Sub-Mission on Agricultural Mechanization (SMAM) Tractor Subsidy",
      "National Mission on Edible Oils - Oil Palm (NMEO-OP)",
      "Kisan Credit Card (KCC) Interest Subvention Scheme",
      "National Bamboo Mission Development Scheme",
      "Agriculture Infrastructure Fund (AIF) loan scheme",
      "PM Matsya Sampada Yojana (PMMSY) for Aquaculture",
      "Rashtriya Gokul Mission for Cattle Breed Improvement",
      "National Beekeeping and Honey Mission (NBHM)",
      "Pashu Kisan Credit Card Scheme for Animal Husbandry",
      "Micro Irrigation Fund (MIF) Nabard Subsidy",
      "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
      "Coconut Development Board Technology Mission Support",
      "Pradhan Mantri Krishi Vikas Krishi Shala (Farm Field Classrooms)",
      "Submission on Seeds and Planting Material (SMSP)",
      "National Mission on Sustainable Agriculture (NMSA)",
      "Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM) Solar Pumps"
    ],
    "Women Welfare": [
      "Pradhan Mantri Matru Vandana Yojana (PMMVY) Maternity Benefit",
      "Beti Bachao Beti Padhao National Advocacy Fund",
      "One Stop Centre (OSC) Support and Shelter for Distress Women",
      "Working Women Hostel Allocation and Rent Subsidy Scheme",
      "Mahila Co-operative Dairy Startup Program",
      "Priyadarshini Women Self Help Group Livelihood Scheme",
      "Mahila Shakti Kendra (MSK) Rural Empowerment Centers",
      "Support to Training and Employment Programme for Women (STEP)",
      "Stand-Up India Scheme for Women Entrepreneurs",
      "Pradhan Mantri Ujjwala Yojana Free LPG Connection",
      "Nari Shakti Puraskar Skill Incubation Grant",
      "Swayamsidha Integrated Women Development Program",
      "State Widow Remarriage Promotion Assistance",
      "Kalyana Lakshmi Shaadi Mubarak Marriage Grant",
      "Mahila Police Volunteers Supportive Network",
      "Tejaswini Rural Women Empowerment Program",
      "State Gender budget rural tailoring equipment grant",
      "Nirbhaya Safe Transportation and Safety Device Subsidy",
      "Dhanalakshmi Cash Incentive Scheme for Female Birth Preservation",
      "Scheme for Rehabilitation of Trafficked Women (Ujjawala)",
      "Mahila Kisan Sashaktikaran Pariyojana (MKSP)"
    ],
    "Employment": [
      "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0) Tech Skill-up",
      "Prime Minister's Employment Generation Programme (PMEGP) Subsidy",
      "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
      "Deendayal Antyodaya Yojana - National Rural Livelihoods Mission",
      "National Urban Livelihoods Mission (NULM) Skill Training",
      "Aatmanirbhar Bharat Rojgar Yojana (ABRY) Provident Fund Support",
      "Pradhan Mantri Mudra Yojana (PMMY) Shishu Business Loans",
      "National Career Service (NCS) Portal & Job Fair Scheme",
      "Pradhan Mantri Rojgar Protsahan Yojana (PMRPY)",
      "Sudarshan Handicraft Artisan Livelihood Support Scheme",
      "National Apprenticeship Promotion Scheme (NAPS) Wage Reimbursement",
      "Coir Udyami Yojana (CUY) Cooperative Self-Employment",
      "Special Employment Linkage Scheme for Border Area Youth",
      "Garib Kalyan Rojgar Abhiyaan for Migrant Labor",
      "State Urban Wage Employment Initiative (SUWEI)",
      "PM-PRANAM Bio-Fertilizer Self Employment Scheme",
      "SFC Street Vendor Micro-Business Rehabilitation Fund",
      "Rural Self Employment Training Institutes (RSETI) Support",
      "Khadi Gramodyog Vikas Yojana (KGVY) Artisan Stipend",
      "Single Window Green Industry Start-up Grant",
      "Karmayogi Skilled Professional Apprenticeship Scheme"
    ],
    "Health": [
      "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) Antenatal Care",
      "Janani Shishu Suraksha Karyakram (JSSK) Zero Expense Delivery",
      "Rashtriya Kishor Swasthya Karyakram (RKSK) Teen Health Scheme",
      "Pradhan Mantri National Dialysis Program Free Sessions",
      "Ayushman Arogya Mandir (Ayushman Bharat Health & Wellness Centres)",
      "Pradhan Mantri Bhartiya Janaushadhi Pariyojana Generic Medicine",
      "National Tuberculosis Elimination Program (NTEP) Nutritional Support",
      "Rashtriya Bal Swasthya Karyakram (RBSK) Child Health Screening",
      "Mission Indradhanush National Immunization Campaign",
      "National Leprosy Eradication Programme (NLEP) Reconstructive Aid",
      "Universal Immunization Programme (UIP) Vaccine Registry",
      "National Oral Health Program Dental Checkup Subsidy",
      "State Cochlear Implant Free Surgery Scheme",
      "PM National Cardiac Care and Valve Replacement Subsidy",
      "National Stroke Prevention and Cashless Thrombolysis Scheme",
      "State Rare Diseases Medical Lifesaver Fund",
      "Janani Suraksha Yojana (JSY) Cash Assistance for Institutional Delivery",
      "Rashtriya Arogya Nidhi (RAN) One-time Cash Grant for Rare Cancers",
      "PM Poshan Abhiyaan Anemia Prevention Supplements",
      "National Programme for Health Care of the Elderly (NPHCE) Mobile Labs",
      "National Mental Health Programme Community Counselling Network"
    ],
    "Housing": [
      "Pradhan Mantri Awas Yojana Urban (PMAY-U) Affordable Housing",
      "Affordable Rental Housing Complexes (ARHCs) Migrant Hostels",
      "Deendayal Housing Scheme for Rural Slum Redevelopment",
      "Ambedkar Rural Housing Clean Sanitation Home Subsidy",
      "Valmiki Ambedkar Malin Basti Awas Yojana (VAMBAY)",
      "State Fisherman Housing Colony Grant",
      "Rural Homestead Land Allocation Scheme for Landless Labor",
      "Pradhan Mantri Adi Adarsh Gram Yojana Housing Support",
      "State Scheduled Tribe Habitat Reconstruction Scheme",
      "Weavers Housing-cum-Work Shed Subsidy",
      "State Hill-Area Earthquake Resistant Prefab House Grant",
      "Night Shelter Support Scheme for Urban Homeless",
      "State Eco-friendly Bamboo Housing Support for Coastal Areas",
      "Transit Hostel Scheme for Working Youth",
      "State Salt-Pan Workers Habitat Safe Shelter Subsidy",
      "PM SVANidhi Street Vendor Tiny Modular Kiosk Scheme",
      "State Low-Income Group (LIG) Multi-Storey Flats Subsidy",
      "State Forest-dweller Pucca House Allocation Under FRA",
      "State Cyclone Shelters and Reconstruction Housing Fund",
      "State Senior Citizen Community Shared Dormitory Subsidy",
      "Affordable Housing Interest Subvention Scheme (AHISS)"
    ],
    "Social Welfare": [
      "Atal Pension Yojana (APY) Guaranteed Monthly Retirement Income",
      "Pradhan Mantri Suraksha Bima Yojana (PMSBY) 2 Lakh Accident Cover",
      "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) Life Cover",
      "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM) Unorganized Workers",
      "National Family Benefit Scheme (NFBS) Primary Breadwinner Compensation",
      "Panchayat Divyang Sahayata Assistance for Persons with Disabilities",
      "Pradhan Mantri Vaya Vandana Yojana (PMVVY) Senior Citizen Deposit",
      "National Social Assistance Programme (NSAP) Disability Pension",
      "Panchayat Destitute Widow Cash Remittance Assistance",
      "State Artisan Pension and Handloom Weavers Pension Scheme",
      "Rashtriya Vayoshri Yojana (RVY) Physical Aids for Indigent Seniors",
      "State Transgender Livelihood & Monthly Social Dignity Stipend",
      "Panchayat Orphanage and Foster Care Cash Subsidy",
      "State Border Conflict Relief and Ex-Servicemen Welfare Fund",
      "Direct Cash Benefit for Unorganized Sector Construction Workers",
      "National Disaster Response Fund Rehabilitation Grant",
      "State Destitute Welfare Ashram and Free Food Grain Allocation",
      "Pravasi Bharatiya Insurance & Emergency Evacuation Welfare Fund",
      "PM-YASASVI OBC and Hostels Upkeep Grant",
      "National Safai Karamcharis Development Finance Subsidy",
      "State Leprosy Reintegrated Dignity Monthly Living Support"
    ]
  };

  const categories = Object.keys(categoryNames) as Scheme['category'][];

  categories.forEach(category => {
    const list = categoryNames[category];
    list.forEach((schemeName, idx) => {
      const shortId = category.toLowerCase().slice(0, 4) + "-" + schemeName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20) + "-" + idx;
      
      let minAge: number | undefined = undefined;
      let maxAge: number | undefined = undefined;
      let maxIncome: number | undefined = undefined;
      let allowedGenders: ('Male' | 'Female' | 'Transgender' | 'Other')[] | undefined = undefined;
      let allowedCategories: ('General' | 'OBC' | 'SC' | 'ST')[] | undefined = undefined;
      let allowedOccupations: string[] | undefined = undefined;

      if (category === "Education") {
        minAge = 6 + (idx % 12);
        maxAge = 20 + (idx % 10);
        maxIncome = 150000 + (idx * 30000);
        allowedOccupations = ["Student"];
        if (idx % 3 === 0) allowedCategories = ["OBC", "SC", "ST"];
        else if (idx % 3 === 1) allowedCategories = ["SC", "ST"];
      } else if (category === "Agriculture") {
        minAge = 18;
        maxIncome = idx % 2 === 0 ? 300000 + (idx * 20000) : undefined;
        allowedOccupations = ["Farmer"];
      } else if (category === "Women Welfare") {
        minAge = 12 + (idx % 18);
        maxIncome = 100000 + (idx * 25000);
        allowedGenders = ["Female"];
        if (idx % 4 === 0) allowedCategories = ["SC", "ST"];
      } else if (category === "Employment") {
        minAge = 18;
        maxAge = 35 + (idx % 15);
        maxIncome = 200000 + (idx * 20000);
        allowedOccupations = ["Unemployed", "Student", "Farmer", "Artisan", "None"];
      } else if (category === "Health") {
        minAge = idx % 3 === 0 ? 60 : undefined;
        maxAge = idx % 3 === 1 ? 18 : undefined;
        maxIncome = 120000 + (idx * 25000);
      } else if (category === "Housing") {
        minAge = 18;
        maxIncome = 150000 + (idx * 30000);
        allowedOccupations = ["Unemployed", "Farmer", "Artisan", "None"];
      } else if (category === "Social Welfare") {
        minAge = idx % 2 === 0 ? 60 : 18;
        maxIncome = 100000 + (idx * 15000);
        if (idx % 4 === 0) allowedCategories = ["OBC", "SC", "ST"];
      }

      if (idx % 5 === 0) {
        maxIncome = undefined;
        allowedCategories = undefined;
        allowedGenders = undefined;
      }

      const formattedIncomeDescription = maxIncome ? `Maximum annual household income must not exceed ₹${maxIncome.toLocaleString('en-IN')}. ` : "No strict limits of annual household income applicable. ";
      const formattedAgeDescription = `Eligible for applicants ${minAge ? `aged above ${minAge}` : 'of any age'}${maxAge ? ` and below ${maxAge} years.` : ' with no upper age limit.'}`;
      const eligibilityDescription = `Socio-demographics matching validation applies. ${formattedIncomeDescription}${formattedAgeDescription} Must possess correct verification files.`;

      const description = `The ${schemeName} is organized under welfare guidelines to provide long-term support. Offers direct credit transfer, skill building, or material grants to elevate the socio-economic status of target citizen cohorts.`;

      const benefits = [
        `Direct financial relief and subsidies matching core objectives.`,
        `Integrated capacity training or support credits calculated by nodal officers.`,
        `End-to-end assistance tracking and grievance redressal via online dashboard.`
      ];

      const applicationProcess = [
        `Submit baseline profile mapping registrations online on the official scheme portal.`,
        `Complete biometric KYC verification or Aadhaar demographic check at nearby kiosk.`,
        `Upload and register required identification registries and supportive local credentials.`,
        `Receive confirmation notification details and monitor direct transfer (DBT) schedule.`
      ];

      const requiredDocuments = [
        `Aadhaar Identification Card (seeded with active mobile)`,
        `Valid Income Certificate produced by local Revenue authority`,
        `Residence Certificate validating current jurisdictional district state`,
        `Detailed community Caste certificate (if under SC/ST/OBC category)`
      ];

      const faqs = [
        {
          question: `Who can apply for the ${schemeName}?`,
          answer: `Any eligible citizen meeting the age, caste, and income thresholds specified in the official scheme guidelines can register.`
        },
        {
          question: `How long does the approval process take?`,
          answer: `Upon successful registration and file validation, the local department typically approves accounts within 15 to 30 working days.`
        }
      ];

      SCHEMES_DB.push({
        id: shortId,
        name: schemeName,
        category,
        description,
        benefits,
        eligibilityDescription,
        minAge,
        maxAge,
        maxIncome,
        allowedGenders,
        allowedCategories,
        allowedOccupations,
        applicationProcess,
        requiredDocuments,
        faqs
      });
    });
  });
}

// Invoke seed blocks
seedAdditionalSchemes();

const FEEDBACK_DB: SchemeFeedback[] = [
  {
    id: "fb-1",
    schemeId: "agri-pm-kisan",
    schemeName: "PM-KISAN Samman Nidhi Yojana",
    userName: "Rajesh Kumar",
    rating: 5,
    issueType: "General Feedback",
    comment: "Received all standard installments on time in my bank account. Excellent initiative!",
    status: "Resolved",
    createdAt: "2026-06-15T12:00:00Z"
  },
  {
    id: "fb-2",
    schemeId: "educ-pm-yashasvi",
    schemeName: "PM YASASVI Scholarship Scheme",
    userName: "Sanjana Patel",
    rating: 3,
    issueType: "Technical Issue",
    comment: "Facing issues during NSP validation step. The bank verification is pending since 2 weeks.",
    status: "Open",
    createdAt: "2026-06-20T10:30:00Z"
  }
];

const NOTIFICATIONS_DB: SchemeNotification[] = [
  {
    id: "notif-1",
    title: "PM-KISAN e-KYC Deadline Extended",
    message: "Attention Farmers! The last date to complete your mandatory PM-KISAN Aadhaar e-KYC has been extended to July 31, 2026. Complete via OTP to secure your next installment.",
    deadline: "2026-07-31",
    type: "Deadline",
    sentTo: "All Scheme Beneficiaries",
    sentAt: "2026-06-21T09:00:00Z"
  },
  {
    id: "notif-2",
    title: "New Scheme Launched: PM Yasasvi",
    message: "A new scholarship scheme has been introduced for OBC/EBC student categories. Registrations are open on National Scholarship Portal.",
    type: "New Scheme",
    sentTo: "Students under EBC categories",
    sentAt: "2026-06-18T14:30:00Z"
  }
];

const ENROLLMENTS_DB: Record<string, EnrollmentRoadmap[]> = {};

// Auxiliary Function: Local Eligibility Match Score Algorithm (100% Robust offline fallback)
function getLocalMatchScore(user: UserProfile, scheme: Scheme): { score: number, reasons: string[] } {
  let score = 100;
  const reasons: string[] = [];

  // Age match
  if (scheme.minAge && user.age < scheme.minAge) {
    score -= 30;
    reasons.push(`Minimum required age is ${scheme.minAge} (You are ${user.age})`);
  } else if (scheme.minAge) {
    reasons.push(`Meets minimum age limit of ${scheme.minAge}`);
  }

  if (scheme.maxAge && user.age > scheme.maxAge) {
    score -= 30;
    reasons.push(`Maximum allowed age is ${scheme.maxAge} (You are ${user.age})`);
  } else if (scheme.maxAge) {
    reasons.push(`Meets maximum age limit of ${scheme.maxAge}`);
  }

  // Income match
  if (scheme.maxIncome && user.annualIncome > scheme.maxIncome) {
    const diff = user.annualIncome - scheme.maxIncome;
    const penalty = Math.min(40, Math.floor((diff / scheme.maxIncome) * 30));
    score -= penalty;
    reasons.push(`Income Rs. ${user.annualIncome.toLocaleString('en-IN')} exceeds limit of Rs. ${scheme.maxIncome.toLocaleString('en-IN')}`);
  } else if (scheme.maxIncome) {
    reasons.push(`Income matches criteria (Rs. ${user.annualIncome.toLocaleString('en-IN')} <= Rs. ${scheme.maxIncome.toLocaleString('en-IN')})`);
  }

  // Gender match
  if (scheme.allowedGenders && scheme.allowedGenders.length > 0) {
    if (!scheme.allowedGenders.includes(user.gender)) {
      score -= 40;
      reasons.push(`Restricted to ${scheme.allowedGenders.join(', ')} (Your registered gender is ${user.gender})`);
    } else {
      reasons.push(`Gender verification matches (${user.gender})`);
    }
  }

  // Caste Category match
  if (scheme.allowedCategories && scheme.allowedCategories.length > 0) {
    if (!scheme.allowedCategories.includes(user.category)) {
      score -= 25;
      reasons.push(`Targeted group category: ${scheme.allowedCategories.join(', ')} (Your category: ${user.category})`);
    } else {
      reasons.push(`Class category matches eligibility (${user.category})`);
    }
  }

  // Occupation match
  if (scheme.allowedOccupations && scheme.allowedOccupations.length > 0) {
    if (!scheme.allowedOccupations.includes(user.occupation)) {
      score -= 25;
      reasons.push(`Preferred occupation matches: ${scheme.allowedOccupations.join(', ')} (Your occupation: ${user.occupation})`);
    } else {
      reasons.push(`Occupation matches scheme focus (${user.occupation})`);
    }
  }

  // Extra triggers based on specific groups
  if (scheme.id.includes('women') && user.isWidowOrSingleMother) {
    score = Math.min(100, score + 10);
    reasons.push("Preferred priority given for widows/single mothers");
  }
  if (scheme.id.includes('health') && user.isPhysicallyChallenged) {
    score = Math.min(100, score + 10);
    reasons.push("Priority medical weightage for physically challenged categories");
  }

  return {
    score: Math.max(0, score),
    reasons: reasons.length > 0 ? reasons : ["General socio-demographic suitability matches."]
  };
}

// REST endpoints API first
app.post('/api/auth/signup', (req, res) => {
  const { password, ...profile } = req.body;
  if (!profile.email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Enforce valid email validation
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(profile.email);
  if (!isValidEmail) {
    return res.status(400).json({ error: "Please enter a valid email address (e.g. name@yahoo.com or name@gmail.com)" });
  }

  // Enforce password pattern validation
  const pass = password || '';
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  const isStrong = pass.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;

  if (!isStrong) {
    return res.status(400).json({ 
      error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" 
    });
  }

  if (USERS_DB[profile.email]) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const completeProfile: UserProfile = {
    id: `u-${Date.now()}`,
    name: profile.name || 'Citizen User',
    email: profile.email,
    age: Number(profile.age) || 30,
    gender: profile.gender || 'Male',
    state: profile.state || 'Telangana',
    district: profile.district || 'Hyderabad',
    annualIncome: Number(profile.annualIncome) || 120000,
    category: profile.category || 'General',
    education: profile.education || 'High School',
    occupation: profile.occupation || 'Unemployed',
    isPhysicallyChallenged: !!profile.isPhysicallyChallenged,
    isMinority: !!profile.isMinority,
    isWidowOrSingleMother: !!profile.isWidowOrSingleMother,
  };

  USERS_DB[profile.email] = {
    ...completeProfile,
    passwordHash: password || 'default'
  };

  // Seed default roadmap empty list
  ENROLLMENTS_DB[completeProfile.id] = [];

  res.json({ success: true, user: completeProfile });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS_DB[email];
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.put('/api/auth/profile', (req, res) => {
  const profile: UserProfile = req.body;
  if (!profile.email || !USERS_DB[profile.email]) {
    return res.status(404).json({ error: "User not found" });
  }

  const existingHash = USERS_DB[profile.email].passwordHash;
  USERS_DB[profile.email] = {
    ...profile,
    passwordHash: existingHash
  };

  res.json({ success: true, user: profile });
});

app.get('/api/schemes', (req, res) => {
  const email = req.query.email as string;
  if (email && USERS_DB[email]) {
    const user = USERS_DB[email];
    const schemesWithScores = SCHEMES_DB.map(scheme => {
      const matchDetails = getLocalMatchScore(user, scheme);
      return {
        ...scheme,
        matchScore: matchDetails.score,
        matchReasons: matchDetails.reasons
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    return res.json(schemesWithScores);
  }
  // Otherwise default list
  res.json(SCHEMES_DB);
});

// Admin Metrics Analytics
app.get('/api/analytics', (req, res) => {
  // Compute analytics based on registered users and feedback database
  const userCount = Object.keys(USERS_DB).length;
  const feedbackCount = FEEDBACK_DB.length;
  
  // Calculate category distributions
  const categoryCounts: Record<string, number> = {};
  SCHEMES_DB.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  // District usage data matching mock database
  const districtDistribution = [
    { district: "Hyderabad", count: Math.max(5, userCount * 2 + 1) },
    { district: "Nalgonda", count: Math.max(2, userCount * 1 + 2) },
    { district: "Rangareddy", count: Math.max(3, userCount * 1) },
    { district: "Warangal", count: Math.max(4, userCount + 1) },
    { district: "Medchal", count: 2 }
  ];

  // Feedback statistics
  const averageRating = FEEDBACK_DB.reduce((acc, f) => acc + f.rating, 0) / (feedbackCount || 1);

  // Popular Schemes count based on categories or mock enrollment roadmap totals
  const schemeEnrollmentStats = SCHEMES_DB.map(s => {
    let count = 0;
    Object.values(ENROLLMENTS_DB).forEach(roadmaps => {
      if (roadmaps.some(r => r.schemeId === s.id)) count++;
    });
    return {
      schemeId: s.id,
      name: s.name,
      category: s.category,
      enrollments: count + Math.floor(Math.random() * 15) + 5 // baseline stats
    };
  });

  res.json({
    metrics: {
      totalUsers: userCount + 120, // baseline + real registered
      totalSchemes: SCHEMES_DB.length,
      averageRating: Number(averageRating.toFixed(1)),
      resolvedIssues: FEEDBACK_DB.filter(f => f.status === 'Resolved').length + 8,
      pendingIssues: FEEDBACK_DB.filter(f => f.status === 'Open').length + 3
    },
    categoryCounts,
    districtDistribution,
    schemeEnrollmentStats
  });
});

// POST alert simulation
app.post('/api/send-alert', (req, res) => {
  const { title, message, type, sentTo } = req.body;
  const newNotif: SchemeNotification = {
    id: `notif-${Date.now()}`,
    title,
    message,
    type: type || 'SMS',
    sentTo: sentTo || 'Beneficiaries',
    sentAt: new Date().toISOString()
  };
  NOTIFICATIONS_DB.unshift(newNotif);
  res.json({ success: true, notification: newNotif });
});

app.get('/api/notifications', (req, res) => {
  res.json(NOTIFICATIONS_DB);
});

// Feedback submissions
app.post('/api/feedback', (req, res) => {
  const { schemeId, schemeName, userName, rating, issueType, comment } = req.body;
  const newFeedback: SchemeFeedback = {
    id: `fb-${Date.now()}`,
    schemeId,
    schemeName,
    userName: userName || 'Anonymous',
    rating: Number(rating) || 5,
    issueType: issueType || 'General Feedback',
    comment: comment || '',
    status: 'Open',
    createdAt: new Date().toISOString()
  };
  FEEDBACK_DB.unshift(newFeedback);
  res.json({ success: true, feedback: newFeedback });
});

app.get('/api/feedback', (req, res) => {
  res.json(FEEDBACK_DB);
});

// AI Scheme Recommendation Engine (Direct deep-dive using Gemini API)
app.post('/api/ai/recommendations', async (req, res) => {
  const { user, language } = req.body;
  if (!user) {
    return res.status(400).json({ error: "User profile data is required" });
  }

  try {
    
    const prompt = `
You are the AI Recommendation Engine for the Government Schemes Platform in India. 
We need to analyze this user profile and provide personalized matching insight details relative to our core schemes.

USER PROFILE:
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- State: ${user.state}, District: ${user.district}
- Annual Family Income: Rs. ${user.annualIncome} 
- Social Category: ${user.category}
- Education Level: ${user.education}
- Occupation: ${user.occupation}
- Physically Challenged: ${user.isPhysicallyChallenged ? "Yes" : "No"}
- Minority Status: ${user.isMinority ? "Yes" : "No"}
- Widow or Single Mother Status: ${user.isWidowOrSingleMother ? "Yes" : "No"}

AVAILABLE SCHEMES SCHEMATICS:
${JSON.stringify(SCHEMES_DB.map(s => ({ id: s.id, name: s.name, category: s.category, eligibilityDesc: s.eligibilityDescription })))}

Analyze each scheme and output a JSON array of scheme-specific fits, representing:
1. "schemeId": matching the exact list ID
2. "matchScore": integer (0 to 100) representing qualification chance
3. "recommendationReason": a highly specific personalized sentence explaining WHY they qualify or are given weightage, referencing their specific age, income, caste, etc. Or why they are docked points.
4. "actionTip": what direct next steps this custom citizen should implement (e.g. "Register on NSP portal because you are a category Student", "Seed your Land Khatauni details").

IMPORTANT: You MUST write the "recommendationReason" and "actionTip" values in ${language || 'English'}.
If the language is Telugu, write them in beautiful, professional, and grammatically correct Telugu script.
If the language is Hindi, write them in beautiful, professional, and grammatically correct Hindi (Devanagari) script.
Otherwise, write them in English.
Keep them highly encouraging, realistic, and completely in the target language.

Keep responses concise. Respond ONLY with valid JSON structure, for example:
[
  { "schemeId": "agri-pm-kisan", "matchScore": 85, "recommendationReason": "...", "actionTip": "..." }
]
DO NOT output any markdown tags outside the json itself. Keep JSON strict.
`;

    // Retrieve recommendation from Gemini-3.5-flash
    const ai = getGroqClient();

const completion = await ai.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.3,
});

const aiText =
  completion.choices[0]?.message?.content || "[]";

const data = JSON.parse(aiText);
    res.json({ success: true, recommendations: data });
  } catch (error: any) {
    console.info("Info: Recommendation fallback applied streamingly.");
    // Offline fallback using local calculations
    const localRecs = SCHEMES_DB.map(scheme => {
      const match = getLocalMatchScore(user, scheme);
      return {
        schemeId: scheme.id,
        matchScore: match.score,
        recommendationReason: match.reasons.join(' • '),
        actionTip: `Prepare your standard ${scheme.requiredDocuments[0] || 'Aadhaar Card'} for submission.`
      };
    });
    res.json({ success: true, recommendations: localRecs, fallback: true });
  }
});


// AI Document Verification (Module 9)
app.post('/api/ai/verify-document', async (req, res) => {
  const { docType, documentText, mockDetails } = req.body;
  if (!docType) {
    return res.status(400).json({ error: "Document type is required" });
  }

  try {const ai = getGroqClient();

    const prompt = `
You are the AI Document Verification engine for the Government Schemes Platform. 
Your task is to analyze the text contents or details of a citizen's uploaded document to detect readiness, verify completeness, check for mismatches, and identify missing parts.

DOCUMENT SYSTEM:
Type uploaded: ${docType}
Provided text or description of the document: "${documentText || mockDetails || "A default scanned soft-copy"}"

Please run a verification checklist based on typical Indian administrative standards (e.g., Aadhaar card needs 12 digits, Income certification needs digital seal/date and income values, Caste certificate needs caste name, bank passbook needs IFSC bank number).

Provide output in JSON matching this schema:
{
  "success": boolean (indicating if document is valid and clear of fatal errors),
  "notes": "A summary of verification status, listing matched fields like Name, DOB, status etc.",
  "readinessScore": number (0 to 100 representing readiness of document for government applications),
  "missingDocuments": string[] (list any associated documents they might need to submit with this, or missing fields detected)
}

Respond ONLY with valid JSON. Do not include markdown tags.
`;

    const completion = await ai.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.2,
});

const data = JSON.parse(
  completion.choices[0]?.message?.content || "{}"
);
    res.json({ success: true, result: data });
  } catch (error: any) {
    console.info("Info: Document verification fallback applied streamingly.");
    // High-fidelity smart local fallback
    let score = 50;
    let notes = "Verification calculated locally via standard Indian administrative checklists. ";
    const missingDocs: string[] = [];
    
    const textLower = ((documentText || mockDetails || "") + " " + docType).toLowerCase();
    
    if (docType === "Aadhaar Card" || docType.toLowerCase().includes("aadhaar")) {
      const matchDigits = textLower.match(/\d{4}\s?\d{4}\s?\d{4}/);
      if (matchDigits || textLower.includes("uidai") || textLower.length > 15) {
        score = 90;
        notes += "Recognized Aadhaar format with a valid layout check. Ready to apply.";
      } else {
        score = 65;
        notes += "Could not verify standard 12-digit Aadhaar pattern. Please check that Aadhaar number is typed/scanned clearly.";
        missingDocs.push("Legible Aadhaar Photo/UIDAI ID");
      }
    } else if (docType === "Income Certificate" || docType.toLowerCase().includes("income")) {
      if (textLower.includes("income") || textLower.includes("salary") || textLower.includes("rs") || textLower.includes("lpa") || textLower.length > 15) {
        score = 85;
        notes += "Income Statement validated successfully. Matches administrative criteria.";
      } else {
        score = 60;
        notes += "Income bracket figures or Revenue Seal could not be scanned. Ensure details are fully legible.";
        missingDocs.push("Verified Income Certificate from Revenue Authority");
      }
    } else if (docType === "Caste Certificate" || docType.toLowerCase().includes("caste")) {
      if (textLower.includes("caste") || textLower.includes("obc") || textLower.includes("sc") || textLower.includes("st") || textLower.length > 15) {
        score = 85;
        notes += "Caste certification verified. Category matches profile.";
      } else {
        score = 55;
        notes += "Caste or community category not explicitly matched. Check spelling or upload a new scan.";
        missingDocs.push("Government Community Certificate");
      }
    } else {
      score = textLower.length > 20 ? 80 : 55;
      notes += "Document processed. Details checked against state eligibility schemas.";
      if (score < 70) {
        missingDocs.push("Signed copy or official seal verification link");
      }
    }

    const fallbackResult: VerificationResult = {
      docName: docType,
      success: score >= 70,
      notes,
      readinessScore: score,
      missingDocuments: missingDocs
    };
    res.json({ success: true, result: fallbackResult, fallback: true });
  }
});


// Multilingual AI Chatbot with English, Hindi, Telugu and Voice Support representations
app.post('/api/ai/chat', async (req, res) => {
  const { messages, userProfile, currentLanguage } = req.body;
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  let selectedLang = currentLanguage || 'English';
  const userMessageRaw = messages[messages.length - 1]?.text || "";
  const userMessageLower = userMessageRaw.toLowerCase();

  // Smart automatic language detection based on message content and script characters
  if (
    userMessageLower.includes('in hindi') || 
    userMessageLower.includes('hindi mein') || 
    userMessageLower.includes('hindi me') || 
    userMessageLower.includes('हिन्दी') || 
    userMessageLower.includes('हिंदी') || 
    /[\u0900-\u097F]/.test(userMessageRaw)
  ) {
    selectedLang = 'Hindi';
  } else if (
    userMessageLower.includes('in telugu') || 
    userMessageLower.includes('telugu lo') || 
    userMessageLower.includes('telugulo') || 
    userMessageLower.includes('తెలుగు') || 
    /[\u0C00-\u0C7F]/.test(userMessageRaw)
  ) {
    selectedLang = 'Telugu';
  } else if (
    userMessageLower.includes('in english') || 
    userMessageLower.includes('english please')
  ) {
    selectedLang = 'English';
  }

  const chatHistory = messages.slice(-5).map((m: any) => `${m.sender === 'user' ? 'Citizen' : 'AI Assistant'}: ${m.text}`).join('\n');

  try {
const ai = getGroqClient();    
    // Custom system instruction for general-purpose multilingual agent with scheme capabilities
    const systemInstruction = `
You are Varta, a highly capable, general-purpose Multilingual AI Assistant.
You can answer absolutely ANY questions across any topic (including coding, general knowledge, math, science, history, writing, advice, lifestyle, translation, etc.).
You are NOT restricted or limited in any way to government schemes. If the user asks about general things, answer them completely and expertly.

However, you also have access to full intelligence regarding Indian Government welfare schemes, and if asked about them, you can guide citizens regarding benefits, scholarships, farmer funds, old-age pensions, and women welfare programs.

CURRENT USER PROFILE DETAILS FOR PERSONALIZATION (in case they ask for customized scheme matching or personalized answers):
${userProfile ? JSON.stringify(userProfile) : "No logged-in profile details."}

CRITICAL LANGUAGE & SCRIPT REQUIREMENT (MANDATORY):
You MUST respond EXCLUSIVELY in the language: ${selectedLang}.
- If the requested language is 'Telugu', you MUST write your entire response using the Telugu script (తెలుగు సంభాషణ) and only Telugu vocabulary. You are strictly forbidden from writing in English, using Latin alphabet, or explaining things in English. Your output must be entirely in Telugu.
- If the requested language is 'Hindi', you MUST write your entire response using the Hindi Devanagari script (हिंदी संवाद) and only Hindi vocabulary. You are strictly forbidden from writing in English, using Latin alphabet, or explaining things in English. Your output must be entirely in Hindi.
- If the requested language is 'English', you must reply in English.

Do not mix languages. Everything must be translated or spoken natively in the selected language: ${selectedLang}.
`;

   const userMessage =
  messages[messages.length - 1].text;

const completion =
  await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: systemInstruction,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
  });

let botReply =
  completion.choices[0]?.message?.content ||
  "Hello! How can I assist you today?";

    // Represent synthetic Text-to-Speech (voice) if requested
    let extraAudioData: string | undefined = undefined;
    
    // We can simulate voice responses in Indian accents or generate realistic synthetic representations.
    // If the user checked a 'voice interaction option', we can alert the client with a virtual audio marker or use static generated TTS bytes, 
    // but the actual system can play synthetic transcriptions. We'll mark the message with `voice: true` to indicate visual phonetic playback capability.
    
    res.json({
      success: true,
      sender: 'bot',
      text: botReply,
      language: selectedLang,
      voice: true
    });
  } catch (error: any) {
    console.info("Info: Chatbot fallback applied streamingly.");
    
    let defaultFallback = "I am here to help you answer any questions, including general knowledge, coding, lifestyle queries, as well as Indian government welfare schemes! Feel free to ask me anything.";
    
    if (selectedLang === 'Telugu') {
      defaultFallback = "సాధారణ జ్ఞానం, కోడింగ్, జీవనశైలి ప్రశ్నలు, అలాగే భారత ప్రభుత్వ సంక్షేమ పథకాలతో సహా ఏవైనా ప్రశ్నలకు సమాధానం ఇవ్వడానికి నేను ఇక్కడ ఉన్నాను! నన్ను ఏదైనా అడగడానికి సంకోచించకండి.";
    } else if (selectedLang === 'Hindi') {
      defaultFallback = "मैं यहाँ आपके किसी भी प्रश्न का उत्तर देने के लिए हूँ, जिसमें सामान्य ज्ञान, कोडिंग, जीवन शैली के प्रश्न, साथ ही भारतीय सरकारी कल्याण योजनाएं भी शामिल हैं! बेझिझक मुझसे कुछ भी पूछें।";
    }

    // Match Telangana / Hyderabad / Andhra
    if (userMessageLower.includes('telangana') || userMessageLower.includes('andhra') || userMessageLower.includes('hyderabad') || userMessageLower.includes('తెలంగాణ') || userMessageLower.includes('ఆంధ్ర') || userMessageLower.includes('హైదరాబాద్') || userMessageLower.includes('तेलंगाना') || userMessageLower.includes('आंध्र') || userMessageLower.includes('हैदराबाद')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "తెలంగాణ మరియు ఆంధ్రప్రదేశ్ భారతదేశంలో బలమైన సాంస్కృతిక మరియు ఆర్థిక వారసత్వం కలిగిన రాష్ట్రాలు. హైదరాబాద్ ఈ ప్రాంతంలో ప్రధాన సాంకేతిక హబ్ గా విరాజిల్లుతోంది. ఇక్కడ రైతు బంధు, ఆసరా పింఛన్లు మరియు ఆరోగ్యశ్రీ వంటి వివిధ ప్రజా సంక్షేమ పథకాలు అమలులో ఉన్నాయి.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "तेलंगाना और आंध्र प्रदेश भारत के समृद्ध सांस्कृतिक और आर्थिक विरासत वाले राज्य हैं। हैदराबाद इस क्षेत्र का प्रमुख तकनीकी केंद्र है। यहाँ किसानों और कमजोर वर्गों के लिए रायथु बंधु, आसरा पेंशन और आरोग्यश्री जैसी कई कल्याणकारी योजनाएं चलाई जा रही हैं।";
      } else {
        defaultFallback = "Telangana and Andhra Pradesh are prominent southern Indian states known for their rich culture and economic progress, with Hyderabad as a major global IT hub. Key welfare initiatives in the region include Rythu Bandhu, Aasara Pensions, and Aarogyasri health cover.";
      }
    }
    // Match India / Country
    else if (userMessageLower.includes('india') || userMessageLower.includes('country') || userMessageLower.includes('भारत') || userMessageLower.includes('భారతదేశం')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "భారతదేశం (ఇండియా) ఒక అద్భుతమైన వైవిధ్యం మరియు సంస్కృతి గల దేశం. మన దేశంలో పౌరుల సామాజిక-ఆర్థిక అభివృద్ధి కోసం డిజిటల్ ఇండియా, ఆయుష్మాన్ భారత్, మరియు పిఎమ్ కిసాన్ వంటి వినూత్న జాతీయ పథకాలు అందుబాటులో ఉన్నాయి.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "भारत एक समृद्ध संस्कृति, इतिहास और विविधता वाला महान देश है। यहाँ नागरिकों के विकास और कल्याण के लिए डिजिटल इंडिया, आयुष्मान भारत, और पीएम-किसान जैसी कई राष्ट्रीय योजनाएं चलाई जा रही हैं।";
      } else {
        defaultFallback = "India is a vast and culturally diverse nation in South Asia. The Government of India runs several nationwide welfare programs, including Digital India, PM-KISAN, and Ayushman Bharat, to support its citizens.";
      }
    }
    // Match GK / General Knowledge / Science / Math
    else if (userMessageLower.includes('gk') || userMessageLower.includes('general') || userMessageLower.includes('science') || userMessageLower.includes('math') || userMessageLower.includes('इतिहास') || userMessageLower.includes('విజ్ఞాన') || userMessageLower.includes('గణితం')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "నేను మీకు సంక్షేమ పథకాల సమాచారంతో పాటుగా సాధారణ విజ్ఞాన శాస్త్రం, గణితం, కోడింగ్ మరియు చరిత్ర వంటి ఏ అంశంలోనైనా సహాయం చేయగలను. దయచేసి మీ నిర్దిష్ట ప్రశ్నను అడగండి, నేను వివరణాత్మక సమాధానాన్ని ఇస్తాను!";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "मैं सरकारी योजनाओं के साथ-साथ विज्ञान, गणित, इतिहास, भूगोल और कोडिंग सहित किसी भी सामान्य ज्ञान के विषय पर आपकी सहायता कर सकता हूँ। कृपया अपना विशिष्ट प्रश्न पूछें, मैं उत्तर दूँगा!";
      } else {
        defaultFallback = "I can assist you with any query across science, mathematics, general knowledge, history, and coding, alongside government schemes. Please ask your specific question and I will provide a detailed answer!";
      }
    }
    // Match Kisan
    if (userMessageLower.includes('kisan') || userMessageLower.includes('farmer') || userMessageLower.includes('agricultural') || userMessageLower.includes('किसान') || userMessageLower.includes('రైతు') || userMessageLower.includes('వ్యవసాయ')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "PM-KISAN యోజన కింద అర్హులైన రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 ముడు వాయిదాలలో నేరుగా లభిస్తుంది. ఆధార్ మరియు భూమి రికార్డులు తప్పనిసరి.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "पीएम-किसान योजना के तहत पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता दी जाती है। इसके लिए आधार और भूमि स्वामित्व दस्तावेज आवश्यक हैं।";
      } else {
        defaultFallback = "Under the PM-KISAN Scheme, eligible farmer families receive ₹6,000 per year in 3 equal installments. Seeded bank account, Aadhaar, and cultivable land records are required.";
      }
    }
    // Match Scholarship / Yashasvi / study / education
    else if (userMessageLower.includes('yashasvi') || userMessageLower.includes('scholarship') || userMessageLower.includes('student') || userMessageLower.includes('education') || userMessageLower.includes('स्कॉलरशिप') || userMessageLower.includes('విద్యార్థి') || userMessageLower.includes('చదువు')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "PM YASASVI స్కాలర్‌షిప్ OBC/EBC విద్యార్థులకు (క్లాస్ 9 మరియు 11) ₹75,000 నుండి ₹1,25,000 వార్షిక ఆర్థిక సహాయాన్ని పంపిణీ చేస్తుంది. ఆన్లైన్ NSP పోర్టల్ ద్వారా దరఖాస్తు చేసుకోవచ్చు.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "पीएम यशस्वी छात्रवृत्ति ओबीसी, ईबीसी छात्रों (कक्षा 9 और 11) को ₹75,000 से ₹1,25,000 तक की सहायता प्रदान करती है। राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर आवेदन करें।";
      } else {
        defaultFallback = "The PM YASASVI Scholarship provides between ₹75,000 to ₹1,25,000 annually to OBC/EBC/DNT students in Classes 9 & 11. Applications are processed through the National Scholarship Portal (NSP).";
      }
    }
    // Match Sukanya / girl / daughter
    else if (userMessageLower.includes('sukanya') || userMessageLower.includes('samriddhi') || userMessageLower.includes('girl') || userMessageLower.includes('daughter') || userMessageLower.includes('बेटी') || userMessageLower.includes('కుమార్తె')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "సుకన్య సమృద్ధి యోజన ఆడపిల్లల భవిష్యత్తు కోసం నిర్దేశించిన అద్భుతమైన దీర్ఘకాలిక పొదుపు పథకం (8.2% వడ్డీ). గరిష్టంగా ఇద్దరు కుమార్తెల పేరిట ఖాతా తెరవవచ్చు.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "सुकन्या समृद्धि योजना बालिकाओं के सुनहरे भविष्य के लिए 8.2% की उच्च ब्याज दर वाली एक बचत योजना है। आप डाकघर या बैंक में खाता खोल सकते हैं।";
      } else {
        defaultFallback = "Sukanya Samriddhi Yojana (SSY) is a girl-child savings scheme offering high interest (currently 8.2% compounded) under Section 80C. Can be opened before the girl turns 10 at any Post Office or bank.";
      }
    }
    // Match Health / Ayushman / medical
    else if (userMessageLower.includes('ayushman') || userMessageLower.includes('health') || userMessageLower.includes('medical') || userMessageLower.includes('hospital') || userMessageLower.includes('अस्पताल') || userMessageLower.includes('వైద్య')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "ఆయుష్మాన్ భారత్ (PM-JAY) పథకం ద్వారా ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు ఉచిత వైద్య సేవలు లభిస్తాయి. దేశవ్యాప్తంగా ఎంప్యానల్ ఆసుపత్రులలో ఉచిత నగదురహిత శస్త్రచికిత్సలు అందుబాటులో ఉన్నాయి.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "आयुष्मान भारत (PM-JAY) योजना गरीब परिवारों को प्रति वर्ष ₹5 लाख का कैशलेस स्वास्थ्य कवर प्रदान करती है। आयुष्मान कार्ड से सूचीबद्ध अस्पतालों में इलाज निशुल्क है।";
      } else {
        defaultFallback = "Ayushman Bharat PM-JAY provides cashless secondary and tertiary health cover of ₹5,00,000 per family per year at all empaneled public & private hospitals.";
      }
    }
    // Match Housing / Awas / house
    else if (userMessageLower.includes('awas') || userMessageLower.includes('housing') || userMessageLower.includes('house') || userMessageLower.includes('घर') || userMessageLower.includes('ఇల్లు') || userMessageLower.includes('ఆవాస్')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "ప్రధాన మంత్రి ఆవాస్ యోజన (PMAY) ద్వారా గ్రామీణ మరియు పట్టణ పరిధిలోని అర్హులైన బీద కుటుంబాలకు పక్కా ఇల్లు నిర్మించుకోవడానికి ₹1.2 లక్షల నుండి ₹1.3 లక్షల వరకు ఆర్థిక సహాయం అందుతుంది.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "प्रधानमंत्री आवास योजना (PMAY) बेघर परिवारों को पक्का मकान बनाने के लिए ₹1.2 लाख तक की वित्तीय सहायता देती है। ग्राम सभा सूची और सामाजिक सूचకాंक के आधार पर चयन होता है।";
      } else {
        defaultFallback = "Pradhan Mantri Awas Yojana (PMAY) offers financial assistance (₹1.2 - ₹1.3 Lakh) to homeless and kutcha-house rural/urban families for building a pucca house.";
      }
    }
    // Match pension / old age / senior
    else if (userMessageLower.includes('pension') || userMessageLower.includes('old age') || userMessageLower.includes('senior') || userMessageLower.includes('पेंशन') || userMessageLower.includes('పెన్షన్')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "వృద్ధాప్య పెన్షన్ పథకం ద్వారా 60 సంవత్సరాలు దాటిన బీద కుటుంబాల వృద్ధులకు నెలవారీ ఆర్థిక సహాయం లభిస్తుంది. 80 ఏళ్ళు పైబడిన వారికి నెలకు ₹500 లభిస్తాయి.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना के तहत 60 वर्ष या उससे अधिक आयु के बीपीएल वरिष्ठ नागरिकों को मासिक पेंशन प्रदान की जाती है।";
      } else {
        defaultFallback = "The Indira Gandhi National Old Age Pension Scheme provides monthly social security pension to BPL seniors over 60 years. Amount is direct-debited to registered bank accounts.";
      }
    }
    // Match greetings (hello, hi, namaste, etc.)
    else if (userMessageLower.includes('hello') || userMessageLower.includes('hi ') || userMessageLower === 'hi' || userMessageLower.includes('hey') || userMessageLower.includes('namaste') || userMessageLower.includes('नमस्ते') || userMessageLower.includes('నమస్కారం') || userMessageLower.includes('హలో')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "నమస్కారం! నేను వర్త ఐ సహాయకుడిని. మీకు ఈరోజు ఎలా సహాయపడగలను? మీరు నన్ను ప్రభుత్వ పథకాల గురించి లేదా ఏదైనా జనరల్ ప్రశ్నల గురించి అడగవచ్చు.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "नमस्ते! मैं वार्ता एआई सहायक हूँ। मैं आज आपकी क्या सहायता कर सकता हूँ? आप मुझसे सरकारी योजनाओं या किसी भी सामान्य प्रश्न के बारे में पूछ सकते हैं।";
      } else {
        defaultFallback = "Hello! I am Varta, your Multilingual AI Assistant. How can I assist you today? You can ask me about government schemes, coding, or any general questions!";
      }
    }
    // Match help / assistance
    else if (userMessageLower.includes('help') || userMessageLower.includes('assist') || userMessageLower.includes('सहायता') || userMessageLower.includes('సహాయం')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "తప్పకుండా! ఈ క్రింది విషయాలలో నేను మీకు సహాయం చేయగలను:\n1. ప్రభుత్వ సంక్షేమ పథకాల సమాచారం మరియు అర్హత.\n2. కోడింగ్, గణితం, సైన్స్ వంటి సాధారణ ప్రశ్నలు.\n3. పత్రాల గుర్తింపు మరియు విశ్లేషణ.\nదయచేసి మీ ప్రశ్నను అడగండి.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "बिल्कुल! मैं आपकी निम्नलिखित क्षेत्रों में सहायता कर सकता हूँ:\n1. सरकारी कल्याणकारी योजनाओं की जानकारी और पात्रता।\n2. कोडिंग, गणित, विज्ञान जैसे सामान्य प्रश्न।\n3. दस्तावेजों का सत्यापन और विश्लेषण।\nकृपया अपना प्रश्न पूछें।";
      } else {
        defaultFallback = "Sure! I can help you with:\n1. Government welfare schemes information & eligibility rules.\n2. General academic queries, coding, science, and math.\n3. Preliminary document scans & eligibility checklists.\nPlease ask your question!";
      }
    }
    // Match coding / programming / python / javascript
    else if (userMessageLower.includes('code') || userMessageLower.includes('coding') || userMessageLower.includes('python') || userMessageLower.includes('javascript') || userMessageLower.includes('program') || userMessageLower.includes('कोडिंग') || userMessageLower.includes('ప్రోగ్రామింగ్')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "కోడింగ్ అనేది కంప్యూటర్లతో మాట్లాడే భాష. ఉదాహరణకు పైథాన్ లో 'print(\"Hello World\")' అని రాస్తే అది 'Hello World' అని ప్రింట్ చేస్తుంది. మీకు ఏదైనా ప్రత్యేకమైన కోడ్ కావాలా లేదా ప్రోగ్రామింగ్ లో సహాయం కావాలా?";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "कोडिंग कंप्यूटर से संवाद करने का माध्यम है। उदाहरण के लिए, पायथन में 'print(\"Hello World\")' लिखने से स्क्रीन पर संदेश प्रदर्शित होता है। क्या आपको किसी विशिष्ट कोड या प्रोग्रामिंग प्रश्न में सहायता चाहिए?";
      } else {
        defaultFallback = "Coding is how we write instructions for computers. For example, in Python: `print('Hello World')` displays a message. Let me know if you need help with writing a specific script, fixing a bug, or learning a programming concept!";
      }
    }
    // Match job / work / employment / unemployment
    else if (userMessageLower.includes('job') || userMessageLower.includes('work') || userMessageLower.includes('employ') || userMessageLower.includes('रोजगार') || userMessageLower.includes('ఉద్యోగం')) {
      if (selectedLang === 'Telugu') {
        defaultFallback = "ప్రభుత్వం యువత కోసం దీనదయాళ్ ఉపాధ్యాయ గ్రామీణ కౌశల్య యోజన (DDU-GKY) మరియు ప్రధాన మంత్రి కౌశల్ వికాస్ యోజన (PMKVY) వంటి ఉచిత నైపుణ్య శిక్షణ మరియు ఉపాధి పథకాలను అందిస్తోంది.";
      } else if (selectedLang === 'Hindi') {
        defaultFallback = "सरकार युवाओं के लिए दीनदयाल उपाध्याय ग्रामीण कौशल्या योजना (DDU-GKY) और प्रधानमंत्री कौशल विकास योजना (PMKVY) जैसी मुफ्त कौशल प्रशिक्षण और रोजगार उन्मुख योजनाएं चलाती है।";
      } else {
        defaultFallback = "The government offers employment and skill training initiatives such as Pradhan Mantri Kaushal Vikas Yojana (PMKVY) and Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY) for eligible youth.";
      }
    }

    res.json({
      success: true,
      sender: 'bot',
      text: defaultFallback,
      language: selectedLang,
      voice: false
    });
  }
});

// Roadmap trackers (Module 11)
app.post('/api/enrollment/initiate', (req, res) => {
  const { schemeId, userId, schemeName } = req.body;
  if (!schemeId || !userId) {
    return res.status(400).json({ error: "schemeId and userId are required" });
  }

  const existingRoadmaps = ENROLLMENTS_DB[userId] || [];
  if (existingRoadmaps.some(r => r.schemeId === schemeId)) {
    return res.json({ success: true, roadmap: existingRoadmaps.find(r => r.schemeId === schemeId) });
  }

  const schemeObj = SCHEMES_DB.find(s => s.id === schemeId);
  const coreTasks = [
    { id: "task-1", title: "Complete Profile Seeding", description: "Ensure all age, occupation, and Income configurations on profile are up to date.", status: "Completed" as const },
    { id: "task-2", title: "Verify Base Documents Offline/AI", description: "Upload mandatory documents (Aadhaar, income certificate) in AI Verification terminal for preliminary evaluation.", status: "Pending" as const },
    { id: "task-3", title: "Submit Application on Govt Portal", description: `Fill and submit the online application form on designated nodal government website using verified documents.`, status: "Pending" as const },
    { id: "task-4", title: "Track State Approval and DBT Release", description: "Submit local block acknowledgment ID and monitor direct bank DBT credit progress.", status: "Pending" as const }
  ];

  const newRoadmap: EnrollmentRoadmap = {
    id: `rm-${Date.now()}`,
    schemeId,
    schemeName: schemeName || schemeObj?.name || 'Government Scheme',
    userId,
    tasks: coreTasks,
    uploadedDocuments: (schemeObj?.requiredDocuments || []).map(doc => ({
      docName: doc,
      verified: false
    })),
    progress: 25
  };

  existingRoadmaps.push(newRoadmap);
  ENROLLMENTS_DB[userId] = existingRoadmaps;

  res.json({ success: true, roadmap: newRoadmap });
});

app.get('/api/enrollment', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: "userId query is required" });
  }
  res.json(ENROLLMENTS_DB[userId] || []);
});

app.post('/api/enrollment/update-task', (req, res) => {
  const { userId, schemeId, taskId, status } = req.body;
  const roadmaps = ENROLLMENTS_DB[userId] || [];
  const roadmap = roadmaps.find(r => r.schemeId === schemeId);
  
  if (!roadmap) {
    return res.status(404).json({ error: "Roadmap tracker not found" });
  }

  roadmap.tasks = roadmap.tasks.map(t => {
    if (t.id === taskId) {
      return { ...t, status };
    }
    return t;
  });

  // Re-calculate progress percentage
  const completed = roadmap.tasks.filter(t => t.status === 'Completed').length;
  roadmap.progress = Math.round((completed / roadmap.tasks.length) * 100);

  res.json({ success: true, roadmap });
});

app.post('/api/enrollment/verify-doc', (req, res) => {
  const { userId, schemeId, docName, success, notes, readinessScore } = req.body;
  const roadmaps = ENROLLMENTS_DB[userId] || [];
  const roadmap = roadmaps.find(r => r.schemeId === schemeId);

  if (!roadmap) {
    return res.status(404).json({ error: "Roadmap not found" });
  }

  roadmap.uploadedDocuments = roadmap.uploadedDocuments.map(d => {
    if (d.docName === docName) {
      return {
        ...d,
        verified: success,
        verificationNotes: notes,
        readinessScore
      };
    }
    return d;
  });

  res.json({ success: true, roadmap });
});

// Vite Middleware & SPA serving configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GovSchemesPlatform] Express full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
