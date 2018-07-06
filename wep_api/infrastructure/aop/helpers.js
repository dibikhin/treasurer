const { forEach } = require('ramda')

module.exports = {
    add_interceptions
}

function add_interceptions({ aop_provider, target, interceptions }) {
    const proxy = aop_provider.fromInstance(target)
    forEach(x => proxy.addInterception(x), interceptions)
    return proxy.build()
}
