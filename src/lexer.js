const { TokenType } = require('./tokens');

class Lexer {
  /**
   * @param {string} input 
   */
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
  }

  /**
   * @returns {{type: number, value?: any, line: number, column: number}}
   */
  nextToken() {
    this.skipWhitespace();

    if (this.pos >= this.input.length) {
      return this.createToken(TokenType.EOF);
    }

    const char = this.current();

    if (char === '{') return this.advance(TokenType.LBRACE);
    if (char === '}') return this.advance(TokenType.RBRACE);
    if (char === '[') return this.advance(TokenType.LBRACKET);
    if (char === ']') return this.advance(TokenType.RBRACKET);
    if (char === ':') return this.advance(TokenType.COLON);
    if (char === ',') return this.advance(TokenType.COMMA);

    if (char === '"') return this.readString();
    if (this.isDigit(char) || char === '-') return this.readNumber();
    if (this.isAlpha(char)) return this.readKeyword();

    throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
  }

  current() {
    return this.input[this.pos];
  }

  advance(type) {
    const token = this.createToken(type);
    this.pos++;
    this.column++;
    return token;
  }

  createToken(type, value) {
    return { type, value, line: this.line, column: this.column };
  }

  skipWhitespace() {
    while (this.pos < this.input.length) {
      const char = this.current();
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        if (char === '\n') {
          this.line++;
          this.column = 0;
        }
        this.pos++;
        this.column++;
      } else {
        break;
      }
    }
  }

  readString() {
    const startLine = this.line;
    const startCol = this.column;
    
    // consume opening quote
    this.pos++;
    this.column++;

    let result = '';
    while (this.pos < this.input.length) {
      const char = this.current();
      if (char === '"') {
        // Closing quote
        this.pos++;
        this.column++;
        return { type: TokenType.STRING, value: result, line: startLine, column: startCol };
      }

      if (char === '\\') {
        this.pos++;
        this.column++;
        if (this.pos >= this.input.length) throw new Error('Unterminated string');
        
        const escape = this.current();
        switch (escape) {
          case '"': result += '"'; break
          case '\\': result += '\\'; break
          case '/': result += '/'; break
          case 'b': result += '\b'; break
          case 'f': result += '\f'; break
          case 'n': result += '\n'; break
          case 'r': result += '\r'; break
          case 't': result += '\t'; break
          default: result += escape; break
        }
      } else {
        result += char;
      }
      this.pos++;
      this.column++;
    }

    throw new Error('Unterminated string');
  }

  readNumber() {
    const start = this.pos;
    const startCol = this.column;
    
    if (this.current() === '-') {
      this.pos++;
      this.column++;
    }

    while (this.pos < this.input.length && this.isDigit(this.current())) {
      this.pos++;
      this.column++;
    }

    if (this.pos < this.input.length && this.current() === '.') {
      this.pos++;
      this.column++;
      while (this.pos < this.input.length && this.isDigit(this.current())) {
        this.pos++;
        this.column++;
      }
    }

    const raw = this.input.substring(start, this.pos);
    const value = parseFloat(raw);
    
    if (isNaN(value)) {
      throw new Error(`Invalid number format at line ${this.line}`);
    }

    return { type: TokenType.NUMBER, value, line: this.line, column: startCol };
  }

  readKeyword() {
    const start = this.pos;
    const startCol = this.column;

    while (this.pos < this.input.length && this.isAlpha(this.current())) {
      this.pos++;
      this.column++;
    }

    const value = this.input.substring(start, this.pos);
    switch (value) {
      case 'true': return { type: TokenType.TRUE, value: true, line: this.line, column: startCol };
      case 'false': return { type: TokenType.FALSE, value: false, line: this.line, column: startCol };
      case 'null': return { type: TokenType.NULL, value: null, line: this.line, column: startCol };
      default: throw new Error(`Unexpected token '${value}' at line ${this.line}`);
    }
  }

  isDigit(char) {
    return char >= '0' && char <= '9';
  }

  isAlpha(char) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }
}

module.exports = { Lexer };
