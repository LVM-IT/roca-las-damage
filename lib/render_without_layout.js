// When the header layout is set to 'false' the page will be
// rendered without the layout
const path = require('path')

module.exports = function (req, res, next) {
  if (req.headers.layout === 'false') {
    let _render = res.render
    res.render = function(path, opts) {
      _render.call(this, path, Object.assign({}, opts, {
        layout: false
      }))
    }
  }

  next()
}
