const { client } = require("../utils/db");
const { Client } = require('pg');
function readVendorData() {
    return new Promise((resolve, reject) => {
        const dbConnection = new Client(client);
        dbConnection.connect();
        try {
            dbConnection.query('SELECT vendor, item, cost_per_kg, time_to_deliver FROM vendors')
            .then(res => {
                var vendorData = [];
                res.rows.forEach(row => {
                    vendorData.push([row.vendor, row.item, row.cost_per_kg, row.time_to_deliver]);
                });
                dbConnection.end();
                resolve(vendorData)
            })
        }
        catch(err){
            dbConnection.end();
            reject(err);
        }
        // finally {
        //     dbConnection.end()
        // }
    });

}
//readVendorData();
module.exports = { readVendorData };