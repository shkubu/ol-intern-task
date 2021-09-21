const fs = require('fs');

module.exports = class DatabaseManipulation {
  static readData(filename) {
    return JSON.parse(fs.readFileSync(`database/${filename}.json`));
  }
  static writeData(filename, data) {
    const jsonData = JSON.stringify(data, null, 2);
    return fs.writeFileSync(`database/${filename}.json`, jsonData);
  }
}
