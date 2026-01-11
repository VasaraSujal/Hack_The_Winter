/**
 * Update Blood Bank Location - 50km from Hospital
 * 
 * Sets blood bank coordinates approximately 50km from the hospital
 * Hospital: Ahmedabad [72.5714, 23.0225]
 * Blood Bank: ~50km away
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

async function updateBloodBankTo50km() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    const collection = db.collection('organizations');
    
    // Your Blood Bank ID
    const bloodBankId = '69621ea01d3596ee7f2f3dc3';
    
    // Hospital coordinates (Ahmedabad)
    const hospitalCoords = [72.5714, 23.0225];
    
    // Calculate coordinates approximately 50km away
    // 1 degree latitude ≈ 111 km
    // 1 degree longitude ≈ 111 km * cos(latitude)
    // For 50km: ~0.45 degrees
    
    // Set blood bank 50km south-west of hospital
    const bloodBankCoords = [
      hospitalCoords[0] - 0.35,  // ~39 km west
      hospitalCoords[1] - 0.30   // ~33 km south
    ];
    // This gives approximately 50km distance
    
    console.log('📍 Updating Blood Bank Location...\n');
    console.log('Hospital (Ahmedabad):', hospitalCoords);
    console.log('Blood Bank (New Location):', bloodBankCoords);
    console.log('Expected Distance: ~50 km\n');
    
    const result = await collection.updateOne(
      { 
        _id: new ObjectId(bloodBankId),
        type: 'bloodbank'
      },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: bloodBankCoords
          },
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
      
      // Calculate rough distance
      const [bLng, bLat] = bloodBankCoords;
      const [hLng, hLat] = hospitalCoords;
      const roughDistance = Math.sqrt(
        Math.pow((bLng - hLng) * 111 * Math.cos(hLat * Math.PI / 180), 2) + 
        Math.pow((bLat - hLat) * 111, 2)
      );
      
      console.log('\n📏 Distance Verification:');
      console.log('- Approximate Distance:', Math.round(roughDistance), 'km');
      console.log('- Expected Category: FAR 🟠 (30-50 km)');
    } else {
      console.log('⚠️  No changes made.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the update
updateBloodBankTo50km();
