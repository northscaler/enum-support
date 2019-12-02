'use strict'

module.exports = require('@northscaler/error-support/errors/IllegalArgumentError')
  .subclass({ name: 'UnknownEnumValueError' })
