const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

const config = require('./config.js');

console.log(`obniz ${config.obnizA_ID} ${config.obnizB_ID}つかうよ!\n２つを"同じ"電源に繋いでね。`)


describe("obniz", async function () {

  const files = fs.readdirSync(path.join(__dirname, 'tests'));
  for (let i = 0; i < files.length; i++) {
    if (files[i].indexOf(".js") >= 0) {
      require(path.join(__dirname, 'tests', files[i]));
      // test({obnizA, obnizB});
    }
  }
});
