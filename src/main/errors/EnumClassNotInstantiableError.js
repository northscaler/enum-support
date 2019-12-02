'use strict'

module.exports = require('@northscaler/error-support/errors/IllegalStateError')
  .subclass({ name: 'EnumClassNotInstantiableError' })
