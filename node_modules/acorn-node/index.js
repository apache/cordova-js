var acorn = require('acorn')
var xtend = require('xtend')

function mapOptions (opts) {
  if (!opts) opts = {}
  opts = xtend({
    ecmaVersion: 2019,
    allowHashBang: true,
    allowReturnOutsideFunction: true,
    plugins: {
      dynamicImport: opts.sourceType === 'module',
      importMeta: opts.sourceType === 'module'
    }
  }, opts)
  opts.plugins = xtend(opts.plugins, {})
  return opts
}

module.exports = exports = xtend(acorn, {
  parse: function parse (src, opts) {
    return acorn.parse(src, mapOptions(opts))
  },
  parseExpressionAt: function parseExpressionAt (src, offset, opts) {
    return acorn.parseExpressionAt(src, offset, mapOptions(opts))
  },
  tokenizer: function tokenizer (src, opts) {
    return acorn.tokenizer(src, mapOptions(opts))
  }
})

require('acorn-dynamic-import/lib/inject').default(exports)
require('./lib/import-meta')(exports)
