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
const DbHelper = require('./dbHelper/dbHelper')
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
    height: 700,
    width: 1120,
    useContentSize: true,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      webSecurity: !(process.env.NODE_ENV === 'development')
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

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    db.init()
    createWindow()
  }
})

ipcMain.on('sql', function (event, config) {
  if (config && config.constructor === {}.constructor &&
    'command' in config && 'sql' in config) {
    switch (config.command) {
      case 'CREATE':
        console.log('CREATE', config)
        break
      case 'READ':
        if ('for' in config && config.for &&
          'stage' in config && config.stage) {
          db.read(config.sql, function (rows) {
            event.sender.send('sql_read', {
              data: rows,
              for: config.for,
              stage: config.stage
            })
          })
          console.log('READ', config)
        }
        break
      case 'UPDATE':
        console.log('UPDATE', config)
        break
      case 'ADD':
        if ('data' in config) {
          db.add({
            sql: config.sql,
            data: config.data
          })
        }
        console.log('UPDATE', config)
        break
      case 'DELETE':
        console.log('DELETE', config)
        break
      default: break
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
