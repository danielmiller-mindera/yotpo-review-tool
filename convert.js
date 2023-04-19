// converts .xlsx files within the src directory to JSON data

(async function() {
    const excel = require('exceljs');
    const path = require("path");
    const fs = require("fs");

    const workbook = new excel.Workbook();
    // use readFile for testing purpose
    // await workbook.xlsx.load(objDescExcel.buffer);
    await workbook.xlsx.readFile(path.resolve(__dirname, "src", "full.xlsx"));
    let jsonData = [];
    workbook.worksheets.forEach(function(sheet) {
        // read first row as data keys
        let firstRow = sheet.getRow(1);
        if (!firstRow.cellCount) return;
        let keys = firstRow.values;
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            let values = row.values
            let obj = {};
            for (let i = 1; i < keys.length; i ++) {
                obj[keys[i]] = values[i];
            }
            jsonData.push(obj);
        })
    });
    // console.log(jsonData);
    fs.writeFileSync(path.resolve(__dirname, "dist", "reviews", "full.json"), JSON.stringify(jsonData), "utf-8");
})();