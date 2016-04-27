const spawn = require('child_process').spawn

let options = [
  '--npm-import',
  '--clean-css'
]

if (process.env.NODE_ENV !== 'production') {
  options.push('--source-map-less-inline', '--source-map-map-inline')
}

spawn('./node_modules/.bin/lessc', options.concat([
  'frontend/index.less',
  'public/application.css'
]))
