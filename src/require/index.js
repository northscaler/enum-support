'use strict'

const fs = require('fs')
const path = require('path')
const RX = /^(.*)\..*$/

const entriesIn = (dir, predicate = () => true) => {
  return fs.readdirSync(dir)
    .reduce((accum, entry) => {
      const pathname = path.resolve(dir, entry)
      if (!predicate(pathname)) return accum

      const match = RX.exec(entry)
      entry = match ? match[1] : entry
      accum[entry] = require(pathname)
      return accum
    }, {})
}

module.exports = {
  dirsIn: absoluteDir => entriesIn(absoluteDir, it => fs.statSync(it).isDirectory() && !it.endsWith('node_modules')),
  jsFilesIn: absoluteDir => entriesIn(absoluteDir, it => /\.js$/.test(it) && fs.statSync(it).isFile()),
  jsFilesExceptIndexIn: absoluteDir => entriesIn(absoluteDir, it => /\.js$/.test(it) && fs.statSync(it).isFile() && !/index\.js$/.test(it)),
  jsonFilesIn: absoluteDir => entriesIn(absoluteDir, it => /\.json$/.test(it) && fs.statSync(it).isFile())
}
