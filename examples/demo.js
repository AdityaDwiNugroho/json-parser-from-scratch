const { Lexer } = require('../src/lexer');
const { Parser } = require('../src/parser');

const json = `
{
  "name": "JSON Parser from Scratch",
  "version": 1.0,
  "isAwesome": true,
  "features": [
    "Zero Dependencies",
    "Recursive Descent",
    "Handwritten Lexer"
  ],
  "meta": null
}
`;

console.log('--- Input JSON String ---');
console.log(json.trim());

console.log('\n--- Parsing... ---');
try {
  const lexer = new Lexer(json);
  const parser = new Parser(lexer);
  const result = parser.parse();
  
  console.log('[SUCCESS] Parsed JavaScript Object:');
  console.dir(result, { depth: null, colors: true });

} catch (e) {
  console.error('\n[ERROR] Parse Failed:', e.message);
}
