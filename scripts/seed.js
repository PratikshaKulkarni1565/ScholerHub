const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const URI = "mongodb://localhost:27017/scholarhub";
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../../scholarships.json"), "utf-8"));

async function seed() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db("scholarhub");
  const col = db.collection("scholarships");

  const docs = data.map((s) => ({
    ...s,
    deadline: new Date(s.deadline),
    createdAt: new Date(s.createdAt),
    location: "India",
    benefits: s.description,
    featured: Math.random() > 0.7,
    link: s.link || "https://scholarships.gov.in/"
  }));

  await col.deleteMany({});
  const result = await col.insertMany(docs);
  console.log(`✅ Seeded ${result.insertedCount} scholarships into MongoDB`);

  await col.createIndex({ title: "text", description: "text" });
  console.log("✅ Text index created");

  await client.close();
}

seed().catch(console.error);
