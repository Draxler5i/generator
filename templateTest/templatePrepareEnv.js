const fs = require('fs');
const args = process.argv.slice(2)[0];
const dirTest = `${__dirname}/../__tests__/${args}`;
const dirRoute = `${__dirname}/../routes/${args}`;
const dirModel = `${__dirname}/../models/${args}`;
const containTest = require('./containFileTest')(args);
const containRoute = require('./containFileRoute')(args);
const containIndex = require('./containFileIndex')(args);
const containModel = require('./containFileModel')(args);

const createDir = (pathDir) => {
  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir);
  }
};

const createFile = (path, file, content) => {
  if (!fs.existsSync(`${path}/${file}.js`)) {
    fs.appendFile(`${path}/${file}.js`, content, function (err) {
      if (err) throw err;
      console.log(`File ${file} in ${path} is created successfully.`);
    });
  }
};

createDir(dirTest);
createFile(dirTest, `${args}.test`, containTest);

createDir(dirRoute);
createFile(dirRoute, `controller`, containRoute);
createFile(dirRoute, `index`, containIndex);

createDir(dirModel);
createFile(dirModel, `${args}`, containModel);