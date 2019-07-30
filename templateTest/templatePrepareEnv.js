const fs = require('fs');
const args = process.argv.slice(2)[0];
const dirTest = `${__dirname}/../__tests__/${args}`;
const dirRoute = `${__dirname}/../routes/${args}`;
const containTest = require('./containFileTest')(args);
const containRoute = require('./containFileRoute')(args);
const containIndex = require('./containFileIndex')(args);

if (!fs.existsSync(dirTest)) {
  fs.mkdirSync(dirTest);
}

if (!fs.existsSync(`${dirTest}/${args}.test.js`)) {
  fs.appendFile(`${dirTest}/${args}.test.js`, containTest, function (err) {
    if (err) throw err;
    console.log('File in test is created successfully.');
  });
}

if (!fs.existsSync(dirRoute)) {
  fs.mkdirSync(dirRoute);
}

if (!fs.existsSync(`dirRoute/${args}.js`)) {
  fs.appendFile(`${dirRoute}/controller.js`, containRoute, function (err) {
    if (err) throw err;
    console.log(`File ${args}.js in routes is created successfully.`);
  });
}

if (!fs.existsSync(`dirRoute/index.js`)) {
  fs.appendFile(`${dirRoute}/index.js`, containIndex, function (err) {
    if (err) throw err;
    console.log('File index in routes is created successfully.');
  });
}