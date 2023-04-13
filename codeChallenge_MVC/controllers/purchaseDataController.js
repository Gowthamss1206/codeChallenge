const { client } = require("../utils/db");
const { Client } = require('pg');
function readPurchaseData() {
    return new Promise((resolve, reject) => {
        const dbConnection = new Client(client);
        dbConnection.connect();
        try {
            dbConnection.query('SELECT purchase_id, item, quantity FROM purchases')
                .then(res => {
                    var purchaseData = [];
                    res.rows.forEach(row => {
                        purchaseData.push([row.purchase_id, row.item, row.quantity]);
                    });
                    dbConnection.end();
                    resolve(purchaseData)
                    //console.log(purchaseData);
                })
        }
        catch (err) {
            console.error('Error reading purchaseData:', err);
            dbConnection.end();
            reject(err);
        }
        // finally {
        //     dbConnection.end()
        // }
    });
}
//readPurchaseData();
module.exports = { readPurchaseData };