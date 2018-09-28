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

Prism.languages.insertBefore('c', 'macro', {
  'builtin': {
    pattern: /\b(?:printf|malloc|free|calloc|realloc|strcpy|strlen|strcmp|srand|clock|time|exit|fprintf|fscanf|fopen|fclose)(?=\()/,
  },
  'libs-constants': {
    pattern: /\b(?:CLOCKS_PER_SEC|RAND_MAX|EXIT_SUCCESS|EXIT_FAILURE)\b/i,
    alias: 'constant'
  },
  'support-type': {
    pattern: /\b(?:clock_t|time_t)\b/i,
    alias: 'type'
  }
});