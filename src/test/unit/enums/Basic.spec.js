/* global describe, it */
'use strict'

import * as assert from 'assert'
import Enumeration from '../../../main/enums/Enumeration'

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

  it('_of', () => {
    assert.strictEqual(Color.of('BLUE'), Color.BLUE)
  })

  it('values', () => {
    assert.deepStrictEqual(Color.values, [Color.RED, Color.GREEN, Color.BLUE])
  })

  it('Class is closed (can’t be instantiated)', () => {
    assert.throws(() => {
      // eslint-disable-next-line no-new
      new Color()
    })
  })
})

describe('Enumeration: custom constructor and instance method', function () {
  const TicTacToePiece = Enumeration.new({
    name: 'TicTacToeColor',
    values: {
      O: {
        get inverse () { return TicTacToePiece.X }
      },
      X: {
        get inverse () { return TicTacToePiece.O }
      }
    }
  })

  it('Custom instance method', () => {
    assert.strictEqual(TicTacToePiece.X.inverse, TicTacToePiece.O)
    assert.strictEqual(TicTacToePiece.O.inverse, TicTacToePiece.X)
  })

  it('toString', () => {
    assert.strictEqual(String(TicTacToePiece.O), 'TicTacToeColor.O')
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

  Weekday.prototype.isBusinessDay = function () {
    switch (this) {
      case Weekday.SATURDAY:
      case Weekday.SUNDAY:
        return false
      default:
        return true
    }
  }

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
