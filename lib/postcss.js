'use strict'

let CssSyntaxError = require('./css-syntax-error')
let Declaration = require('./declaration')
let LazyResult = require('./lazy-result')
let Container = require('./container')
let Processor = require('./processor')
let stringify = require('./stringify')
let Warning = require('./warning')
let Comment = require('./comment')
let AtRule = require('./at-rule')
let Result = require('./result.js')
let Input = require('./input')
let parse = require('./parse')
let list = require('./list')
let Rule = require('./rule')
let Root = require('./root')
let Node = require('./node')

function postcss (...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0]
  }
  return new Processor(plugins, postcss)
}

postcss.plugin = function plugin (name, initializer) {
  if (console && console.warn) {
    console.warn(
      'postcss.plugin was deprecated. Migration guide:\n' +
        'https://evilmartians.com/chronicles/postcss-8-plugin-migration'
    )
  }
  function creator (...args) {
    let transformer = initializer(...args)
    transformer.postcssPlugin = name
    transformer.postcssVersion = new Processor().version
    return transformer
  }

  let cache
  Object.defineProperty(creator, 'postcss', {
    get () {
      if (!cache) cache = creator()
      return cache
    }
  })

  creator.process = function (css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts)
  }

  return creator
}

postcss.stringify = stringify
postcss.parse = parse
postcss.list = list

postcss.comment = defaults => new Comment(defaults)
postcss.atRule = defaults => new AtRule(defaults)
postcss.decl = defaults => new Declaration(defaults)
postcss.rule = defaults => new Rule(defaults)
postcss.root = defaults => new Root(defaults)

postcss.CssSyntaxError = CssSyntaxError
postcss.Declaration = Declaration
postcss.Container = Container
postcss.Comment = Comment
postcss.Warning = Warning
postcss.AtRule = AtRule
postcss.Result = Result
postcss.Input = Input
postcss.Rule = Rule
postcss.Root = Root
postcss.Node = Node

LazyResult.registerPostcss(postcss)

module.exports = postcss