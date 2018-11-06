'use strict'
const fops = require('fs-extra')
const path = require('path')
const normalizeUrl = require('normalize-url')
const Spawn = require('threads').spawn

const helper = {
  getPath: function (note, _resPath, context, onViewNote) {
    let resPath = _resPath
    if (!resPath) {
      context.$store.dispatch('setState', {
        name: 'resPath',
        data: require('./defConfig').refPath
      })
      resPath = require('./defConfig').refPath
    }
    let source = null
    if (note.type === 'IMAGE') {
      const fileUrl = normalizeUrl(
        'file://' +
        path.join(
          resPath,
          onViewNote ? note.path : note.thumbnail
        ) + '.png'
      )
      source = fileUrl
    } else if (note.type === 'TEXT') {
      source = fops.readFileSync(
        path.join(
          resPath,
          note.path
        ),
        'utf8'
      )
    }
    return source
  },
  getSource: async function (note, _resPath, context, onViewNote) {
    const promise = new Promise((resolve, reject) => {
      if (
        note && note.constructor === {}.constructor &&
        'type' in note && note.type
      ) {
        let resPath = _resPath
        let filePath = null
        if (!resPath) {
          context.$store.dispatch('setState', {
            name: 'resPath',
            data: require('./defConfig').refPath
          })
          resPath = require('./defConfig').refPath
        }
        switch (note.type) {
          case 'TEXT':
            filePath = path.join(
              resPath,
              note.path
            )
            break
          case 'IMAGE':
            filePath = path.join(
              resPath,
              `${onViewNote ? note.path : note.thumbnail}.png`
            )
            break
          default: break
        }
        if (filePath && fops.existsSync(filePath)) {
          const tds = new Spawn(threadHandler)
          tds.send({
            path: filePath
          })
          tds.on('message', function (response) {
            if (response.state) {
              resolve(response.data)
            } else {
              reject(response.data)
            }
            tds.kill()
          })
        }
      }
    })
    await promise
    return promise
  },
  getTagsFromNote: function (note, filter, tags) {
    const tagsAssociated = []
    if (
      note && note.constructor === {}.constructor &&
      filter && filter.constructor === [].constructor &&
      tags && tags.constructor === [].constructor
    ) {
      filter.forEach((filterItem) => {
        if (
          'tag' in filterItem && 'note' in filterItem &&
          filterItem.note === note.id
        ) {
          const tagIndex = tags.findIndex(x => x.id === filterItem.tag)
          if (tagIndex > -1) {
            tagsAssociated.push(tags[tagIndex].title)
          }
        }
      })
    }
    return tagsAssociated
  }
}

function threadHandler (input, done) {
  const _fops = this.require('fs-extra')
  _fops.readFile(
    input.path,
    'utf-8',
    function (err, data) {
      if (err) {
        console.error(err)
        done({
          state: false,
          data: err
        })
      } else {
        done({
          state: true,
          data: data
        })
      }
    }
  )
}

export default helper
