const { Client } = require('pg');
const parse = require('csv-parse');
// Creating configuration object for connecting with DB
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres123',
    database: 'code_challenge'
});
client.connect();
// Gets the data from the vendors table
const vendorData = []
client.query('SELECT * FROM vendors')
    .then(res => {
        res.rows.forEach(row => {
            vendorData.push([row.vendor, row.item, row.cost_per_kg, row.time_to_deliver]);
        });
        const vendors = {};
        vendorData.forEach(([vendor, item, cost, time]) => {
            if (!vendors[item]) {
                vendors[item] = {};
            }
            vendors[item][vendor] = { cost, time };
        });
        //Gets the data from purchases tabe
        const purchaseData = []
        client.query('SELECT * FROM purchases')
            .then(res => {
                res.rows.forEach(row => {
                    purchaseData.push([row.purchase_id, row.item, row.quantity]);
                });
                const outputData = [];
                purchaseData.forEach(([purchaseId, item, quantity]) => {
                    if (!vendors[item]) {
                        outputData.push([purchaseId, item, quantity, false, " ", 0, 0]);
                    } else {
                        let minCost = Infinity;
                        let minTime = Infinity;
                        let minVendor = "";
                        for (const vendor in vendors[item]) {
                            const cost = vendors[item][vendor].cost * quantity;
                            const time = vendors[item][vendor].time;
                            if (cost < minCost || (cost === minCost && time < minTime)) {
                                minCost = cost;
                                minTime = time;
                                minVendor = vendor;
                            }
                        }
                        outputData.push([purchaseId, item, quantity, true, minVendor, minCost, minTime]);
                    }
                });
                for (const row of outputData) {
                    console.log(row);
                }
                client.end();
            })
    }) 