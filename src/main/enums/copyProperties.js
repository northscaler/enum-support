'use strict'

module.exports = function copyProperties (target, source) {
  // Ideally, we’d use Reflect.ownKeys() here,
  // but I don’t want to depend on a polyfill
  for (const key of Object.getOwnPropertyNames(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key)
    Object.defineProperty(target, key, desc)
  }
  return target
}
