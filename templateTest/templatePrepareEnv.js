const fs = require('fs');
const args = process.argv.slice(2)[0];
const dirTest = `${__dirname}/../__tests__/${args}`;
const containFile = require('./containFileTest')(args);

if (!fs.existsSync(dirTest)) {
  fs.mkdirSync(dirTest);
}
if (!fs.existsSync(`dirTest/${args}`)) {
  fs.appendFile(`${dirTest}/${args}.test.js`, containFile, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
}

console.log(args);