/* global describe, it */
'use strict'

import * as assert from 'assert'
import ClassNotExtendableError from '@northscaler/error-support/errors/ClassNotExtendableError'
import Enumeration from '../../../main'
import EnumClassNotInstantiableError from '../../../main/errors/EnumClassNotInstantiableError'

describe('Enumeration: simple', function () {
  const Color = Enumeration.new({ name: 'Color', values: ['RED', 'GREEN', 'BLUE'] })

  it('instanceof', () => {
    assert.ok(Color.RED instanceof Color)
  })

  it('toString', () => {
    assert.strictEqual(String(Color.RED), 'Color.RED')
  })

  it('ordinal', () => {
    assert.strictEqual(Color.GREEN.ordinal, 1)
  })

  it('of', () => {
    assert.strictEqual(Color.of('BLUE'), Color.BLUE)
  })

  it('values', () => {
    assert.deepStrictEqual(Color.values, [Color.RED, Color.GREEN, Color.BLUE])
  })

  it('Class can’t be instantiated', () => {
    try {
      // eslint-disable-next-line no-new
      new Color()
      assert.fail('should have thrown EnumClassNotInstantiableError')
    } catch (e) {
      assert.ok(e instanceof EnumClassNotInstantiableError)
    }
  })

  it('Class can’t be extended', () => {
    try {
      class Subcolor extends Color {}

      // eslint-disable-next-line no-new
      new Subcolor()

      assert.fail('should have thrown ClassNotExtendableError')
    } catch (e) {
      assert.ok(e instanceof ClassNotExtendableError)
    }
  })
})

describe('Enumeration: custom constructor and instance method', function () {
  const TicTacToePiece = Enumeration.new({
    name: 'TicTacToePiece',
    values: {
      O: {
        get inverse () { return TicTacToePiece.X },
        oh () { return 'o' }
      },
      X: {
        get inverse () { return TicTacToePiece.O },
        ex () { return 'x' }
      }
    }
  })

  it('Custom instance method', () => {
    assert.strictEqual(TicTacToePiece.X.inverse, TicTacToePiece.O)
    assert.strictEqual(TicTacToePiece.O.inverse, TicTacToePiece.X)
    assert.strictEqual(TicTacToePiece.X.ex(), 'x')
    assert.strictEqual(TicTacToePiece.O.oh(), 'o')
    assert.ok(!TicTacToePiece.X.oh)
    assert.ok(!TicTacToePiece.O.ex)
  })

  it('toString', () => {
    assert.strictEqual(String(TicTacToePiece.O), 'TicTacToePiece.O')
  })

  it('ordinal', () => {
    assert.strictEqual(TicTacToePiece.O.ordinal, 0)
    assert.strictEqual(TicTacToePiece.X.ordinal, 1)
  })
})

describe('Enumeration: custom prototype method', function () {
  const Weekday = Enumeration.new({
    name: 'Weekday',
    values: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  }, {
    isBusinessDay () {
      switch (this) {
        case Weekday.SATURDAY:
        case Weekday.SUNDAY:
          return false
        default:
          return true
      }
    }
  })

  it('Custom prototype method', () => {
    assert.strictEqual(Weekday.SATURDAY.isBusinessDay(), false)
    assert.strictEqual(Weekday.MONDAY.isBusinessDay(), true)
  })
})

describe('Enumeration: flags', function () {
  const Mode = Enumeration.new({
    name: 'Mode',
    values: {
      USER_R: {
        n: 0b100000000
      },
      USER_W: {
        n: 0b010000000
      },
      USER_X: {
        n: 0b001000000
      },
      GROUP_R: {
        n: 0b000100000
      },
      GROUP_W: {
        n: 0b000010000
      },
      GROUP_X: {
        n: 0b000001000
      },
      ALL_R: {
        n: 0b000000100
      },
      ALL_W: {
        n: 0b000000010
      },
      ALL_X: {
        n: 0b000000001
      }
    }
  })

  it('Enumeration: using the flags', () => {
    assert.strictEqual(
      Mode.USER_R.n | Mode.USER_W.n | Mode.USER_X.n |
      Mode.GROUP_R.n | Mode.GROUP_X.n |
      Mode.ALL_R.n | Mode.ALL_X.n,
      0o755)

    assert.strictEqual(
      Mode.USER_R.n | Mode.USER_W.n | Mode.USER_X.n | Mode.GROUP_R.n,
      0o740)
  })
})
