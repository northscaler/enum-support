/* global describe, it */
'use strict'

import * as assert from 'assert'

const copyProperties = require('../../../main/enums/copyProperties')

describe('copyProperties', function () {
  it('Simple', () => {
    assert.deepStrictEqual(
      copyProperties({ foo: 1 }, { foo: 2, bar: 2 }),
      { foo: 2, bar: 2 }
    )
  })
  it('Getter', () => {
    const target = {}
    const source = { get foo () { return 1 } }
    const getter = Object.getOwnPropertyDescriptor(source, 'foo').get
    copyProperties(target, source)
    assert.deepStrictEqual(
      Object.getOwnPropertyDescriptor(target, 'foo'),
      { get: getter, set: undefined, enumerable: true, configurable: true }
    )
  })
  it('Setter', () => {
    const target = {}
    const source = {
      get foo () { return this.value },
      set foo (value) { this.value = value }
    }
    const setter = Object.getOwnPropertyDescriptor(source, 'foo').set
    const getter = Object.getOwnPropertyDescriptor(source, 'foo').get
    copyProperties(target, source)
    assert.deepStrictEqual(
      Object.getOwnPropertyDescriptor(target, 'foo'),
      { set: setter, get: getter, enumerable: true, configurable: true }
    )
  })
})
