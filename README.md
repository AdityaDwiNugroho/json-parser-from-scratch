# Build a JSON Parser from Scratch

> "What I cannot create, I do not understand." — Richard Feynman

This repository is a **Zero Dependency** implementation of a JSON parser in pure JavaScript. It demonstrates how compilers/parsers work under the hood.

## How it Works

### 1. Lexical Analysis (The Lexer)
The `Lexer` takes a raw string and breaks it into **Tokens**.
Input: `{"a": 1}`
Tokens: `LBRACE` -> `STRING("a")` -> `COLON` -> `NUMBER(1)` -> `RBRACE`

### 2. Syntactic Analysis (The Parser)
The `Parser` takes the stream of Tokens and builds the **AST** (Abstract Syntax Tree) or actual Object using **Recursive Descent**.

```javascript
// Pseudo-code of Recursive Descent
function parseValue() {
  if (token == LBRACE) return parseObject()
  if (token == LBRACKET) return parseArray()
  if (token == STRING) return token.value
  // ...
}
```

## Quick Start

No `npm install` required! This is pure Node.js.

```bash
# Run the demo
node examples/demo.js

# Run the test suite
node tests/run_tests.js
```

## Features
- [x] Null, Booleans (true/false)
- [x] Strings (with escapes)
- [x] Numbers (Integers/Floats)
- [x] Nested Objects & Arrays
- [x] **Zero Dependencies**

## Why learn this?
Understanding parsing is the key to:
- Writing your own DSLs (Domain Specific Languages).
- Understanding how Babel/ESLint works.
- Crushing System Design interviews.
