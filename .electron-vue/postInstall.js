'use strict'

process.env.NODE_ENV = 'production'

const { say } = require('cfonts')
const chalk = require('chalk')
const { spawn } = require('child_process')

lint().then(function () {
  rebuild()
})

async function lint () {
  const promise = new Promise(function (resolve, reject) {
    const cmd = spawn('npm', ['run', 'lint:fix'])
    cmd.stdout.on('data', function(data) {
      console.log(`${data}`)
    })
    cmd.stderr.on('data', (data) => {
      console.log(`${data}`)
    })
    
    cmd.on('close', (code) => {
      resolve()
    })
  })
  await promise
  return promise
}

function rebuild () {
  const promise = new Promise(function (resolve, reject) {
    const cmd = spawn('npm', ['run', 'electron-rebuild'])
    cmd.stdout.on('data', function(data) {
      console.log(`${data}`)
    })
    cmd.stderr.on('data', (data) => {
      console.log(`${data}`)
    })
    
    cmd.on('close', (code) => {
      resolve()
    })
  })
}
