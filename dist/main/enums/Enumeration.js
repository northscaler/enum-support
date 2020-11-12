'use strict'; // NOTE: shamelessly adapted from https://github.com/rauschma/enumify/blob/master/src/enumify.js, which appears to be a
// dead project, and https://github.com/SciSpike/nodejs-support/blob/master/src/main/enums/Enumeration.js, which is
// being deprecated in favor of this class.

const {
  ClassNotExtendableError,
  IllegalArgumentTypeError
} = require('@northscaler/error-support');

const UnknownEnumValueError = require('../errors/UnknownEnumValueError');

const EnumClassNotInstantiableError = require('../errors/EnumClassNotInstantiableError');

const {
  toUpperSnake
} = require('@northscaler/string-support');

const copyProperties = require('./copyProperties');

const symbol = 'Enumeration@northscaler/enum-support';

class Enumeration {
  static isEnumerationClass(it) {
    return typeof it._$ === 'function' && it._$() === symbol;
  }

  static isEnumerationInstance(it) {
    return Enumeration.isEnumerationClass(it === null || it === void 0 ? void 0 : it.constructor);
  }

  static new({
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
    });
    const E = {
      [name]: class extends Enumeration {
        static _$() {
          return symbol;
        }

        static isInstance(it) {
          return E.isClass(it === null || it === void 0 ? void 0 : it.constructor);
        }

        static isClass(it) {
          return it === E;
        }

        static of(it) {
          if (E.isInstance(it)) return it;
          let e;
          if (typeof it === 'number') e = E.values[it];
          if (e) return e;
          e = it && (it = it.toString()) && this.values.find(e => e.name === it);
          if (e) return e;
          throw new EnumError({
            code,
            msg,
            info: info || {
              value: it
            }
          });
        }

        constructor(...args) {
          super(...args);
          if (this.constructor !== E) throw new ClassNotExtendableError();
          if (this.constructor.$ERROR$) throw new EnumClassNotInstantiableError();
        }

      }
    }[name];

    if (methods) {
      if (typeof methods === 'object') Object.assign(E.prototype, methods);else throw new IllegalArgumentTypeError({
        msg: 'methods'
      });
    }

    E._init(values, methods);

    E.$ERROR$ = EnumError; // provides specific UnknownEnumValueError subclass, and indicates completion of initialization

    return Object.freeze(Object.seal(E));
  }
  /**
   * Initialize the enum, and freeze & seal the class.
   *
   * @param arg Either an object whose properties provide the names
   * and values (which must be mutable objects) of the enum constants.
   * Or an Array whose elements are used as the names of the enum constants
   * The values are created by instantiating the current class.
   */


  static _init(arg, classMethods) {
    Object.defineProperty(this, 'values', {
      value: [],
      configurable: false,
      writable: false,
      enumerable: true
    });

    if (Array.isArray(arg)) {
      this._initializeValuesFromArray(arg, classMethods);
    } else {
      this._initializeValuesFromObject(arg, classMethods);
    }

    Object.freeze(this.values);
  }

  static _initializeValuesFromArray(arr, classMethods) {
    for (const key of arr) {
      this._addValue(new this(), key, classMethods);
    }
  }

  static _initializeValuesFromObject(obj, classMethods) {
    for (const key of Object.keys(obj)) {
      this._addValue(new this(obj[key]), key, classMethods);
    }
  }

  static _addValue(value, name, classMethods) {
    value.name = name;
    value.ordinal = this.values.length; // current length of this.values is ordinal of next value

    Object.defineProperty(this, name, {
      value,
      configurable: false,
      writable: false,
      enumerable: true
    });

    this._addPropertyAccessorsToValue(value, classMethods);

    this.values.push(Object.freeze(value));
  }
  /**
   * Make enum classes iterable
   */


  static [Symbol.iterator]() {
    return this.values[Symbol.iterator]();
  }
  /**
   * Makes any property accessors (`get` methods) on the enumeration class have the `this` reference bound correctly on the enumeration instance.
   * @param value
   * @param classMethods
   * @private
   */


  static _addPropertyAccessorsToValue(value, classMethods) {
    if (!classMethods) return;
    if (typeof classMethods !== 'object') throw new IllegalArgumentTypeError({
      msg: 'methods'
    });
    Object.keys(classMethods).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(classMethods, key);

      if (descriptor.get) {
        // we have a property accessor defined at the enum class level -- define on instance for proper `this` binding
        Object.defineProperty(value, key, {
          get: descriptor.get,
          configurable: false,
          enumerable: true
        });
      }
    });
  }
  /**
   * `_init()` closes the class. Then calling this constructor
   * throws an exception.
   *
   * If your subclass has a constructor then you can control
   * what properties are added to `this` via the argument you
   * pass to `super()`. No arguments are fine, too.
   */


  constructor(instanceProperties = undefined) {
    if (typeof instanceProperties === 'object' && instanceProperties !== null) {
      copyProperties(this, instanceProperties);
    }
  }
  /**
   * Default `toString()` method for enum constant.
   */


  toString() {
    return `${this.constructor.name}.${this.name}`;
  }

}

module.exports = Enumeration;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2VudW1zL0VudW1lcmF0aW9uLmpzIl0sIm5hbWVzIjpbIkNsYXNzTm90RXh0ZW5kYWJsZUVycm9yIiwiSWxsZWdhbEFyZ3VtZW50VHlwZUVycm9yIiwicmVxdWlyZSIsIlVua25vd25FbnVtVmFsdWVFcnJvciIsIkVudW1DbGFzc05vdEluc3RhbnRpYWJsZUVycm9yIiwidG9VcHBlclNuYWtlIiwiY29weVByb3BlcnRpZXMiLCJzeW1ib2wiLCJFbnVtZXJhdGlvbiIsImlzRW51bWVyYXRpb25DbGFzcyIsIml0IiwiXyQiLCJpc0VudW1lcmF0aW9uSW5zdGFuY2UiLCJjb25zdHJ1Y3RvciIsIm5ldyIsIm5hbWUiLCJ2YWx1ZXMiLCJlcnJvciIsImNvZGUiLCJtc2ciLCJpbmZvIiwibWV0aG9kcyIsIkVudW1FcnJvciIsInN1YmNsYXNzIiwiRSIsImlzSW5zdGFuY2UiLCJpc0NsYXNzIiwib2YiLCJlIiwidG9TdHJpbmciLCJmaW5kIiwidmFsdWUiLCJhcmdzIiwiJEVSUk9SJCIsIk9iamVjdCIsImFzc2lnbiIsInByb3RvdHlwZSIsIl9pbml0IiwiZnJlZXplIiwic2VhbCIsImFyZyIsImNsYXNzTWV0aG9kcyIsImRlZmluZVByb3BlcnR5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiQXJyYXkiLCJpc0FycmF5IiwiX2luaXRpYWxpemVWYWx1ZXNGcm9tQXJyYXkiLCJfaW5pdGlhbGl6ZVZhbHVlc0Zyb21PYmplY3QiLCJhcnIiLCJrZXkiLCJfYWRkVmFsdWUiLCJvYmoiLCJrZXlzIiwib3JkaW5hbCIsImxlbmd0aCIsIl9hZGRQcm9wZXJ0eUFjY2Vzc29yc1RvVmFsdWUiLCJwdXNoIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJmb3JFYWNoIiwiZGVzY3JpcHRvciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImdldCIsImluc3RhbmNlUHJvcGVydGllcyIsInVuZGVmaW5lZCIsIm1vZHVsZSIs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T0Qsa0JBQVAsS0FBOEIsUUFBOUIsSUFBMENBLGtCQUFrQixLQUFLLElBQXJFLEVBQTJFO0FBQ3pFM0QsTUFBQUEsY0FBYyxDQUFDLElBQUQsRUFBTzJELGtCQUFQLENBQWQ7QUFDRDtBQUNGO0FBRUQ7Ozs7O0FBR0FwQyxFQUFBQSxRQUFRLEdBQUk7QUFDVixXQUFRLEdBQUUsS0FBS2hCLFdBQUwsQ0FBaUJFLElBQUssSUFBRyxLQUFLQSxJQUFLLEVBQTdDO0FBQ0Q7O0FBM0tlOztBQThLbEJvRCxNQUFNLENBQUNDLE9BQVAsR0FBaUI1RCxXQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4vLyBOT1RFOiBzaGFtZWxlc3NseSBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JhdXNjaG1hL2VudW1pZnkvYmxvYi9tYXN0ZXIvc3JjL2VudW1pZnkuanMsIHdoaWNoIGFwcGVhcnMgdG8gYmUgYVxuLy8gZGVhZCBwcm9qZWN0LCBhbmQgaHR0cHM6Ly9naXRodWIuY29tL1NjaVNwaWtlL25vZGVqcy1zdXBwb3J0L2Jsb2IvbWFzdGVyL3NyYy9tYWluL2VudW1zL0VudW1lcmF0aW9uLmpzLCB3aGljaCBpc1xuLy8gYmVpbmcgZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB0aGlzIGNsYXNzLlxuXG5jb25zdCB7IENsYXNzTm90RXh0ZW5kYWJsZUVycm9yLCBJbGxlZ2FsQXJndW1lbnRUeXBlRXJyb3IgfSA9IHJlcXVpcmUoJ0Bub3J0aHNjYWxlci9lcnJvci1zdXBwb3J0JylcbmNvbnN0IFVua25vd25FbnVtVmFsdWVFcnJvciA9IHJlcXVpcmUoJy4uL2Vycm9ycy9Vbmtub3duRW51bVZhbHVlRXJyb3InKVxuY29uc3QgRW51bUNsYXNzTm90SW5zdGFudGlhYmxlRXJyb3IgPSByZXF1aXJlKCcuLi9lcnJvcnMvRW51bUNsYXNzTm90SW5zdGFudGlhYmxlRXJyb3InKVxuY29uc3QgeyB0b1VwcGVyU25ha2UgfSA9IHJlcXVpcmUoJ0Bub3J0aHNjYWxlci9zdHJpbmctc3VwcG9ydCcpXG5jb25zdCBjb3B5UHJvcGVydGllcyA9IHJlcXVpcmUoJy4vY29weVByb3BlcnRpZXMnKVxuXG5jb25zdCBzeW1ib2wgPSAnRW51bWVyYXRpb25Abm9ydGhzY2FsZXIvZW51bS1zdXBwb3J0J1xuXG5jbGFzcyBFbnVtZXJhdGlvbiB7XG4gIHN0YXRpYyBpc0VudW1lcmF0aW9uQ2xhc3MgKGl0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdC5fJCA9PT0gJ2Z1bmN0aW9uJyAmJiBpdC5fJCgpID09PSBzeW1ib2xcbiAgfVxuXG4gIHN0YXRpYyBpc0VudW1lcmF0aW9uSW5zdGFuY2UgKGl0KSB7XG4gICAgcmV0dXJuIEVudW1lcmF0aW9uLmlzRW51bWVyYXRpb25DbGFzcyhpdD8uY29uc3RydWN0b3IpXG4gIH1cblxuICBzdGF0aWMgbmV3ICh7XG4gICAgbmFtZSxcbiAgICB2YWx1ZXMsXG4gICAgZXJyb3I6IHtcbiAgICAgIGNvZGUgPSBudWxsLFxuICAgICAgbXNnID0gbnVsbCxcbiAgICAgIGluZm8gPSBudWxsXG4gICAgfSA9IHt9XG4gIH0gPSB7fSwgbWV0aG9kcykge1xuICAgIGNvbnN0IEVudW1FcnJvciA9IFVua25vd25FbnVtVmFsdWVFcnJvci5zdWJjbGFzcyh7XG4gICAgICBjb2RlOiBjb2RlIHx8IGBFX1VOS05PV05fJHt0b1VwcGVyU25ha2UobmFtZSl9X0VOVU1fVkFMVUVgLFxuICAgICAgbmFtZTogYFVua25vd24ke25hbWV9RW51bVZhbHVlYFxuICAgIH0pXG5cbiAgICBjb25zdCBFID0ge1xuICAgICAgW25hbWVdOiBjbGFzcyBleHRlbmRzIEVudW1lcmF0aW9uIHtcbiAgICAgICAgc3RhdGljIF8kICgpIHtcbiAgICAgICAgICByZXR1cm4gc3ltYm9sXG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgaXNJbnN0YW5jZSAoaXQpIHtcbiAgICAgICAgICByZXR1cm4gRS5pc0NsYXNzKGl0Py5jb25zdHJ1Y3RvcilcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBpc0NsYXNzIChpdCkge1xuICAgICAgICAgIHJldHVybiBpdCA9PT0gRVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIG9mIChpdCkge1xuICAgICAgICAgIGlmIChFLmlzSW5zdGFuY2UoaXQpKSByZXR1cm4gaXRcblxuICAgICAgICAgIGxldCBlXG4gICAgICAgICAgaWYgKHR5cGVvZiBpdCA9PT0gJ251bWJlcicpIGUgPSBFLnZhbHVlc1tpdF1cbiAgICAgICAgICBpZiAoZSkgcmV0dXJuIGVcblxuICAgICAgICAgIGUgPSBpdCAmJiAoaXQgPSBpdC50b1N0cmluZygpKSAmJiB0aGlzLnZhbHVlcy5maW5kKGUgPT4gZS5uYW1lID09PSBpdClcbiAgICAgICAgICBpZiAoZSkgcmV0dXJuIGVcblxuICAgICAgICAgIHRocm93IG5ldyBFbnVtRXJyb3IoeyBjb2RlLCBtc2csIGluZm86IGluZm8gfHwgeyB2YWx1ZTogaXQgfSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKC4uLmFyZ3MpIHtcbiAgICAgICAgICBzdXBlciguLi5hcmdzKVxuICAgICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yICE9PSBFKSB0aHJvdyBuZXcgQ2xhc3NOb3RFeHRlbmRhYmxlRXJyb3IoKVxuICAgICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLiRFUlJPUiQpIHRocm93IG5ldyBFbnVtQ2xhc3NOb3RJbnN0YW50aWFibGVFcnJvcigpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9W25hbWVdXG5cbiAgICBpZiAobWV0aG9kcykge1xuICAgICAgaWYgKHR5cGVvZiBtZXRob2RzID09PSAnb2JqZWN0JykgT2JqZWN0LmFzc2lnbihFLnByb3RvdHlwZSwgbWV0aG9kcylcbiAgICAgIGVsc2UgdGhyb3cgbmV3IElsbGVnYWxBcmd1bWVudFR5cGVFcnJvcih7IG1zZzogJ21ldGhvZHMnIH0pXG4gICAgfVxuXG4gICAgRS5faW5pdCh2YWx1ZXMsIG1ldGhvZHMpXG5cbiAgICBFLiRFUlJPUiQgPSBFbnVtRXJyb3IgLy8gcHJvdmlkZXMgc3BlY2lmaWMgVW5rbm93bkVudW1WYWx1ZUVycm9yIHN1YmNsYXNzLCBhbmQgaW5kaWNhdGVzIGNvbXBsZXRpb24gb2YgaW5pdGlhbGl6YXRpb25cblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKE9iamVjdC5zZWFsKEUpKVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGVudW0sIGFuZCBmcmVlemUgJiBzZWFsIHRoZSBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIGFyZyBFaXRoZXIgYW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgcHJvdmlkZSB0aGUgbmFtZXNcbiAgICogYW5kIHZhbHVlcyAod2hpY2ggbXVzdCBiZSBtdXRhYmxlIG9iamVjdHMpIG9mIHRoZSBlbnVtIGNvbnN0YW50cy5cbiAgICogT3IgYW4gQXJyYXkgd2hvc2UgZWxlbWVudHMgYXJlIHVzZWQgYXMgdGhlIG5hbWVzIG9mIHRoZSBlbnVtIGNvbnN0YW50c1xuICAgKiBUaGUgdmFsdWVzIGFyZSBjcmVhdGVkIGJ5IGluc3RhbnRpYXRpbmcgdGhlIGN1cnJlbnQgY2xhc3MuXG4gICAqL1xuICBzdGF0aWMgX2luaXQgKGFyZywgY2xhc3NNZXRob2RzKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd2YWx1ZXMnLCB7XG4gICAgICB2YWx1ZTogW10sXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZVZhbHVlc0Zyb21BcnJheShhcmcsIGNsYXNzTWV0aG9kcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZVZhbHVlc0Zyb21PYmplY3QoYXJnLCBjbGFzc01ldGhvZHMpXG4gICAgfVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzLnZhbHVlcylcbiAgfVxuXG4gIHN0YXRpYyBfaW5pdGlhbGl6ZVZhbHVlc0Zyb21BcnJheSAoYXJyLCBjbGFzc01ldGhvZHMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBhcnIpIHtcbiAgICAgIHRoaXMuX2FkZFZhbHVlKG5ldyB0aGlzKCksIGtleSwgY2xhc3NNZXRob2RzKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBfaW5pdGlhbGl6ZVZhbHVlc0Zyb21PYmplY3QgKG9iaiwgY2xhc3NNZXRob2RzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgdGhpcy5fYWRkVmFsdWUobmV3IHRoaXMob2JqW2tleV0pLCBrZXksIGNsYXNzTWV0aG9kcylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgX2FkZFZhbHVlICh2YWx1ZSwgbmFtZSwgY2xhc3NNZXRob2RzKSB7XG4gICAgdmFsdWUubmFtZSA9IG5hbWVcbiAgICB2YWx1ZS5vcmRpbmFsID0gdGhpcy52YWx1ZXMubGVuZ3RoIC8vIGN1cnJlbnQgbGVuZ3RoIG9mIHRoaXMudmFsdWVzIGlzIG9yZGluYWwgb2YgbmV4dCB2YWx1ZVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgIHZhbHVlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5fYWRkUHJvcGVydHlBY2Nlc3NvcnNUb1ZhbHVlKHZhbHVlLCBjbGFzc01ldGhvZHMpXG5cbiAgICB0aGlzLnZhbHVlcy5wdXNoKE9iamVjdC5mcmVlemUodmFsdWUpKVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgZW51bSBjbGFzc2VzIGl0ZXJhYmxlXG4gICAqL1xuICBzdGF0aWMgW1N5bWJvbC5pdGVyYXRvcl0gKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc1tTeW1ib2wuaXRlcmF0b3JdKClcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhbnkgcHJvcGVydHkgYWNjZXNzb3JzIChgZ2V0YCBtZXRob2RzKSBvbiB0aGUgZW51bWVyYXRpb24gY2xhc3MgaGF2ZSB0aGUgYHRoaXNgIHJlZmVyZW5jZSBib3VuZCBjb3JyZWN0bHkgb24gdGhlIGVudW1lcmF0aW9uIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIGNsYXNzTWV0aG9kc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIF9hZGRQcm9wZXJ0eUFjY2Vzc29yc1RvVmFsdWUgKHZhbHVlLCBjbGFzc01ldGhvZHMpIHtcbiAgICBpZiAoIWNsYXNzTWV0aG9kcykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBjbGFzc01ldGhvZHMgIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgSWxsZWdhbEFyZ3VtZW50VHlwZUVycm9yKHsgbXNnOiAnbWV0aG9kcycgfSlcblxuICAgIE9iamVjdC5rZXlzKGNsYXNzTWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY2xhc3NNZXRob2RzLCBrZXkpXG5cbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldCkgeyAvLyB3ZSBoYXZlIGEgcHJvcGVydHkgYWNjZXNzb3IgZGVmaW5lZCBhdCB0aGUgZW51bSBjbGFzcyBsZXZlbCAtLSBkZWZpbmUgb24gaW5zdGFuY2UgZm9yIHByb3BlciBgdGhpc2AgYmluZGluZ1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsdWUsIGtleSwge1xuICAgICAgICAgIGdldDogZGVzY3JpcHRvci5nZXQsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBgX2luaXQoKWAgY2xvc2VzIHRoZSBjbGFzcy4gVGhlbiBjYWxsaW5nIHRoaXMgY29uc3RydWN0b3JcbiAgICogdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICpcbiAgICogSWYgeW91ciBzdWJjbGFzcyBoYXMgYSBjb25zdHJ1Y3RvciB0aGVuIHlvdSBjYW4gY29udHJvbFxuICAgKiB3aGF0IHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGB0aGlzYCB2aWEgdGhlIGFyZ3VtZW50IHlvdVxuICAgKiBwYXNzIHRvIGBzdXBlcigpYC4gTm8gYXJndW1lbnRzIGFyZSBmaW5lLCB0b28uXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoaW5zdGFuY2VQcm9wZXJ0aWVzID0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBpbnN0YW5jZVByb3BlcnRpZXMgPT09ICdvYmplY3QnICYmIGluc3RhbmNlUHJvcGVydGllcyAhPT0gbnVsbCkge1xuICAgICAgY29weVByb3BlcnRpZXModGhpcywgaW5zdGFuY2VQcm9wZXJ0aWVzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGB0b1N0cmluZygpYCBtZXRob2QgZm9yIGVudW0gY29uc3RhbnQuXG4gICAqL1xuICB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0uJHt0aGlzLm5hbWV9YFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRW51bWVyYXRpb25cbiJdfQ==