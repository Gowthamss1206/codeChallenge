const { client } = require("../utils/db");
const { Client } = require('pg');
function createOutputDataTable() {
    return new Promise((resolve, reject) => {
        const dbConnection = new Client(client);
        dbConnection.connect();
        try {
            const createTableQuery = 'CREATE TABLE IF NOT EXISTS outputData (purchase_id TEXT, item TEXT, quantity INT, found BOOLEAN, vendor TEXT, cost NUMERIC, time NUMERIC);';
            dbConnection.query(createTableQuery)
                .then(() => {
                    console.log('Table created successfully');
                    dbConnection.end();
                    resolve()
                })
        }
        catch (err) {
            console.error('Error creating table:', err);
            dbConnection.end();
            reject(err);
        }
        // finally {
        //     dbConnection.end()
        // }
    });
}
module.exports = { createOutputDataTable }