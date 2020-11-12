'use strict'

// NOTE: shamelessly adapted from https://github.com/rauschma/enumify/blob/master/src/enumify.js, which appears to be a
// dead project, and https://github.com/SciSpike/nodejs-support/blob/master/src/main/enums/Enumeration.js, which is
// being deprecated in favor of this class.

const { ClassNotExtendableError, IllegalArgumentTypeError } = require('@northscaler/error-support')
const UnknownEnumValueError = require('../errors/UnknownEnumValueError')
const EnumClassNotInstantiableError = require('../errors/EnumClassNotInstantiableError')
const { toUpperSnake } = require('@northscaler/string-support')
const copyProperties = require('./copyProperties')

const symbol = 'Enumeration@northscaler/enum-support'

class Enumeration {
  static isEnumerationClass (it) {
    return typeof it._$ === 'function' && it._$() === symbol
  }

  static isEnumerationInstance (it) {
    return Enumeration.isEnumerationClass(it?.constructor)
  }

  // eslint-disable-next-line default-param-last
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
        static _$ () {
          return symbol
        }

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

    E._init(values, methods)

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
  static _init (arg, classMethods) {
    Object.defineProperty(this, 'values', {
      value: [],
      configurable: false,
      writable: false,
      enumerable: true
    })
    if (Array.isArray(arg)) {
      this._initializeValuesFromArray(arg, classMethods)
    } else {
      this._initializeValuesFromObject(arg, classMethods)
    }

    Object.freeze(this.values)
  }

  static _initializeValuesFromArray (arr, classMethods) {
    for (const key of arr) {
      this._addValue(new this(), key, classMethods)
    }
  }

  static _initializeValuesFromObject (obj, classMethods) {
    for (const key of Object.keys(obj)) {
      this._addValue(new this(obj[key]), key, classMethods)
    }
  }

  static _addValue (value, name, classMethods) {
    value.name = name
    value.ordinal = this.values.length // current length of this.values is ordinal of next value

    Object.defineProperty(this, name, {
      value,
      configurable: false,
      writable: false,
      enumerable: true
    })

    this._addPropertyAccessorsToValue(value, classMethods)

    this.values.push(Object.freeze(value))
  }

  /**
   * Make enum classes iterable
   */
  static [Symbol.iterator] () {
    return this.values[Symbol.iterator]()
  }

  /**
   * Makes any property accessors (`get` methods) on the enumeration class have the `this` reference bound correctly on the enumeration instance.
   * @param value
   * @param classMethods
   * @private
   */
  static _addPropertyAccessorsToValue (value, classMethods) {
    if (!classMethods) return
    if (typeof classMethods !== 'object') throw new IllegalArgumentTypeError({ msg: 'methods' })

    Object.keys(classMethods).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(classMethods, key)

      if (descriptor.get) { // we have a property accessor defined at the enum class level -- define on instance for proper `this` binding
        Object.defineProperty(value, key, {
          get: descriptor.get,
          configurable: false,
          enumerable: true
        })
      }
    })
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
