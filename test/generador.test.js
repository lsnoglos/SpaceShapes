const assert = require('assert');
const generador = require('../generador');

assert.deepStrictEqual(generador(3, 1, 2), [1, 3, 5]);
console.log('generador tests passed');
