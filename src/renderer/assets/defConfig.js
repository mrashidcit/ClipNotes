'use strict'

const os = require('os')
const path = require('path')

module.exports = {
  refPath: path.join(
    os.homedir(),
    '.xplorebits',
    'clipnotes',
    'resources'
  )
}
