/**
 * Script to Update Hospital and Blood Bank Locations
 * 
 * यह script database में hospitals और blood banks के location coordinates update करता है
 * Run करने के लिए: node Backend/scripts/updateLocations.js
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

// Sample coordinates for major Indian cities
const sampleLocations = {
  delhi: {
    hospitals: [
      { name: 'AIIMS Delhi', coordinates: [77.2090, 28.5672] },
      { name: 'Safdarjung Hospital', coordinates: [77.1907, 28.5675] },
      { name: 'Ram Manohar Lohia Hospital', coordinates: [77.2167, 28.6358] },
    ],
    bloodBanks: [
      { name: 'Red Cross Blood Bank Delhi', coordinates: [77.2167, 28.6139] },
      { name: 'Rotary Blood Bank Delhi', coordinates: [77.2090, 28.6304] },
    ]
  },
  mumbai: {
    hospitals: [
      { name: 'KEM Hospital', coordinates: [72.8397, 19.0030] },
      { name: 'Tata Memorial Hospital', coordinates: [72.8422, 19.0076] },
    ],
    bloodBanks: [
      { name: 'Tata Memorial Blood Bank', coordinates: [72.8422, 19.0076] },
    ]
  },
  bangalore: {
    hospitals: [
      { name: 'Victoria Hospital', coordinates: [77.5833, 12.9716] },
      { name: 'Bowring Hospital', coordinates: [77.6082, 12.9716] },
    ],
    bloodBanks: [
      { name: 'Bangalore Blood Bank', coordinates: [77.5946, 12.9716] },
    ]
  }
};

async function updateHospitalLocation(hospitalId, longitude, latitude) {
  const db = getDB();
  const collection = db.collection('hospitals');
  
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(hospitalId) },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating hospital location:', error);
    return false;
  }
}

async function updateBloodBankLocation(bloodBankId, longitude, latitude) {
  const db = getDB();
  const collection = db.collection('organizations');
  
  try {
    const result = await collection.updateOne(
      { 
        _id: new ObjectId(bloodBankId),
        type: 'bloodbank'
      },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating blood bank location:', error);
    return false;
  }
}

async function updateAllLocations() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    
    // Get all hospitals
    const hospitals = await db.collection('hospitals').find({}).toArray();
    console.log(`📍 Found ${hospitals.length} hospitals\n`);
    
    // Get all blood banks
    const bloodBanks = await db.collection('organizations')
      .find({ type: 'bloodbank' })
      .toArray();
    console.log(`📍 Found ${bloodBanks.length} blood banks\n`);
    
    // Update hospitals with sample locations
    console.log('🏥 Updating Hospital Locations...\n');
    let hospitalCount = 0;
    
    for (const hospital of hospitals) {
      // You can match by name or use default coordinates
      // For demo, using Delhi coordinates as default
      const [longitude, latitude] = [77.2090, 28.5672]; // AIIMS Delhi
      
      const success = await updateHospitalLocation(
        hospital._id.toString(),
        longitude,
        latitude
      );
      
      if (success) {
        hospitalCount++;
        console.log(`  ✓ Updated: ${hospital.name} → [${longitude}, ${latitude}]`);
      }
    }
    
    console.log(`\n✅ Updated ${hospitalCount} hospitals\n`);
    
    // Update blood banks with sample locations
    console.log('🏦 Updating Blood Bank Locations...\n');
    let bloodBankCount = 0;
    
    for (const bloodBank of bloodBanks) {
      // For demo, using Red Cross Delhi coordinates as default
      const [longitude, latitude] = [77.2167, 28.6139];
      
      const success = await updateBloodBankLocation(
        bloodBank._id.toString(),
        longitude,
        latitude
      );
      
      if (success) {
        bloodBankCount++;
        console.log(`  ✓ Updated: ${bloodBank.name} → [${longitude}, ${latitude}]`);
      }
    }
    
    console.log(`\n✅ Updated ${bloodBankCount} blood banks\n`);
    
    console.log('🎉 All locations updated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Function to update specific hospital/blood bank by ID
async function updateSpecificLocation(type, id, longitude, latitude) {
  try {
    await connectDB();
    
    let success = false;
    
    if (type === 'hospital') {
      success = await updateHospitalLocation(id, longitude, latitude);
    } else if (type === 'bloodbank') {
      success = await updateBloodBankLocation(id, longitude, latitude);
    }
    
    if (success) {
      console.log(`✅ Updated ${type} location successfully`);
    } else {
      console.log(`❌ Failed to update ${type} location`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Update all locations with default coordinates
  updateAllLocations();
} else if (args.length === 4) {
  // Update specific location
  // Usage: node updateLocations.js hospital <id> <longitude> <latitude>
  const [type, id, longitude, latitude] = args;
  updateSpecificLocation(type, id, parseFloat(longitude), parseFloat(latitude));
} else {
  console.log(`
Usage:
  1. Update all locations with default coordinates:
     node updateLocations.js

  2. Update specific hospital:
     node updateLocations.js hospital <hospital_id> <longitude> <latitude>

  3. Update specific blood bank:
     node updateLocations.js bloodbank <bloodbank_id> <longitude> <latitude>

Examples:
  node updateLocations.js
  node updateLocations.js hospital 507f1f77bcf86cd799439011 77.2090 28.5672
  node updateLocations.js bloodbank 507f1f77bcf86cd799439012 77.2167 28.6139
  `);
  process.exit(1);
}
