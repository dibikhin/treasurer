const { map, zipObj } = require('ramda')

module.exports = {
    prepare_controller
}

/**
 * @returns { String: Function }
 */
function prepare_controller(prefix, controller) {
    const keys = map(k => prefix + k, Object.keys(controller))
    return zipObj(keys, Object.values(controller))
}
