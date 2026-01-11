/**
 * Update Blood Bank Location with Proper GeoJSON Format
 * 
 * Run this script to update your blood bank's location coordinates
 * Usage: node Backend/scripts/updateBloodBankLocation.js
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

async function updateBloodBankLocation() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    const collection = db.collection('organizations');
    
    // Your Blood Bank ID
    const bloodBankId = '69621ea01d3596ee7f2f3dc3';
    
    // Surat coordinates (approximate city center)
    // You can get exact coordinates from Google Maps
    const suratCoordinates = [72.8311, 21.1702]; // [longitude, latitude]
    
    // Calculate coordinates for a location 10km away
    // For testing, we'll add ~0.09 degrees (approximately 10km)
    const nearbyCoordinates = [
      suratCoordinates[0] + 0.09, // 10km east
      suratCoordinates[1]
    ];
    
    console.log('📍 Updating Blood Bank Location...\n');
    console.log('Blood Bank ID:', bloodBankId);
    console.log('Coordinates:', nearbyCoordinates);
    console.log('Approximate location: 10km from Surat center\n');
    
    const result = await collection.updateOne(
      { 
        _id: new ObjectId(bloodBankId),
        type: 'bloodbank'
      },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: nearbyCoordinates // [longitude, latitude]
          },
          // Keep existing address fields
          'address.city': 'Surat',
          'address.state': 'Gujarat',
          'address.country': 'India',
          'address.pinCode': '363310',
          'address.street': 'abc',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Blood Bank location updated successfully!\n');
      
      // Verify the update
      const updatedBloodBank = await collection.findOne({
        _id: new ObjectId(bloodBankId)
      });
      
      console.log('Updated Blood Bank:');
      console.log('- Name:', updatedBloodBank.name);
      console.log('- Location:', updatedBloodBank.location);
      console.log('- Address:', updatedBloodBank.address);
    } else {
      console.log('❌ No changes made. Blood Bank might already have this location.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the update
updateBloodBankLocation();
