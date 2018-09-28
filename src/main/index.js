'use strict'

import { app, BrowserWindow, ipcMain, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * Database helper module
 */
const DbHelper = require('./dbHelper')
const db = new DbHelper()
db.init() // Initialize Database

/**
 * Menu Template
 */
const MenuTemplate = require('./Menu')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    width: 900,
    useContentSize: true,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  const template = new MenuTemplate({
    app: app,
    window: mainWindow
  })
  if (template !== null) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('onUpdateSqlEntry', (event, _obj) => {
  // Validate incoming data object to update SQL
  if (_obj && _obj.constructor === {}.constructor) {
    if ('sql' in _obj && 'data' in _obj && _obj.sql && _obj.data) {
      // Call dbHelper update method
      db.update(_obj)
    }
  }
})

ipcMain.on('onReadSql', (event, _obj) => {
  if (_obj && _obj.constructor === {}.constructor) {
    if ('sql' in _obj && 'id' in _obj && _obj.sql && _obj.id) {
      // Call dbHelper update method
      db.read(_obj, (error, _obj) => {
        if (error) {
          console.error(error)
        } else {
          event.sender.send('onSqlDataReady', {
            rows: _obj.rows,
            obj: _obj.obj
          })
        }
      })
    }
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
