require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Alert = require('../models/Alert');
const Zone = require('../models/Zone');
const Species = require('../models/Species');
const Insight = require('../models/Insight');

const FOREST = 'Anamalai Tiger Reserve';
const OFFICE = 'Pollachi Forest Division';
const DISTRICT = 'Coimbatore';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas (Standard Mode) for seeding');
  } catch (err) {
    console.error('❌ MongoDB connection failed during seed:');
    console.error('   Error Name:', err.name);
    console.error('   Error Message:', err.message);
    console.error('\n   ⚠️ Check your IP whitelist in Atlas (Network Access).');
    process.exit(1);
  }

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Alert.deleteMany({}),
    Zone.deleteMany({}),
    Species.deleteMany({}),
    Insight.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Users
  const hashedPassword = await bcrypt.hash('forest123', 10);
  await User.create([
    {
      district: DISTRICT,
      forest: FOREST,
      officeName: OFFICE,
      password: hashedPassword,
      role: 'officer',
    },
    {
      district: 'Nilgiris',
      forest: 'Mudumalai Tiger Reserve',
      officeName: 'Gudalur Forest Division',
      password: await bcrypt.hash('forest456', 10),
      role: 'officer',
    },
  ]);
  console.log('👤 Users seeded');

  // Alerts
  const alertTypes = ['human_intrusion', 'vehicle', 'chainsaw', 'gunshot', 'fire', 'landslide'];
  const severities = ['High', 'Medium', 'Low'];
  const statuses = ['Active', 'Resolved', 'Investigating'];
  const locations = [
    'Northern Sector - Zone A', 'Western Ridge - Zone B', 'Eastern Perimeter - Zone C',
    'Southern Buffer - Zone D', 'Core Zone - Alpha', 'Tribal Buffer Zone',
  ];

  const alertDocs = alertTypes.flatMap(type =>
    Array.from({ length: 5 }, (_, i) => ({
      type,
      severity: severities[i % 3],
      location: locations[i % locations.length],
      coordinates: { lat: 10.35 + Math.random() * 0.5, lng: 76.95 + Math.random() * 0.5 },
      description: `Detected ${type.replace('_', ' ')} activity in ${locations[i % locations.length]}`,
      status: statuses[i % 3],
      forest: FOREST,
      officeName: OFFICE,
      createdAt: new Date(Date.now() - i * 3600000 * 24),
    }))
  );
  await Alert.create(alertDocs);
  console.log('🚨 Alerts seeded');

  // Zones
  const zoneDocs = [
    {
      name: 'Core Protected Zone Alpha',
      type: 'Restricted',
      riskLevel: 'High',
      area: '450 sq km',
      coordinates: { lat: 10.52, lng: 77.1 },
      activityLogs: [
        { event: 'Repeated Entry', time: new Date(Date.now() - 86400000), details: 'Unknown person detected at northern boundary' },
        { event: 'Loitering', time: new Date(Date.now() - 172800000), details: 'Vehicle parked for 3+ hours near waterbody' },
        { event: 'Night Movement', time: new Date(Date.now() - 259200000), details: 'Thermal sensor triggered at 02:30 AM' },
      ],
      forest: FOREST,
      officeName: OFFICE,
    },
    {
      name: 'Northern Buffer Zone',
      type: 'Buffer',
      riskLevel: 'Medium',
      area: '180 sq km',
      coordinates: { lat: 10.61, lng: 77.05 },
      activityLogs: [
        { event: 'Cattle Grazing', time: new Date(Date.now() - 43200000), details: 'Livestock detected inside buffer boundary' },
        { event: 'Repeated Entry', time: new Date(Date.now() - 108000000), details: 'Same individual spotted 3 times this week' },
      ],
      forest: FOREST,
      officeName: OFFICE,
    },
    {
      name: 'Eastern River Corridor',
      type: 'Restricted',
      riskLevel: 'High',
      area: '95 sq km',
      coordinates: { lat: 10.44, lng: 77.22 },
      activityLogs: [
        { event: 'Chainsaw Sound', time: new Date(Date.now() - 21600000), details: 'Acoustic sensor detected chainsaw near teak grove' },
      ],
      forest: FOREST,
      officeName: OFFICE,
    },
    {
      name: 'Southern Safe Zone',
      type: 'Safe',
      riskLevel: 'Low',
      area: '220 sq km',
      coordinates: { lat: 10.31, lng: 77.0 },
      activityLogs: [
        { event: 'Routine Patrol', time: new Date(Date.now() - 7200000), details: 'Regular patrol completed, no anomalies' },
      ],
      forest: FOREST,
      officeName: OFFICE,
    },
    {
      name: 'Western Tribal Buffer',
      type: 'Buffer',
      riskLevel: 'Medium',
      area: '140 sq km',
      coordinates: { lat: 10.49, lng: 76.88 },
      activityLogs: [
        { event: 'Fire Smoke Detected', time: new Date(Date.now() - 54000000), details: 'Possible agricultural burning detected' },
      ],
      forest: FOREST,
      officeName: OFFICE,
    },
    {
      name: 'Waterbody Zone Gamma',
      type: 'Safe',
      riskLevel: 'Low',
      area: '60 sq km',
      coordinates: { lat: 10.39, lng: 77.15 },
      activityLogs: [],
      forest: FOREST,
      officeName: OFFICE,
    },
  ];
  await Zone.create(zoneDocs);
  console.log('📍 Zones seeded');

  // Species
  const speciesDocs = [
    {
      name: 'Bengal Tiger',
      scientificName: 'Panthera tigris tigris',
      category: 'Mammal',
      isEndangered: true,
      conservationStatus: 'EN',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Tiger_in_Ranthambhore.jpg/320px-Tiger_in_Ranthambhore.jpg',
      location: 'Core Zone Alpha - North',
      coordinates: { lat: 10.54, lng: 77.12 },
      detectedAt: new Date(Date.now() - 3600000),
      forest: FOREST, officeName: OFFICE,
    },
    {
      name: 'Indian Elephant',
      scientificName: 'Elephas maximus indicus',
      category: 'Mammal',
      isEndangered: true,
      conservationStatus: 'EN',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Indian_Elephant_2.JPG/320px-Indian_Elephant_2.JPG',
      location: 'Eastern River Corridor',
      coordinates: { lat: 10.46, lng: 77.20 },
      detectedAt: new Date(Date.now() - 7200000),
      forest: FOREST, officeName: OFFICE,
    },
    {
      name: 'Indian Gaur',
      scientificName: 'Bos gaurus',
      category: 'Mammal',
      isEndangered: false,
      conservationStatus: 'VU',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Indian_gaur_Bos_gaurus_by_N_A_Naseer.jpg/320px-Indian_gaur_Bos_gaurus_by_N_A_Naseer.jpg',
      location: 'Northern Buffer Zone',
      coordinates: { lat: 10.59, lng: 77.07 },
      detectedAt: new Date(Date.now() - 14400000),
      forest: FOREST, officeName: OFFICE,
    },
    {
      name: 'Great Indian Hornbill',
      scientificName: 'Buceros bicornis',
      category: 'Bird',
      isEndangered: true,
      conservationStatus: 'VU',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Great_hornbill_Buceros_bicornis_by_Shantanu_Kuveskar.jpg/320px-Great_hornbill_Buceros_bicornis_by_Shantanu_Kuveskar.jpg',
      location: 'Core Zone Alpha - West',
      coordinates: { lat: 10.51, lng: 77.09 },
      detectedAt: new Date(Date.now() - 28800000),
      forest: FOREST, officeName: OFFICE,
    },
    {
      name: 'Nilgiri Tahr',
      scientificName: 'Nilgiritragus hylocrius',
      category: 'Mammal',
      isEndangered: true,
      conservationStatus: 'EN',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Nilgiri_Tahr_-_Eravikulam.jpg/320px-Nilgiri_Tahr_-_Eravikulam.jpg',
      location: 'Southern Grasslands',
      coordinates: { lat: 10.33, lng: 77.02 },
      detectedAt: new Date(Date.now() - 43200000),
      forest: FOREST, officeName: OFFICE,
    },
    {
      name: 'Leopard',
      scientificName: 'Panthera pardus',
      category: 'Mammal',
      isEndangered: false,
      conservationStatus: 'VU',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/LeCoq.jpg/320px-LeCoq.jpg',
      location: 'Western Tribal Buffer',
      coordinates: { lat: 10.50, lng: 76.91 },
      detectedAt: new Date(Date.now() - 54000000),
      forest: FOREST, officeName: OFFICE,
    },
    {
      name: 'Indian Python',
      scientificName: 'Python molurus',
      category: 'Reptile',
      isEndangered: false,
      conservationStatus: 'LC',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Indian_python_2.jpg/320px-Indian_python_2.jpg',
      location: 'Waterbody Zone Gamma',
      coordinates: { lat: 10.40, lng: 77.14 },
      detectedAt: new Date(Date.now() - 72000000),
      forest: FOREST, officeName: OFFICE,
    },
  ];
  await Species.create(speciesDocs);
  console.log('🐾 Species seeded');

  // Insights
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const insightDocs = [
    // Vegetation
    ...months.map((month, i) => ({
      category: 'vegetation',
      metric: 'Vegetation Cover Index',
      value: 60 + Math.sin(i * 0.5) * 15 + Math.random() * 5,
      unit: '%',
      trend: i > 6 ? 'decreasing' : 'increasing',
      recommendation: i > 8 ? 'Reforestation required in sectors B and D. Increase patrol in fire-prone zones.' : null,
      month,
      forest: FOREST, officeName: OFFICE,
    })),
    // Animal Movement
    ...months.map((month, i) => ({
      category: 'animal_movement',
      metric: 'Wildlife Sightings',
      value: Math.floor(20 + Math.cos(i * 0.4) * 10 + Math.random() * 8),
      unit: 'sightings',
      trend: i % 3 === 0 ? 'increasing' : 'stable',
      recommendation: i === 5 ? 'Install additional water sources in Zone C. Animal movement declining near river.' : null,
      month,
      forest: FOREST, officeName: OFFICE,
    })),
    // Water
    ...months.map((month, i) => ({
      category: 'water',
      metric: 'Water Availability Score',
      value: Math.max(20, 75 - i * 3 + Math.random() * 10),
      unit: 'score',
      trend: i > 4 ? 'decreasing' : 'stable',
      recommendation: i > 9 ? 'Create artificial water holes in core zone. Dry season affecting wildlife.' : null,
      month,
      forest: FOREST, officeName: OFFICE,
    })),
  ];
  await Insight.create(insightDocs);
  console.log('🌱 Insights seeded');

  console.log('\n✅ Seeding complete!');
  console.log(`\n🔑 Login credentials:`);
  console.log(`   District:    ${DISTRICT}`);
  console.log(`   Forest:      ${FOREST}`);
  console.log(`   Office:      ${OFFICE}`);
  console.log(`   Password:    forest123`);
  console.log(`\n🔑 Second account:`);
  console.log(`   District:    Nilgiris`);
  console.log(`   Forest:      Mudumalai Tiger Reserve`);
  console.log(`   Office:      Gudalur Forest Division`);
  console.log(`   Password:    forest456`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
