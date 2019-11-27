'use strict'

// NOTE: shamelessly adapted from https://github.com/rauschma/enumify/blob/master/src/enumify.js, which appears to be a
// dead project, and https://github.com/SciSpike/nodejs-support/blob/master/src/main/enums/Enumeration.js, which is
// being deprecated in favor of this class.

const ClassNotExtendableError = require('@northscaler/error-support/errors/ClassNotExtendableError')
const UnknownEnumValueError = require('../errors/UnknownEnumValueError')
const IllegalArgumentTypeError = require('@northscaler/error-support/errors/IllegalArgumentTypeError')
const { toUpperSnake } = require('@northscaler/string-support')
const copyProperties = require('./copyProperties')

const INITIALIZED = Symbol('ENUM_INITIALIZED')

class Enumeration {
  static isEnumerationInstance (it) {
    return Enumeration.isEnumerationClass(it?.constructor)
  }

  static isEnumerationClass (it) {
    return it && Object.getPrototypeOf(it).name === 'Enumeration'
  }

  static new ({
    name,
    values,
    error: {
      code = null,
      msg = null,
      info = null
    } = {}
  } = {}, methods) {
    code = code || `E_UNKNOWN_${toUpperSnake(name)}_ENUM_VALUE`
    const EnumError = UnknownEnumValueError.subclass({ code })

    const E = {
      [name]: class extends Enumeration {
        static isInstance (it) {
          return Enumeration.isEnumerationInstance(it) && it.constructor.name === name
        }

        static isClass (it) {
          return Enumeration.isEnumerationClass(it) && it.name === name
        }

        static of (it) {
          if (E.isInstance(it)) return it

          let e
          if (typeof it === 'number') e = E.values[it]
          if (e) return e

          e = it && (it = it.toString()) && this.values.find(x => x.name === it)
          if (e) return e

          throw new EnumError({ code, msg, info: info || { value: it } })
        }

        constructor (...args) {
          super(...args)
          if (this.constructor !== E) throw new ClassNotExtendableError()
        }
      }
    }[name]

    if (methods) {
      if (typeof methods === 'object') {
        Object.keys(methods).forEach(m => {
          E.prototype[m] = methods[m]
        })
      } else {
        throw new IllegalArgumentTypeError({ msg: 'methods' })
      }
    }

    E._init(values)

    E.$ERROR$ = EnumError

    return E
  }

  /**
   * Set up the enum, close the class.
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
      this._enumValuesFromArray(arg)
    } else {
      this._enumValuesFromObject(arg)
    }
    Object.freeze(this.values)
    this[INITIALIZED] = true
    return this
  }

  static _enumValuesFromArray (arr) {
    for (const key of arr) {
      this._pushEnumValue(new this(), key)
    }
  }

  static _enumValuesFromObject (obj) {
    for (const key of Object.keys(obj)) {
      const value = new this(obj[key])
      this._pushEnumValue(value, key)
    }
  }

  static _pushEnumValue (enumValue, name) {
    enumValue.name = name
    enumValue.ordinal = this.values.length
    Object.defineProperty(this, name, {
      value: enumValue,
      configurable: false,
      writable: false,
      enumerable: true
    })
    this.values.push(enumValue)
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
    // new.target would be better than this.constructor,
    // but isn’t supported by Babel
    if ({}.hasOwnProperty.call(this.constructor, INITIALIZED)) {
      throw new Error('Enum classes can’t be instantiated')
    }
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
