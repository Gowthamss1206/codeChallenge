function processPurchase(vendors,purchaseData) {
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
            if (minVendor) {
                outputData.push([purchaseId, item, quantity, true, minVendor, minCost, minTime]);
            }
        }
    });
    return outputData
    //console.log(outputData);
}

module.exports = { processPurchase };