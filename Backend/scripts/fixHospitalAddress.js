/**
 * Fix Hospital Address Structure
 * 
 * The hospital's address field is a string "manek chowk" but needs to be an object
 * This script fixes that issue
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

async function fixHospitalAddress() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    const collection = db.collection('organizations');
    
    // Hospital ID
    const hospitalId = '69600a54a5ff3db220ef2ac4';
    
    console.log('🏥 Fixing hospital address structure...');
    console.log('Hospital ID:', hospitalId, '\n');
    
    const hospital = await collection.findOne({
      _id: new ObjectId(hospitalId),
      type: 'hospital'
    });
    
    if (!hospital) {
      console.log('❌ Hospital not found!');
      process.exit(1);
    }
    
    console.log('Current Hospital Data:');
    console.log('- Name:', hospital.name);
    console.log('- Location:', hospital.location);
    console.log('- Address (current - STRING):', hospital.address);
    console.log('- City (in location):', hospital.location?.city);
    console.log('- State (in location):', hospital.location?.state);
    
    // The address is currently a string "manek chowk"
    // We need to convert it to a proper object
    const properAddress = {
      street: typeof hospital.address === 'string' ? hospital.address : (hospital.address?.street || 'manek chowk'),
      city: hospital.location?.city || hospital.city || 'Ahmedabad',
      state: hospital.location?.state || hospital.state || 'Gujarat',
      pinCode: hospital.location?.pincode || hospital.pincode || '380001',
      country: hospital.location?.country || 'India'
    };
    
    console.log('\n📝 Converting to proper address structure:');
    console.log(JSON.stringify(properAddress, null, 2));
    
    // We need to completely replace the location object to fix the structure
    const newLocation = {
      type: 'Point',
      coordinates: hospital.location?.coordinates || [72.5714, 23.0225]
    };
    
    console.log('\n📍 New location structure (without extra fields):');
    console.log(JSON.stringify(newLocation, null, 2));
    
    // MongoDB doesn't allow $set and $unset on same path in one operation
    // So we'll do it in two steps
    
    console.log('\n🔄 Step 1: Removing old location field...');
    await collection.updateOne(
      { 
        _id: new ObjectId(hospitalId),
        type: 'hospital'
      },
      {
        $unset: {
          location: "",
          city: "",
          state: "",
          pincode: ""
        }
      }
    );
    
    console.log('✅ Old fields removed');
    
    console.log('\n🔄 Step 2: Setting new structure...');
    const result = await collection.updateOne(
      { 
        _id: new ObjectId(hospitalId),
        type: 'hospital'
      },
      {
        $set: {
          address: properAddress,
          location: newLocation,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      console.log('\n✅ Hospital address structure fixed successfully!\n');
      
      // Verify the update
      const updatedHospital = await collection.findOne({
        _id: new ObjectId(hospitalId)
      });
      
      console.log('Updated Hospital:');
      console.log('- Name:', updatedHospital.name);
      console.log('- Location:', updatedHospital.location);
      console.log('- Address:', updatedHospital.address);
      
      console.log('\n✅ Structure is now correct!');
      console.log('Hospital Schema:');
      console.log('  location: {');
      console.log('    type: "Point",');
      console.log('    coordinates: [lng, lat]');
      console.log('  }');
      console.log('  address: {');
      console.log('    street: "manek chowk",');
      console.log('    city: "Ahmedabad",');
      console.log('    state: "Gujarat",');
      console.log('    pinCode: "380001",');
      console.log('    country: "India"');
      console.log('  }');
    } else {
      console.log('\n⚠️  No changes made.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the fix
fixHospitalAddress();
