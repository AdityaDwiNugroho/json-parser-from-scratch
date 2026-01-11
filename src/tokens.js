/**
 * Token Types Enum
 * @readonly
 * @enum {number}
 */
const TokenType = {
  LBRACE: 0,   // {
  RBRACE: 1,   // }
  LBRACKET: 2, // [
  RBRACKET: 3, // ]
  COLON: 4,    // :
  COMMA: 5,    // ,
  STRING: 6,   // "foo"
  NUMBER: 7,   // 123, -4.56
  TRUE: 8,     // true
  FALSE: 9,    // false
  NULL: 10,    // null
  EOF: 11      // End of File
};

module.exports = { TokenType };
