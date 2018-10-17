/**
 * SQL Database Helper
 */
// DbHelper dependencies in order
const fops = require('fs-extra')
const nodePath = require('path')
const nodeOs = require('os')
const sqlite3 = require('sqlite3').verbose()

// DbHelper global configuration
const config = {
  homedir: nodeOs.homedir(),
  db: null
}

// DbHelper class
function DbHelper (props) {
  this.props = props
  this.db = null
}

/**
 * Initialize SQL database
 */
DbHelper.prototype.init = () => {
  // Ensure .briefnote directory
  fops.ensureDirSync(
    nodePath.join(
      config.homedir,
      '.xplorebits',
      'briefnote',
      'resource'
    )
  )
  // Open SQL database; If there is no '.db' file, then Sqlite3 will create a new one.
  // Otherwise, database is automatically opened
  if (this.db) {
    this.db.close()
  }
  config.db = new sqlite3.Database(
    nodePath.join(
      config.homedir,
      '.xplorebits',
      'briefnote',
      'briefnote.db'
    ),
    (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('db opened successfully', config.db)
        config.db.serialize(() => {
          // Create Tables if not exists
          // notes
          config.db.run(
            `CREATE TABLE if not exists
            notes(
              title TEXT,
              description TEXT,
              type TEXT,
              path TEXT,
              id TEXT,
              thumbnail TEXT
            )`
          )
          // tags
          config.db.run(
            `CREATE TABLE if not exists
            tags(
              id TEXT,
              value TEXT,
              title TEXT
            )`,
            (err) => {
              if (err) {
                console.error(err)
              } else {
                config.db.all(
                  `SELECT * FROM tags`,
                  (err, rows) => {
                    if (err) {
                      console.error(err)
                    } else {
                      console.log('rows', rows)
                      if (rows.length < 1) {
                        console.log('rows are empty')
                        config.db.run(
                          `INSERT INTO
                          tags(id,value,title)
                          VALUES(?,?,?)`,
                          [
                            'tag_unlisted',
                            'unlisted',
                            'unlisted'
                          ]
                        )
                      }
                    }
                  }
                )
              }
            }
          )
          // filter
          config.db.run(
            `CREATE TABLE if not exists
            filter(
              note TEXT,
              tag TEXT
            )`
          )
        })
      }
    }
  )
}

/**
 * Delete SQL entry with id
 */
DbHelper.prototype.deleteWithId = (_obj) => {
  // Validate data object
  if (_obj && _obj.constructor === {}.constructor) {
    if ('sql' in _obj && _obj.sql) {
      if (config.db) {
        config.db.serialize(() => {
          config.db.run(`${_obj.sql}`, (error) => {
            if (error) {
              console.error(error)
            } else {
              console.log('Deleted an entry in SQL database. SQL', _obj.sql)
            }
          })
        })
      }
    }
  }
}

/**
 * Add SQL database with new entry
 */
DbHelper.prototype.add = (_obj) => {
  // Validate data object
  if (_obj && _obj.constructor === {}.constructor) {
    if ('sql' in _obj && 'data' in _obj &&
      _obj.sql && _obj.data) {
      if (config.db) {
        // Serial SQL database operations
        config.db.serialize(() => {
          config.db.run(`${_obj.sql}`, _obj.data, (error) => {
            if (error) {
              // Something is wrong. TODO: Handle error properly
              console.log(`Error when updating database: ${error}`)
            } else {
              // Update database Successfully
              console.log(`Database updated!`)
            }
          })
        })
      } else {
        // Unable to initialize SQL database. This is due to database descriptor got RESET.
        console.log(`Database is not initialized`)
      }
    }
  }
}

/**
 * Update SQL database with new entry
 */
DbHelper.prototype.update = (_obj) => {
  // Validate data object
  if (_obj && _obj.constructor === {}.constructor) {
    if ('sql' in _obj && _obj.sql) {
      if (config.db) {
        // Serial SQL database operations
        config.db.serialize(() => {
          config.db.run(`${_obj.sql}`, (error) => {
            if (error) {
              // Something is wrong. TODO: Handle error properly
              console.log(`Error when updating database: ${error}`)
            } else {
              // Update database Successfully
              console.log(`Database updated!`)
            }
          })
        })
      } else {
        // Unable to initialize SQL database. This is due to database descriptor got RESET.
        console.log(`Database is not initialized`)
      }
    }
  }
}

/**
 * Read SQL database
 */
DbHelper.prototype.read = function (_obj, _callback) {
  console.log(config.db)
  // Validate data object
  if (_obj && _obj.constructor === {}.constructor &&
    'sql' in _obj && 'id' in _obj &&
    _obj.sql && _obj.id) {
    if (config.db) {
      config.db.serialize(() => {
        config.db.all(`${_obj.sql}`, (error, _rows) => {
          if (error) {
            _callback(error)
          } else {
            _callback(null, {
              rows: _rows,
              obj: _obj
            })
          }
        })
      })
    } else {
      _callback(new Error('Database is not initialized'))
    }
  } else {
    _callback(new Error('Invalid data object'))
  }
}

// Export this helper API
module.exports = DbHelper
