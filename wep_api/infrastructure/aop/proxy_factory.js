/**
 * @module proxy_factory
 */

const { forEach } = require('ramda')

module.exports = {
    create
}

function create({ aop_provider, target, interceptors }) {
    const proxy = aop_provider.fromInstance(target)
    forEach(x => proxy.addInterception(x), interceptors)
    return proxy.build()
}
