'use strict'

// NOTE: shamelessly adapted from https://github.com/rauschma/enumify/blob/master/src/enumify.js, which appears to be a
// dead project, and https://github.com/SciSpike/nodejs-support/blob/master/src/main/enums/Enumeration.js, which is
// being deprecated in favor of this class.

const { ClassNotExtendableError, IllegalArgumentTypeError } = require('@northscaler/error-support')
const UnknownEnumValueError = require('../errors/UnknownEnumValueError')
const EnumClassNotInstantiableError = require('../errors/EnumClassNotInstantiableError')
const { toUpperSnake } = require('@northscaler/string-support')
const copyProperties = require('./copyProperties')

class Enumeration {
  static new ({
    name,
    values,
    error: {
      code = null,
      msg = null,
      info = null
    } = {}
  } = {}, methods) {
    const EnumError = UnknownEnumValueError.subclass({
      code: code || `E_UNKNOWN_${toUpperSnake(name)}_ENUM_VALUE`,
      name: `Unknown${name}EnumValue`
    })

    const E = {
      [name]: class extends Enumeration {
        static isInstance (it) {
          return E.isClass(it?.constructor)
        }

        static isClass (it) {
          return it === E
        }

        static of (it) {
          if (E.isInstance(it)) return it

          let e
          if (typeof it === 'number') e = E.values[it]
          if (e) return e

          e = it && (it = it.toString()) && this.values.find(e => e.name === it)
          if (e) return e

          throw new EnumError({ code, msg, info: info || { value: it } })
        }

        constructor (...args) {
          super(...args)
          if (this.constructor !== E) throw new ClassNotExtendableError()
          if (this.constructor.$ERROR$) throw new EnumClassNotInstantiableError()
        }
      }
    }[name]

    if (methods) {
      if (typeof methods === 'object') Object.assign(E.prototype, methods)
      else throw new IllegalArgumentTypeError({ msg: 'methods' })
    }

    E._init(values)

    E.$ERROR$ = EnumError // provides specific UnknownEnumValueError subclass, and indicates completion of initialization

    return Object.freeze(Object.seal(E))
  }

  /**
   * Initialize the enum, and freeze & seal the class.
   *
   * @param arg Either an object whose properties provide the names
   * and values (which must be mutable objects) of the enum constants.
   * Or an Array whose elements are used as the names of the enum constants
   * The values are created by instantiating the current class.
   */
  static _init (arg) {
    Object.defineProperty(this, 'values', {
      value: [],
      configurable: false,
      writable: false,
      enumerable: true
    })
    if (Array.isArray(arg)) {
      this._initializeValuesFromArray(arg)
    } else {
      this._initializeValuesFromObject(arg)
    }

    Object.freeze(this.values)
  }

  static _initializeValuesFromArray (arr) {
    for (const key of arr) {
      this._addValue(new this(), key)
    }
  }

  static _initializeValuesFromObject (obj) {
    for (const key of Object.keys(obj)) {
      this._addValue(new this(obj[key]), key)
    }
  }

  static _addValue (value, name) {
    value.name = name
    value.ordinal = this.values.length
    Object.defineProperty(this, name, {
      value,
      configurable: false,
      writable: false,
      enumerable: true
    })
    this.values.push(Object.freeze(value))
  }

  /**
   * Make enum classes iterable
   */
  static [Symbol.iterator] () {
    return this.values[Symbol.iterator]()
  }

  /**
   * `_init()` closes the class. Then calling this constructor
   * throws an exception.
   *
   * If your subclass has a constructor then you can control
   * what properties are added to `this` via the argument you
   * pass to `super()`. No arguments are fine, too.
   */
  constructor (instanceProperties = undefined) {
    if (typeof instanceProperties === 'object' && instanceProperties !== null) {
      copyProperties(this, instanceProperties)
    }
  }

  /**
   * Default `toString()` method for enum constant.
   */
  toString () {
    return `${this.constructor.name}.${this.name}`
  }
}

module.exports = Enumeration
