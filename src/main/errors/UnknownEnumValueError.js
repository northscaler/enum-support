'use strict'

const { IllegalArgumentError } = require('@northscaler/error-support')

module.exports = IllegalArgumentError.subclass({ name: 'UnknownEnumValueError' })
