const { Lexer } = require('./lexer');
const { TokenType } = require('./tokens');

class Parser {
  /**
   * @param {Lexer} lexer 
   */
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.nextToken();
  }

  parse() {
    const result = this.parseValue();
    if (this.currentToken.type !== TokenType.EOF) {
      throw new Error(`Expected EOF at line ${this.currentToken.line}, column ${this.currentToken.column}`);
    }
    return result;
  }

  parseValue() {
    switch (this.currentToken.type) {
      case TokenType.LBRACE: return this.parseObject();
      case TokenType.LBRACKET: return this.parseArray();
      case TokenType.STRING: return this.consume(TokenType.STRING).value;
      case TokenType.NUMBER: return this.consume(TokenType.NUMBER).value;
      case TokenType.TRUE: 
        this.consume(TokenType.TRUE);
        return true;
      case TokenType.FALSE:
        this.consume(TokenType.FALSE);
        return false;
      case TokenType.NULL:
        this.consume(TokenType.NULL);
        return null;
      default:
        // Reverse lookup for error message
        const typeName = Object.keys(TokenType).find(k => TokenType[k] === this.currentToken.type);
        throw new Error(`Unexpected token ${typeName} at line ${this.currentToken.line}, column ${this.currentToken.column}`);
    }
  }

  parseObject() {
    this.consume(TokenType.LBRACE);
    const obj = {};

    if (this.currentToken.type === TokenType.RBRACE) {
      this.consume(TokenType.RBRACE);
      return obj;
    }

    while (true) {
      const keyToken = this.consume(TokenType.STRING);
      const key = keyToken.value;
      this.consume(TokenType.COLON);
      const value = this.parseValue();
      obj[key] = value;

      if (this.currentToken.type === TokenType.RBRACE) {
        break;
      }
      this.consume(TokenType.COMMA);
    }

    this.consume(TokenType.RBRACE);
    return obj;
  }

  parseArray() {
    this.consume(TokenType.LBRACKET);
    const arr = [];

    if (this.currentToken.type === TokenType.RBRACKET) {
      this.consume(TokenType.RBRACKET);
      return arr;
    }

    while (true) {
      arr.push(this.parseValue());
      if (this.currentToken.type === TokenType.RBRACKET) {
        break;
      }
      this.consume(TokenType.COMMA);
    }

    this.consume(TokenType.RBRACKET);
    return arr;
  }

  consume(type) {
    if (this.currentToken.type === type) {
      const token = this.currentToken;
      this.currentToken = this.lexer.nextToken();
      return token;
    }
    const expected = Object.keys(TokenType).find(k => TokenType[k] === type);
    const actual = Object.keys(TokenType).find(k => TokenType[k] === this.currentToken.type);
    throw new Error(`Expected ${expected} but got ${actual} at line ${this.currentToken.line}, column ${this.currentToken.column}`);
  }
}

module.exports = { Parser };
