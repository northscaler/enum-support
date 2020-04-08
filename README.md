# `enum-support`
Convenient enumeration pattern for JavaScript.

> NB: Credit is due to https://github.com/rauschma/enumify, which appears to be no longer maintained as of this writing (November, 2019).

> NB2: This release contains breaking changes since v3.0.0.
> See details at the end of this document.

## Overview
This library uses objects to represent enumerations, not just simple integer values.
It's a little bit like the way [Java implements `enum`s](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html).

In this implementation, you ask the `Enumeration` class to create your enum, including
* its name,
* its values,
* optionally, its instance methods, and
* optionally, unique instance methods for each of its values.

Here's a simple example.
```javascript
const Enumeration = require('@northscaler/enum-support')
const Color = Enumeration.new({ name: 'Color', values: ['RED', 'GREEN', 'BLUE'] })
```

### Stock features

The enumeration class you get has certain characteristics, including the following.

* They are [sealed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal).
* They are [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).
* They are not extendable, throwing `ClassNotExtendableError` from the constructor if subclassed then instantiated.
* They are not instantiable, throwing `EnumClassNotInstantiableError` from the constructor if `new`ed.

Each `Enumeration` class created via `Enumeration.new()` has the following public properties and methods.

* `values`: a static, frozen property containing an array of each of the instances, also frozen, of the enumeration; the order of the array determines each enum's ordinal (zero-based).
* `$ERROR$`: a static property containing an `UnknownEnumValueError` subclass that has a `name` equal to `Unknown${name}EnumValue` code equal to `E_UNKNOWN_${toUpperSnake(name)}_ENUM_VALUE`.
* `of(nameOrOrdinal)`: a static method that returns the enumeration instance given its `name` or zero-based ordinal; throws an instance of `$ERROR$` if not found.
* `isInstance(it)`: a static method that returns truey if `it` is an instance of the enumeration's class (and yes, `instanceof` works, too, since these are just `class`es).
* `isClass(it)`: a static method that returns truey if the given class is the enumeration class.
* `Symbol.iterator`: a static property that returns an iterator over `values`.

Each value (or, technically, `Enumeration` subclass instance) is frozen & has the following public properties & methods:
* `name`: a string property containing the name of the value.
* `ordinal`: a number representing the value's position amongst all values, as determined by the array of values you give to `Enumeration.new()`.
* `toString()`: returns a concatenation of the class's `name`, followed by a `.`, followed by the value's `name` (ie, `Color.RED.toString() === 'Color.RED'`).

## Examples
For full usage, see [the tests](src/test/unit/enums).

### Simple enumeration of values only
```javascript
const Color = Enumeration.new({
  name: 'Color',                   // 1
  values: ['RED', 'GREEN', 'BLUE'] // 2
})
```
1. Give the enumeration its name
1. Provide each enumerated value as a literal string.

### Enumeration with an instance method
```javascript
  const Day = Enumeration.new({
    name: 'Day',
    values: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  },
  // 1
  {
    isWeekend() {
      return this === Day.SATURDAY || this === Day.SUNDAY
    },
    isWeekday () {
      return !this.isWeekend()
    }
  })
```
1. Simply provide a second parameter as a literal object with methods that you wan to add to the enumeration class

### Enumeration with values that have their own methods
```javascript
  const TicTacToePiece = Enumeration.new({
    name: 'TicTacToePiece',
    values: {                                       // 1
      O: {                                          // 2
        get inverse () { return TicTacToePiece.X },
        oh () { return 'o' }                        // 3
      },
      X: {                                          // 2
        get inverse () { return TicTacToePiece.O },
        ex () { return 'x' }                        // 4
      }
    }
  })
```
1. Instead of providing an array of literal strings, provide an object whose keys are used as enumeration value names
1. The value of each key is a literal object with methods that go on that specific value.
1. Method unique to `TicTacToePiece.O`
1. Method unique to `TicTacToePiece.X`

## Breaking changes since v3.0.0
* All enumeration classes & instances are frozen & sealed, throwing `ClassNotExtendableError`.
* Enumeration class constructors now throw `EnumClassNotInstantiableError` if instantiated.
* `$ERROR$` class now has its `name` set correctly.
* Removed static property `INITIALIZED` from enumeration classes.
* Removed methods `isEnumerationInstance` & `isEnumerationClass` from `Enumeration`.
