Prism.languages.ass = {
  'ass-tag': {
    pattern: /(\\)(?:u|s|xbord|ybord|bord|xshad|yshad|shad|be|blur|b|fn|fscx|fscy|fsp|fs|frx|fry|frz|fr|fax|fay|fe|1c|2c|3c|4c|c|alpha|1a|2a|3a|4a|an|a|kf|ko|k|K|q|r|pos|move|org|fade|fad|t|clip|iclip|i|pbo|p)/i,
    alias: 'function',
    lookbehind: true
  },
  'lua-expression': {
    pattern: /\!(\\?.)*?\!/g,
    alias: 'string'
  },
  'variable': /\$+(?:\w+)/i,
  'number': /\&H[\da-fA-F]+\&|(?:\d+\.?\d*)/i,
  'ass-special': {
    pattern: /\\(?:n|N|h)/i,
    alias: 'symbol'
  },
  'punctuation': /[\\(),]/,
  'brackets': {
    pattern: /[{}]/,
    alias: 'punctuation'
  }
};