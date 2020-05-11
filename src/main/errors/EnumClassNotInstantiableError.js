'use strict'

const { IllegalStateError } = require('@northscaler/error-support')

module.exports = IllegalStateError.subclass({ name: 'EnumClassNotInstantiableError' })
