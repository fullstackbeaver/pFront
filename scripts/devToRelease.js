var fs = require('fs');

// require.extensions['.txt'] = function (module, filename) {
//   module.exports = fs.readFileSync(filename, 'utf8');
// };

var words = fs.readFileSync("./words.txt", 'utf8');


console.log(typeof words); // string
console.log(words); // string