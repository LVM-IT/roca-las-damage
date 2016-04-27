const mustache = require('mustache')
const fs = require('fs')
const path = require('path')

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
}

const loadPartials = (partialsPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(partialsPath, (err, partialNames) => {
      let promises = partialNames
        .map((partialName) => path.join(partialsPath, partialName))
        .map((partialPath) => readFilePromise(partialPath))

      Promise.all(promises).then((results) => {
        let partialMap = partialNames
          .map((name) => name.replace('.mustache', ''))
          .reduce((foo, partialName, index) => {
            foo[partialName] = results[index]
            return foo
          }, {})
        resolve(partialMap)
      }, (err) => reject(err))
    })
  })
}

module.exports = function(filePath, options, cb) {
  const layoutPath = path.resolve(options.settings.views, options.settings.layout + '.mustache')
  const partialsPath = path.resolve(options.settings.views, 'partials')

  Promise.all([
    loadPartials(partialsPath),
    readFilePromise(layoutPath),
    readFilePromise(filePath),
  ]).then((results) => {
    let partials = results[0]
    let layout = results[1]
    let template = results[2]

    let inner = mustache.render(template, options, partials)

    if (options.layout === false) {
      cb(null, inner)
    } else {
      let outer = mustache.render(layout, Object.assign({ yield: inner }, options), partials)
      cb(null, outer)
    }
  }, (err) => cb(err))
}
