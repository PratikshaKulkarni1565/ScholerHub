const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb://localhost:27017/scholarhub";

const educationLevels = ["UG", "PG", "Diploma", "School"];
const fields = ["Engineering", "Medical", "Arts", "Science", "Commerce", "Law", "Management", "Agriculture", "Pharmacy", "Architecture", "All"];
const states = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const nationalScholarships = [
  { title: "National Merit Scholarship", provider: "Ministry of Education", category: "Government" },
  { title: "Post Matric Scholarship for SC Students", provider: "Ministry of Social Justice", category: "Government" },
  { title: "Pre Matric Scholarship for SC Students", provider: "Ministry of Social Justice", category: "Government" },
  { title: "Post Matric Scholarship for OBC Students", provider: "Ministry of Social Justice", category: "Government" },
  { title: "Merit Cum Means Scholarship for Minorities", provider: "Ministry of Minority Affairs", category: "Government" },
  { title: "Pre Matric Scholarship for Minorities", provider: "Ministry of Minority Affairs", category: "Government" },
  { title: "Post Matric Scholarship for Minorities", provider: "Ministry of Minority Affairs", category: "Government" },
  { title: "National Scholarship for ST Students", provider: "Ministry of Tribal Affairs", category: "Government" },
  { title: "AICTE Pragati Scholarship for Girls", provider: "AICTE", category: "Government" },
  { title: "AICTE Saksham Scholarship for Disabled", provider: "AICTE", category: "Government" },
  { title: "Central Sector Scholarship Scheme", provider: "Ministry of Education", category: "Government" },
  { title: "Ishan Uday Scholarship for NE Region", provider: "UGC", category: "Government" },
  { title: "PG Scholarship for University Rank Holders", provider: "UGC", category: "Government" },
  { title: "PG Indira Gandhi Scholarship for Single Girl Child", provider: "UGC", category: "Government" },
  { title: "Maulana Azad National Fellowship", provider: "Ministry of Minority Affairs", category: "Government" },
  { title: "National Overseas Scholarship", provider: "Ministry of Social Justice", category: "Government" },
  { title: "Rajiv Gandhi National Fellowship", provider: "UGC", category: "Government" },
  { title: "Dr. Ambedkar Post Matric Scholarship", provider: "Ministry of Social Justice", category: "Government" },
  { title: "Begum Hazrat Mahal National Scholarship", provider: "Maulana Azad Education Foundation", category: "Government" },
  { title: "INSPIRE Scholarship for Higher Education", provider: "DST", category: "Government" },
  { title: "KVPY Fellowship", provider: "DST", category: "Government" },
  { title: "NTSE Scholarship", provider: "NCERT", category: "Government" },
  { title: "Prime Minister's Scholarship Scheme", provider: "Ministry of Home Affairs", category: "Government" },
  { title: "PM Yasasvi Scholarship", provider: "Ministry of Social Justice", category: "Government" },
  { title: "Swami Vivekananda Merit Cum Means Scholarship", provider: "West Bengal Government", category: "State Government" },
];

const privateScholarships = [
  { title: "Tata Scholarship", provider: "Tata Trusts", category: "Private" },
  { title: "Reliance Foundation Scholarship", provider: "Reliance Foundation", category: "Private" },
  { title: "Infosys Foundation Scholarship", provider: "Infosys Foundation", category: "Private" },
  { title: "Wipro Cares Scholarship", provider: "Wipro Foundation", category: "Private" },
  { title: "Mahindra All India Talent Scholarship", provider: "Mahindra Group", category: "Private" },
  { title: "Aditya Birla Scholarship", provider: "Aditya Birla Group", category: "Private" },
  { title: "HDFC Educational Crisis Scholarship", provider: "HDFC Bank", category: "Private" },
  { title: "Kotak Kanya Scholarship", provider: "Kotak Mahindra Bank", category: "Private" },
  { title: "Axis Bank Foundation Scholarship", provider: "Axis Bank Foundation", category: "Private" },
  { title: "ICICI Foundation Scholarship", provider: "ICICI Foundation", category: "Private" },
  { title: "Bajaj Scholarship", provider: "Bajaj Group", category: "Private" },
  { title: "L&T Build India Scholarship", provider: "L&T Construction", category: "Private" },
  { title: "Hero MotoCorp Scholarship", provider: "Hero MotoCorp", category: "Private" },
  { title: "Maruti Suzuki Scholarship", provider: "Maruti Suzuki India", category: "Private" },
  { title: "Godrej Scholarship", provider: "Godrej Group", category: "Private" },
  { title: "Oberoi Group Scholarship", provider: "Oberoi Group", category: "Private" },
  { title: "Cipla Foundation Scholarship", provider: "Cipla Foundation", category: "Private" },
  { title: "Sun Pharma Scholarship", provider: "Sun Pharmaceutical", category: "Private" },
  { title: "Dr. Reddy's Foundation Scholarship", provider: "Dr. Reddy's Foundation", category: "Private" },
  { title: "Biocon Foundation Scholarship", provider: "Biocon Foundation", category: "Private" },
  { title: "Azim Premji Foundation Scholarship", provider: "Azim Premji Foundation", category: "Private" },
  { title: "Narayana Murthy Scholarship", provider: "EGL Foundation", category: "Private" },
  { title: "Shiv Nadar Foundation Scholarship", provider: "Shiv Nadar Foundation", category: "Private" },
  { title: "Nandan Nilekani Scholarship", provider: "EkStep Foundation", category: "Private" },
  { title: "Ratan Tata Scholarship", provider: "Tata Education Trust", category: "Private" },
  { title: "Edelweiss Scholarship", provider: "Edelweiss Group", category: "Private" },
  { title: "Jindal Scholarship", provider: "JSW Foundation", category: "Private" },
  { title: "Vedanta Scholarship", provider: "Vedanta Foundation", category: "Private" },
  { title: "Adani Foundation Scholarship", provider: "Adani Foundation", category: "Private" },
  { title: "Ambuja Cement Foundation Scholarship", provider: "Ambuja Cement Foundation", category: "Private" },
  { title: "Bosch India Scholarship", provider: "Bosch India", category: "Private" },
  { title: "Siemens Scholarship", provider: "Siemens India", category: "Private" },
  { title: "ABB India Scholarship", provider: "ABB India", category: "Private" },
  { title: "3M India Scholarship", provider: "3M India", category: "Private" },
  { title: "Google India Scholarship", provider: "Google India", category: "Private" },
  { title: "Microsoft India Scholarship", provider: "Microsoft India", category: "Private" },
  { title: "Adobe India Scholarship", provider: "Adobe India", category: "Private" },
  { title: "Qualcomm India Scholarship", provider: "Qualcomm India", category: "Private" },
  { title: "Intel India Scholarship", provider: "Intel India", category: "Private" },
  { title: "IBM India Scholarship", provider: "IBM India", category: "Private" },
  { title: "Oracle India Scholarship", provider: "Oracle India", category: "Private" },
  { title: "SAP India Scholarship", provider: "SAP India", category: "Private" },
  { title: "Accenture India Scholarship", provider: "Accenture India", category: "Private" },
  { title: "Cognizant Foundation Scholarship", provider: "Cognizant Foundation", category: "Private" },
  { title: "HCL Foundation Scholarship", provider: "HCL Foundation", category: "Private" },
  { title: "Tech Mahindra Foundation Scholarship", provider: "Tech Mahindra Foundation", category: "Private" },
  { title: "Mphasis F1 Foundation Scholarship", provider: "Mphasis F1 Foundation", category: "Private" },
  { title: "Persistent Foundation Scholarship", provider: "Persistent Foundation", category: "Private" },
  { title: "Zensar Foundation Scholarship", provider: "Zensar Foundation", category: "Private" },
  { title: "Hexaware Foundation Scholarship", provider: "Hexaware Foundation", category: "Private" },
];

const allTemplates = [...nationalScholarships, ...privateScholarships];

const govtHowToApply = [
  "Visit the National Scholarship Portal at scholarships.gov.in",
  "Register using your Aadhaar number and mobile number",
  "Login and select the applicable scholarship scheme",
  "Fill in the application form with personal, academic, and bank details",
  "Upload required documents: marksheet, income certificate, caste certificate, bank passbook",
  "Submit the application and note down the application reference number",
  "Application will be verified by your institution and district authority",
  "Track application status on the NSP portal using your reference number"
];

const privateHowToApply = [
  "Visit the official website of the scholarship provider",
  "Click on 'Scholarships' or 'CSR Initiatives' section",
  "Read the eligibility criteria carefully before applying",
  "Register with your email ID and create a profile",
  "Fill in the online application form with academic and personal details",
  "Upload required documents: marksheet, income proof, ID proof, photograph",
  "Write and submit the required essay or statement of purpose if asked",
  "Submit the application before the deadline",
  "Shortlisted candidates will be contacted for interview or further rounds"
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(arr, min = 1, max = 3) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate() {
  const start = new Date();
  const end = new Date(2026, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAmount() {
  const amounts = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000, 125000, 150000];
  return `₹${randomItem(amounts).toLocaleString("en-IN")}`;
}

function randomPercentage() {
  return Math.floor(Math.random() * 30) + 50; // 50–80%
}

function randomIncome() {
  const limits = [100000, 150000, 200000, 250000, 300000, 500000, 800000];
  return randomItem(limits);
}

const descriptions = [
  "financial assistance to meritorious students from economically weaker sections",
  "support to students pursuing higher education in India",
  "encouragement to talented students to continue their studies",
  "aid to students belonging to reserved categories",
  "assistance to girl students to promote women education",
  "support to students with disabilities pursuing professional courses",
  "help to students from minority communities to access quality education",
  "recognition and reward for academic excellence",
  "financial support to students from rural and semi-urban areas",
  "assistance to first-generation learners in higher education",
];

const scholarships = [];

for (let i = 0; i < 500; i++) {
  const template = allTemplates[i % allTemplates.length];
  const eduLevels = randomItems(educationLevels, 1, 2);
  const studyFields = randomItems(fields, 1, 3);
  const stateList = Math.random() > 0.4 ? ["All India"] : randomItems(states, 1, 3);

  scholarships.push({
    title: `${template.title} ${i + 1}`,
    description: `${template.provider} provides ${randomItem(descriptions)}.`,
    eligibility: {
      educationLevel: eduLevels,
      fieldOfStudy: studyFields,
      states: stateList,
      minPercentage: randomPercentage(),
      incomeLimit: randomIncome(),
    },
    amount: randomAmount(),
    benefits: `Covers tuition fees and provides monthly stipend. Renewable annually based on performance.`,
    deadline: randomDate(),
    category: template.category,
    location: "India",
    provider: template.provider,
    link: template.category === "Government" ? "https://scholarships.gov.in/" : `https://www.${template.provider.toLowerCase().replace(/\s+/g, "")}.com/scholarships`,
    featured: Math.random() > 0.85,
    howToApply: template.category === "Government" ? govtHowToApply : privateHowToApply,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("scholarhub");
    const collection = db.collection("scholarships");

    const result = await collection.insertMany(scholarships);
    console.log(`✅ Inserted ${result.insertedCount} scholarships into the database`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

seed();
