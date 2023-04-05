const { Client } = require('pg');
const parse = require('csv-parse');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres123',
    database: 'code_challenge'
});

// Connect to the database
client.connect();

// Read the vendorData table
const vendorData = [];
client.query('SELECT * FROM vendors')
    .then(res => {
        res.rows.forEach(row => {
            vendorData.push([row.vendor, row.item, row.cost_per_kg, row.time_to_deliver]);
            //console.log(vendorData);
        });

        // Process the vendorData
        const vendors = {};
        vendorData.forEach(([vendor, item, cost, time]) => {
            if (!vendors[item]) {
                vendors[item] = {};
            }
            vendors[item][vendor] = { cost, time };
        });

        // Read the purchaseData table
        const purchaseData = [];

        client.query('SELECT * FROM purchases')
            .then(res => {
                res.rows.forEach(row => {
                    purchaseData.push([row.purchase_id, row.item, row.quantity]);
                    //console.log(purchaseData);
                });

                // Process the purchaseData
                const outputData = [];
                purchaseData.forEach(([purchaseId, item, quantity]) => {
                    if (!vendors[item]) {
                        outputData.push([purchaseId, item, quantity, false, '', 0, 0]);
                    } else {
                        let minCost = Infinity;
                        let minTime = Infinity;
                        let minVendor = '';
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
                        //console.log(outputData)
                    }
                });

                // Store the outputData in a new table
                const createTableQuery = 'CREATE TABLE IF NOT EXISTS outputData (purchaseId TEXT, item TEXT, quantity INT, found BOOLEAN, vendor TEXT, cost NUMERIC, time NUMERIC);';
                client.query(createTableQuery)
                    .then(() => {
                        console.log('Table created successfully');
                        //const insertQuery = `INSERT INTO outputdata VALUES ${outputData.map(row => `(${row.map(value => typeof value === 'string' ? `'${value}'` : value).join(',')})`).join(',')};`;
                        const values = outputData.map(row => `('${row[0]}', '${row[1]}', ${row[2]}, ${row[3]}, '${row[4]}', ${row[5]}, ${row[6]})`).join(',');
                        //console.log(values);
                        const query = `INSERT INTO outputData (purchaseId, item, quantity, found, vendor, cost, time) VALUES ${values}`;
                        client.query(query)
                            .then(() => {
                                console.log('Data inserted successfully');
                                // Disconnect from the database
                                client.end();
                            })
                            .catch(err => {
                                console.error('Error inserting data:', err);
                                client.end();
                            });
                    })
                    .catch(err => {
                        console.error('Error creating table:', err);
                        client.end();
                    });
            })
            .catch(err => {
                console.error('Error reading purchaseData:', err);
                client.end();
            });
    })
    .catch(err => {
        console.error('Error reading vendorData:', err);
        client.end();
    });