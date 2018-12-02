module.exports.name = 'treasurer'

module.exports.dal = require('./treasurer_dal')
module.exports.model = require('./treasurer_model')
module.exports.controller = require('./treasurer_controller')

module.exports.rules = require('./treasurer_rules')
module.exports.errors = require('./treasurer_errors')

module.exports.params_schemas = require('./treasurer_params_schemas.json')

module.exports.aspects_configs = require('./treasurer_aspects_configs')

Object.freeze(module.exports)
