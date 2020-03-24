//execute terminal script node run.js example.ms
const fs = require("fs");
const babel = require("@babel/core");
const moriscript = require("./moriscript");

const morifile = process.argv[2];

//read the file code from the file:
let src = fs.readFileSync(morifile, (err, data) => {
  if (err) {
    throw err;
  }
  return data.toString();
});

//use moriscript/plugin to transform the source code:
let transformed = babel.transform(src, {
  plugins: [moriscript]
});

//print the generated code to screen:
console.log(transformed.code);
