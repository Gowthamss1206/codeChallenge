const { client } = require('./utils/db');
const { readVendorData } = require('./controllers/vendorDataController');
const { processVendor } = require('./models/processVendor');
const { readPurchaseData } = require('./controllers/purchaseDataController');
const { processPurchase } = require('./models/processPurchase');
const { createOutputDataTable } = require('./controllers/outputTableCreator');
const { insertOutputData } = require('./controllers/insertOutputData');

async function main() {
    try {
        console.log("Started")

        // Will Read the Vendor Data From DB
        const vendorData = await readVendorData()
        console.log("vendorData");
        console.log(vendorData)

        //To find the vendors available for each item
        const vendors = await processVendor(vendorData)
        console.log(vendors)

        //To read purchase data
        const purchaseData = await readPurchaseData()
        console.log("purchaseData");
        console.log(purchaseData)

        //To find the best vendor for the purchase
        const outputData = await processPurchase(vendors,purchaseData)
        console.log("outputData");
        console.log(outputData)

        //Create a new table to insert the output data
        await createOutputDataTable()
        
        //Inserts the output data in the created table
        await insertOutputData(outputData)
    }
    catch (err) {
        console.log("Something Error Happened", err)
    }
}
main();