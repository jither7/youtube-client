const path = require("path");
async function main() {
    let s = ',';
    let fs = require('fs');
    let resources = [];
    let data = fs.readFileSync(path.join(__dirname, 'locals', 'language.csv')).toString();
    let lines;
    if (data.indexOf('\r\n') > -1) {
        lines = data.split('\r\n');
    }
    else {
        lines = data.split('\n');
    }
    let resourceData = {};
    let columns = lines[0].split(s);
    for (let ii = 3; ii < columns.length; ii++) {
        resources.push(columns[ii]);
    }
    for (let lang of resources) {
        resourceData[lang] = {};
    }
    for (let ii = 1; ii < lines.length; ii++) {
        let data = await convertLine(lines[ii]);
        let scene = data[0].trim();
        let sceneKey = data[1].trim();
        for (let langIndex in resources) {
            let index = parseInt(langIndex);
            let lang = resources[index];
            if (resourceData[lang][scene] == undefined) {
                resourceData[lang][scene] = {};
            }
            resourceData[lang][scene][sceneKey] = data[3 + index].trim();
        }
    }
    for (let langKey in resourceData) {
        let content = JSON.stringify(resourceData[langKey], null, 4);
        fs.writeFileSync(path.join(__dirname, 'locals', langKey, langKey + ".json"), content);
    }

    return `success with ${lines.length - 1} lines`;
}

const csv = require('node-csv').createParser();
function convertLine(line) {
    return new Promise((resolve, reject)=> {
        csv.parse(line + "\n", function(err, data) {
            if (err) { reject(err); }
            resolve(data[0]);
        });
    })
}

main().then((result)=> {
    console.info(result);
});