module.exports = {
    add_interceptions
};

function add_interceptions({ aop_provider, target, interceptions }) {
    const proxy = aop_provider.fromInstance(target);
    for (const interceptor of interceptions) {
        proxy.addInterception(interceptor);
    }
    return proxy.build();
}
