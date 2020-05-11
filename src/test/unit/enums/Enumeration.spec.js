/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const Enumeration = require('../../../main')
const { ClassNotExtendableError } = require('@northscaler/error-support')

describe('unit tests of Enumeration', function () {
  it('should create a new enum', () => {
    const Boolean = Enumeration.new({ name: 'BooleanValue', values: ['TRUE', 'FALSE'] })
    const OneTwo = Enumeration.new({ name: 'OneTwo', values: ['ONE', 'TWO'] })

    expect(Boolean.TRUE).to.be.ok()
    expect(Boolean.FALSE).to.be.ok()
    expect(Boolean.BOGUS).not.to.be.ok()
    expect(Boolean.isInstance(Boolean.TRUE)).to.be.true()
    expect(Boolean.isClass(Boolean)).to.be.true()
    expect(OneTwo.isInstance(OneTwo.ONE)).to.be.true()
    expect(OneTwo.isClass(OneTwo)).to.be.true()
    expect(OneTwo.isInstance(Boolean.TRUE)).to.be.false()
    expect(OneTwo.isClass(Boolean)).to.be.false()
    expect(Boolean.of(Boolean.TRUE)).to.equal(Boolean.TRUE)
    expect(Boolean.of('TRUE')).to.equal(Boolean.TRUE)
    expect(Boolean.of(0)).to.equal(Boolean.TRUE)
    expect(() => Boolean.of('BOGUS')).to.throw(Boolean.$ERROR$)
      .that.has.property('code').that.equals('E_UNKNOWN_BOOLEAN_VALUE_ENUM_VALUE')
  })

  it('should not allow extensions of enum classes', function () {
    const Super = Enumeration.new({ name: 'Super', values: ['SUPER'] })

    class Sub extends Super {
    }

    expect(() => new Sub()).to.throw(ClassNotExtendableError)
  })
})
