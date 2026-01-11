const { Lexer } = require('./src/lexer');
const { Parser } = require('./src/parser');
const { TokenType } = require('./src/tokens');

module.exports = {
  Lexer,
  Parser,
  TokenType,
  parse: (input) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    return parser.parse();
  }
};
