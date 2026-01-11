/**
 * Verify and Fix Blood Bank Address Structure
 * 
 * Ensures blood bank has proper address structure matching the location
 * Usage: node Backend/scripts/fixBloodBankAddress.js
 */

import { connectDB, getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

async function fixBloodBankAddress() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const db = getDB();
    const collection = db.collection('organizations');
    
    // Your Blood Bank ID
    const bloodBankId = '69621ea01d3596ee7f2f3dc3';
    
    console.log('🏦 Checking Blood Bank address structure...');
    console.log('Blood Bank ID:', bloodBankId, '\n');
    
    const bloodBank = await collection.findOne({
      _id: new ObjectId(bloodBankId),
      type: 'bloodbank'
    });
    
    if (!bloodBank) {
      console.log('❌ Blood Bank not found!');
      process.exit(1);
    }
    
    console.log('Current Blood Bank Data:');
    console.log('- Name:', bloodBank.name);
    console.log('- Location:', bloodBank.location);
    console.log('- Address (current):', bloodBank.address);
    console.log('- City (old field):', bloodBank.city);
    console.log('- State (old field):', bloodBank.state);
    console.log('- PinCode (old field):', bloodBank.pincode || bloodBank.pinCode);
    
    // Prepare proper address structure
    const properAddress = {
      street: bloodBank.address?.street || bloodBank.address || 'abc',
      city: bloodBank.address?.city || bloodBank.city || 'Surat',
      state: bloodBank.address?.state || bloodBank.state || 'Gujarat',
      pinCode: bloodBank.address?.pinCode || bloodBank.pincode || bloodBank.pinCode || '363310',
      country: bloodBank.address?.country || 'India'
    };
    
    console.log('\n📝 Updating to proper address structure:');
    console.log(JSON.stringify(properAddress, null, 2));
    
    const result = await collection.updateOne(
      { 
        _id: new ObjectId(bloodBankId),
        type: 'bloodbank'
      },
      {
        $set: {
          address: properAddress,
          updatedAt: new Date()
        },
        // Remove old fields if they exist
        $unset: {
          city: "",
          state: "",
          pincode: ""
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('\n✅ Blood Bank address structure updated successfully!\n');
      
      // Verify the update
      const updatedBloodBank = await collection.findOne({
        _id: new ObjectId(bloodBankId)
      });
      
      console.log('Updated Blood Bank:');
      console.log('- Name:', updatedBloodBank.name);
      console.log('- Location:', updatedBloodBank.location);
      console.log('- Address:', updatedBloodBank.address);
      
      console.log('\n✅ Address structure is now correct!');
      console.log('Schema matches:');
      console.log('  address: {');
      console.log('    street: "abc",');
      console.log('    city: "Surat",');
      console.log('    state: "Gujarat",');
      console.log('    pinCode: "363310",');
      console.log('    country: "India"');
      console.log('  }');
    } else {
      console.log('\n⚠️  No changes made. Address structure might already be correct.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the fix
fixBloodBankAddress();
