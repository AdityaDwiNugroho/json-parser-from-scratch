const { Lexer } = require('../src/lexer');
const { Parser } = require('../src/parser');

// Generate a large JSON object
const largeObject = {
  users: Array(1000).fill(0).map((_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    active: i % 2 === 0,
    roles: ['admin', 'editor', 'viewer']
  }))
};
const jsonString = JSON.stringify(largeObject);

console.log(`--- Benchmark: Parsing ${jsonString.length} bytes / 1000 objects ---\n`);

// 1. Native JSON.parse
const startNative = process.hrtime();
for (let i = 0; i < 100; i++) {
  JSON.parse(jsonString);
}
const endNative = process.hrtime(startNative);
const timeNative = (endNative[0] * 1000 + endNative[1] / 1e6).toFixed(2);
console.log(`[Native] JSON.parse:  ${timeNative}ms (100 runs)`);

// 2. Our Parser
const startCustom = process.hrtime();
for (let i = 0; i < 100; i++) {
  const lexer = new Lexer(jsonString);
  const parser = new Parser(lexer);
  parser.parse();
}
const endCustom = process.hrtime(startCustom);
const timeCustom = (endCustom[0] * 1000 + endCustom[1] / 1e6).toFixed(2);

console.log(`[Custom] Our Parser:    ${timeCustom}ms (100 runs)`);

const ratio = (timeCustom / timeNative).toFixed(1);
console.log(`\nResult: We are ~${ratio}x slower than native C++ (expected for pure JS).`);
console.log('But we have 100% control over the AST!');
