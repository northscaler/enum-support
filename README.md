# `enum-support`
Convenient enumeration pattern for JavaScript.

> NB: Credit is due to https://github.com/rauschma/enumify, which appears to be no longer maintained as of this writing (November, 2019).

## Overview
This library uses objects to represent enumerations, not just simple integer values.
It's a little bit like the way [Java implements `enum`s](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html).

In this implementation, you ask the `Enumeration` class to create your enum, including
* its name,
* its values,
* optionally, its instance methods, and
* optionally, unique instance methods for each of its values.

The enumeration class you get has certain characteristics.
Key features of Enumeration classes include the following.

* They are effectively final and cannot be `extend`ed,
* They are [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) once initialized

### Stock features
Each `Enumeration` class created via `Enumeration.new()` has the following public properties and methods.

* `values`: a static property containing an array of each of the instances of the enumeration
* `$ERROR$`: a static property containing an `UnknownEnumValueError` subclass that has a `code` equal to `E_UNKNOWN_${toUpperSnake(name)}_ENUM_VALUE`
* `of(name)`: a static method that returns the enumeration instance given its `name`
* `isInstance(it)`: a static method that returns truey if `it` is an instance of the enumeration class
* `isClass(it)`: a static method that returns truey if the given class is the enumeration class

## Examples

## Simple enumeration:  values only

```javascript
const Color = Enumeration.new({ name: 'Color', values: ['RED', 'GREEN', 'BLUE'] })

```
