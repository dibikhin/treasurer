/**
 * @module interceptors_template_factory
 */

module.exports = {
    create
}

const { filter, identity, map, partial, pipe, } = require('ramda')

function create({ infra, component_infra, aspects_configs }) {
    // aspects_configs -> { layer: [ null, interceptor, undefined ] } -> component_interceptors
    const compose_component_interceptors = x => map(pipe(
        partial(component_infra.interceptors_template_factory.create, [infra]), filter(identity)), x)
    const component_interceptors = compose_component_interceptors(aspects_configs)
    return component_interceptors
}
