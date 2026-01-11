/**
 * Debug Hospital and Request Data
 * 
 * This script helps debug the "Hospital not found" issue
 * Usage: node Backend/scripts/debugHospitalRequest.js <requestId>
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

async function debugHospitalRequest(requestId) {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    
    // Find the request
    console.log('🔍 Finding request:', requestId);
    const request = await db.collection('hospitalBloodRequests').findOne({
      _id: new ObjectId(requestId)
    });
    
    if (!request) {
      console.log('❌ Request not found!\n');
      process.exit(1);
    }
    
    console.log('\n📋 Request Details:');
    console.log('- Request ID:', request._id);
    console.log('- Blood Group:', request.bloodGroup);
    console.log('- Units:', request.unitsRequired);
    console.log('- Status:', request.status);
    console.log('- Hospital ID:', request.hospitalId);
    console.log('- Blood Bank ID:', request.bloodBankId);
    
    // Find hospital in hospitals collection
    console.log('\n🏥 Searching for hospital in "hospitals" collection...');
    const hospitalInHospitals = await db.collection('hospitals').findOne({
      _id: new ObjectId(request.hospitalId)
    });
    
    let hospitalInOrgs = null; // Declare here so it's accessible later
    
    if (hospitalInHospitals) {
      console.log('✅ Hospital found in "hospitals" collection!');
      console.log('- Name:', hospitalInHospitals.name);
      console.log('- Location:', hospitalInHospitals.location);
      console.log('- Address:', hospitalInHospitals.address);
    } else {
      console.log('❌ Hospital NOT found in "hospitals" collection');
      
      // Try organizations collection
      console.log('\n🔍 Searching in "organizations" collection...');
      hospitalInOrgs = await db.collection('organizations').findOne({
        _id: new ObjectId(request.hospitalId),
        type: 'hospital'
      });
      
      if (hospitalInOrgs) {
        console.log('✅ Hospital found in "organizations" collection!');
        console.log('- Name:', hospitalInOrgs.name);
        console.log('- Type:', hospitalInOrgs.type);
        console.log('- Location:', hospitalInOrgs.location);
        
        console.log('\n⚠️  ISSUE FOUND:');
        console.log('Hospital is in "organizations" collection but code is looking in "hospitals" collection!');
        console.log('\n💡 SOLUTION:');
        console.log('Either:');
        console.log('1. Move hospital data to "hospitals" collection, OR');
        console.log('2. Update backend code to look in "organizations" collection');
      } else {
        console.log('❌ Hospital NOT found in "organizations" collection either');
        
        // List all collections
        console.log('\n📂 Available collections:');
        const collections = await db.listCollections().toArray();
        collections.forEach(col => console.log('  -', col.name));
      }
    }
    
    // Find blood bank
    console.log('\n🏦 Searching for blood bank...');
    const bloodBank = await db.collection('organizations').findOne({
      _id: new ObjectId(request.bloodBankId),
      type: 'bloodbank'
    });
    
    if (bloodBank) {
      console.log('✅ Blood Bank found!');
      console.log('- Name:', bloodBank.name);
      console.log('- Location:', bloodBank.location);
      console.log('- Address:', bloodBank.address);
    } else {
      console.log('❌ Blood Bank NOT found');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY:');
    console.log('='.repeat(60));
    console.log('Request:', request._id ? '✅ Found' : '❌ Not Found');
    console.log('Hospital:', hospitalInHospitals || hospitalInOrgs ? '✅ Found' : '❌ Not Found');
    console.log('Blood Bank:', bloodBank ? '✅ Found' : '❌ Not Found');
    
    // Check if both have valid location coordinates
    const hospitalLocation = (hospitalInHospitals || hospitalInOrgs)?.location;
    const bloodBankLocation = bloodBank?.location;
    
    const hospitalHasValidLocation = hospitalLocation?.type === 'Point' && 
                                     Array.isArray(hospitalLocation?.coordinates) && 
                                     hospitalLocation.coordinates.length === 2;
    
    const bloodBankHasValidLocation = bloodBankLocation?.type === 'Point' && 
                                      Array.isArray(bloodBankLocation?.coordinates) && 
                                      bloodBankLocation.coordinates.length === 2;
    
    if (hospitalHasValidLocation && bloodBankHasValidLocation) {
      console.log('\n✅ Both have valid location coordinates - Distance calculation should work!');
      console.log('\nExpected Distance Calculation:');
      console.log('- Hospital:', hospitalLocation.coordinates);
      console.log('- Blood Bank:', bloodBankLocation.coordinates);
      
      // Quick distance estimate
      const [hLng, hLat] = hospitalLocation.coordinates;
      const [bLng, bLat] = bloodBankLocation.coordinates;
      const roughDistance = Math.sqrt(Math.pow(hLng - bLng, 2) + Math.pow(hLat - bLat, 2)) * 111; // rough km
      console.log('- Approximate Distance:', Math.round(roughDistance), 'km');
    } else {
      console.log('\n⚠️  Missing or invalid location coordinates:');
      if (!hospitalHasValidLocation) console.log('  - Hospital location missing or invalid');
      if (!bloodBankHasValidLocation) console.log('  - Blood Bank location missing or invalid');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get request ID from command line
const requestId = process.argv[2];

if (!requestId) {
  console.log('Usage: node debugHospitalRequest.js <requestId>');
  console.log('Example: node debugHospitalRequest.js 6963a051aafe4cf8760d6333');
  process.exit(1);
}

debugHospitalRequest(requestId);
