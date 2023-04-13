function processVendor(vendorData) {
    const vendors = {};
    vendorData.forEach(([vendor, item, cost, time]) => {
        if (!vendors[item]) {
            vendors[item] = {};
        }
        vendors[item][vendor] = { cost, time };
    });
    return vendors
}
//processVendor();
module.exports = { processVendor };