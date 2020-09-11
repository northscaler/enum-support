/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const Enumeration = require('../../../main')
const { ClassNotExtendableError } = require('@northscaler/error-support')
const EnumClassNotInstantiableError = require('../../../main').errors.EnumClassNotInstantiableError

describe('unit tests of Enumeration', function () {
  it('should create a new enum', () => {
    const Boolean = Enumeration.new({ name: 'BooleanValue', values: ['TRUE', 'FALSE'] })
    const OneTwo = Enumeration.new({
      name: 'OneTwo',
      values: {
        ONE: {
          one () {
            return 1
          },
          get eleven () {
            return this.one() + 10
          }
        },
        TWO: {
          two () {
            return 2
          },
          get twelve () {
            return this.two() + 10
          }
        }
      }
    }, {
      myName: function () {
        return `my name is ${this.name}`
      },
      get myNameIsThisDotMyNameAsProp () {
        return `${this.myName()} as prop`
      },
      get myNameIsThisDotNameAsProp () {
        return `my name is ${this.name} as prop`
      }
    })

    expect(Boolean.TRUE).to.be.ok()
    expect(Boolean.FALSE).to.be.ok()
    expect(Boolean.BOGUS).not.to.be.ok()
    expect(Boolean.isInstance(Boolean.TRUE)).to.be.true()
    expect(Boolean.isClass(Boolean)).to.be.true()
    expect(OneTwo.isInstance(OneTwo.ONE)).to.be.true()
    expect(OneTwo.isClass(OneTwo)).to.be.true()
    expect(OneTwo.isInstance(Boolean.TRUE)).to.be.false()
    expect(OneTwo.isClass(Boolean)).to.be.false()
    expect(OneTwo.ONE.myName()).to.equal('my name is ONE')
    expect(OneTwo.ONE.one()).to.equal(1)
    expect(OneTwo.ONE.eleven).to.equal(11)
    expect(OneTwo.ONE.two).not.to.be.ok()
    expect(OneTwo.ONE.twelve).not.to.be.ok()
    expect(OneTwo.TWO.myName()).to.equal('my name is TWO')
    expect(OneTwo.TWO.two()).to.equal(2)
    expect(OneTwo.TWO.twelve).to.equal(12)
    expect(OneTwo.TWO.one).not.to.be.ok()
    expect(OneTwo.TWO.eleven).not.to.be.ok()
    expect(Boolean.of(Boolean.TRUE)).to.equal(Boolean.TRUE)
    expect(Boolean.of('TRUE')).to.equal(Boolean.TRUE)
    expect(Boolean.of(0)).to.equal(Boolean.TRUE)
    expect(() => Boolean.of('BOGUS')).to.throw(Boolean.$ERROR$)
      .that.has.property('code').that.equals('E_UNKNOWN_BOOLEAN_VALUE_ENUM_VALUE')
    expect(OneTwo.ONE.myNameIsThisDotMyNameAsProp).to.equal('my name is ONE as prop')
    expect(OneTwo.ONE.myNameIsThisDotNameAsProp).to.equal('my name is ONE as prop')
    expect(OneTwo.TWO.myNameIsThisDotMyNameAsProp).to.equal('my name is TWO as prop')
    expect(OneTwo.TWO.myNameIsThisDotNameAsProp).to.equal('my name is TWO as prop')

    expect(Enumeration.isEnumerationClass(Boolean)).to.be.true()
    expect(Enumeration.isEnumerationClass(OneTwo)).to.be.true()
    expect(Enumeration.isEnumerationClass(OneTwo.ONE)).to.be.false()
  })

  it('should not allow enum classes to be instantiable', function () {
    const It = Enumeration.new({ name: 'It', values: ['THING'] })

    expect(() => new It()).to.throw(EnumClassNotInstantiableError)
  })

  it('should not allow extensions of enum classes', function () {
    const Super = Enumeration.new({ name: 'Super', values: ['SUPER'] })

    class Sub extends Super {
    }

    expect(() => new Sub()).to.throw(ClassNotExtendableError)
  })
})
