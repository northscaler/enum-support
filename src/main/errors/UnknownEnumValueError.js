'use strict'

const IllegalArgumentError = require('@northscaler/error-support/errors/IllegalArgumentError')

module.exports = IllegalArgumentError.subclass({ name: 'UnknownEnumError' })
