/* global describe, it */
'use strict'

import * as assert from 'assert'
import Enumeration from '../../../main/enums/Enumeration'

const Result = Enumeration.new({ name: 'Result', values: ['ACCEPTED', 'REJECTED'] })

const State = Enumeration.new({
  name: 'State',
  values: {
    START: {
      enter (iter) {
        const { value, done } = iter.next()
        if (done) {
          return Result.REJECTED
        }
        switch (value) {
          case 'A':
            return State.A_SEQUENCE
          default:
            return Result.REJECTED
        }
      }
    },
    A_SEQUENCE: {
      enter (iter) {
        const { value, done } = iter.next()
        if (done) {
          return Result.REJECTED
        }
        switch (value) {
          case 'A':
            return State.A_SEQUENCE
          case 'B':
            return State.B_SEQUENCE
          default:
            return Result.REJECTED
        }
      }
    },
    B_SEQUENCE: {
      enter (iter) {
        const { value, done } = iter.next()
        if (done) {
          return State.ACCEPT
        }
        switch (value) {
          case 'B':
            return State.B_SEQUENCE
          default:
            return Result.REJECTED
        }
      }
    },
    ACCEPT: {
      enter (iter) {
        return Result.ACCEPTED
      }
    }
  }
})

function runStateMachine (str) {
  const iter = str[Symbol.iterator]()
  let state = State.START
  while (true) {
    state = state.enter(iter)
    switch (state) {
      case Result.ACCEPTED:
        return true
      case Result.REJECTED:
        return false
    }
  }
}

describe('Enumeration: state machine', function () {
  it('Accepts and rejects properly', () => {
    assert.strictEqual(runStateMachine('AABBB'), true, 'AABBB')
    assert.strictEqual(runStateMachine('AA'), false, 'AA')
    assert.strictEqual(runStateMachine('BBB'), false, 'BBB')
    assert.strictEqual(runStateMachine('AABBC'), false, 'AABBC')
    assert.strictEqual(runStateMachine(''), false, '')
  })
})
