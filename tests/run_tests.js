const { Lexer } = require('../src/lexer');
const { Parser } = require('../src/parser');
const { TokenType } = require('../src/tokens');

function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL]: ${message}`);
    process.exit(1);
  }
  console.log(`[PASS]: ${message}`);
}

console.log('--- Running JSON Parser Tests (Zero Dependency JS) ---\n');

// --- Lexer Tests ---
const lexer = new Lexer('{"a": 123}');
assert(lexer.nextToken().type === TokenType.LBRACE, 'Lexer: LBRACE found');
const strToken = lexer.nextToken();
assert(strToken.type === TokenType.STRING && strToken.value === 'a', 'Lexer: STRING "a" found');
assert(lexer.nextToken().type === TokenType.COLON, 'Lexer: COLON found');

// --- Parser Tests ---
try {
  // 1. Simple Object
  const p1 = new Parser(new Lexer('{"key": "value"}'));
  const r1 = p1.parse();
  assert(r1.key === 'value', 'Parser: Simple Object {"key": "value"}');

  // 2. Arrays
  const p2 = new Parser(new Lexer('[1, 2, 3]'));
  const r2 = p2.parse();
  assert(r2.length === 3 && r2[2] === 3, 'Parser: Array [1, 2, 3]');

  // 3. Types (Boolean, Null)
  const p3 = new Parser(new Lexer('{"a": true, "b": false, "c": null}'));
  const r3 = p3.parse();
  assert(r3.a === true && r3.b === false && r3.c === null, 'Parser: Keywords (true/false/null)');

  // 4. Nested Structure
  const p4 = new Parser(new Lexer('{"data": [1, {"nested": true}]}'));
  const r4 = p4.parse();
  assert(r4.data[1].nested === true, 'Parser: Nested Structure');

  console.log('\n[DONE] All tests passed successfully!');

} catch (e) {
  console.error(`\n[ERROR] PARSER ERROR: ${e.message}`);
  process.exit(1);
}
