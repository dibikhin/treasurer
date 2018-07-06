module.exports.aop = {};
module.exports.aop.helpers = require('./aop/helpers');
module.exports.aop.factory = require('./aop/aop_factory');

module.exports.web = {};
module.exports.web.helpers = require('./web/helpers');

module.exports.helpers = require('./helpers');

// module.exports.advice.error_handling_strategy = require('./advice/error_handling_strategy');

module.exports.advice = {
    params_validator: require('./advice/params_validator')
};

module.exports.ajv = {
    add_custom_keywords: require('./ajv/custom_keywords'),
    helpers: require('./ajv/helpers')
};

module.exports.aspects_factories = {
    params_freezer_factory: require('./aspects_factories/params_freezer_factory'),
    params_validator_factory: require('./aspects_factories/params_validator_factory')
};
