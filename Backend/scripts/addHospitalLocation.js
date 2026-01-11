/**
 * Add Location to Hospital
 * 
 * This script adds location coordinates to the hospital that's missing them
 * Usage: node Backend/scripts/addHospitalLocation.js
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

async function addHospitalLocation() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    
    // Hospital ID from debug output
    const hospitalId = '69600a54a5ff3db220ef2ac4';
    
    console.log('🏥 Adding location to hospital...');
    console.log('Hospital ID:', hospitalId);
    
    // First, check which collection has this hospital
    let hospital = await db.collection('hospitals').findOne({
      _id: new ObjectId(hospitalId)
    });
    
    let collectionName = 'hospitals';
    
    if (!hospital) {
      console.log('Not found in "hospitals", checking "organizations"...');
      hospital = await db.collection('organizations').findOne({
        _id: new ObjectId(hospitalId),
        type: 'hospital'
      });
      collectionName = 'organizations';
    }
    
    if (!hospital) {
      console.log('❌ Hospital not found in any collection!');
      process.exit(1);
    }
    
    console.log('✅ Hospital found in:', collectionName);
    console.log('Name:', hospital.name || 'Unknown');
    console.log('Current location:', hospital.location || 'None');
    
    // Surat coordinates (city center)
    // This is approximately 10km from the blood bank location we set earlier
    const hospitalCoordinates = [72.8311, 21.1702]; // [longitude, latitude]
    
    console.log('\n📍 Setting hospital location...');
    console.log('Coordinates:', hospitalCoordinates);
    console.log('Location: Surat city center (approximately 10km from blood bank)\n');
    
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(hospitalId) },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: hospitalCoordinates
          },
          // Ensure address structure is correct
          'address.city': hospital.address?.city || hospital.city || 'Surat',
          'address.state': hospital.address?.state || hospital.state || 'Gujarat',
          'address.country': hospital.address?.country || 'India',
          'address.pinCode': hospital.address?.pinCode || hospital.pincode || '395001',
          'address.street': hospital.address?.street || hospital.address || 'City Center',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Hospital location added successfully!\n');
      
      // Verify the update
      const updatedHospital = await db.collection(collectionName).findOne({
        _id: new ObjectId(hospitalId)
      });
      
      console.log('Updated Hospital Details:');
      console.log('- Name:', updatedHospital.name);
      console.log('- Location:', updatedHospital.location);
      console.log('- Address:', updatedHospital.address);
      
      console.log('\n✅ Hospital and Blood Bank both have locations now!');
      console.log('Expected distance: ~10 km');
      console.log('Category: CLOSE 🔵');
    } else {
      console.log('⚠️  No changes made. Hospital might already have this location.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the update
addHospitalLocation();
