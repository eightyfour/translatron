var translatron = require('./translatron');
// start the server with defaults
const translatronUi = process.argv[2]
console.log('translatrionUi', translatronUi)
if (translatronUi) {
    translatron({translatronUi: true});
} else{
    translatron()
}