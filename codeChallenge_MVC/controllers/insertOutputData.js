const { client } = require("../utils/db");
const { Client } = require('pg');
function insertOutputData(outputData) {
    return new Promise((resolve, reject) => {
        const dbConnection = new Client(client);
        dbConnection.connect();
        try {
            const values = outputData.map(row => `('${row[0]}', '${row[1]}', ${row[2]}, ${row[3]}, '${row[4]}', ${row[5]}, ${row[6]})`).join(',');
            const insertQuery = `INSERT INTO outputData (purchase_id, item, quantity, found, vendor, cost, time) VALUES ${values}`;
            dbConnection.query(insertQuery)
                .then(() => {
                    console.log('Data inserted successfully');
                    dbConnection.end();
                    resolve();
                })
        }
        catch (err) {
            console.error('Error inserting data:', err);
            dbConnection.end();
            reject(err);
        }
        // finally {
        //     dbConnection.end()
        // }
});
}
module.exports = { insertOutputData };