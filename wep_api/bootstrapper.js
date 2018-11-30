/**
 * Entry point
 * @module bootstrapper
 */

const { assoc } = require('ramda')

module.exports = { run }

function run() {
    console.info('Starting...')
    console.info('Require: Starting...')

    const core_deps = load_core_deps({})

    const infra = require('infrastructure/')
    const configs = require('configs/')
    const web = require('web/')

    const component_factory = require('component_factory')

    const treasurer = require('components/treasurer/')
    const db = require('components/db')

    console.info('Require: OK')


    // TODO move. Throw or log?
    process.on('unhandledRejection', function throw_unhandled(reason) { throw reason })


    return void run_app({ core_deps, infra, configs, web, component_factory, treasurer, db })
}

/**
 * @private
 */
async function run_app({ core_deps, infra, configs, web, component_factory, treasurer, db }) {
    const contexts = {}

    configs.treasurer = {}
    configs.treasurer.params_validators = configs.ajv.configure({
        ajv: core_deps.ajv, infra, mongo_is_valid: core_deps.mongodb.ObjectID.isValid, schemas: treasurer.params_schemas
    })
    Object.freeze(configs) // TODO freeze deeper

    configure_web_app({ core_deps, web, configs, contexts })
    configure_swagger({ core_deps, configs, contexts })
    const treasurer_component = configure_controller({ infra, web, configs, treasurer, })

    const treasurer_component_context = component_factory.create({
        core_deps, infra, configs, web, contexts, component: treasurer_component
    })
    contexts.treasurer = treasurer_component_context

    const collection = await db.connect(contexts.treasurer.dal, configs.mongo)
    contexts.treasurer.dal[configs.mongo.collection_name] = collection // WARN collection maybe dead after mongo restart/down
    console.log('Connected to MongoDB')

    Object.freeze(contexts) // TODO freeze deeper

    const swagger_opts = configs.web.to_swagger_opts(configs.web, treasurer_component_context.controller_proxy)
    const run_params = {
        add_error_handlers: web.helpers.add_error_handlers,
        error_handlers: web.error_handlers
    }
    return void web.swagger.start(contexts.swagger, run_params, swagger_opts, web.server.create_and_listen)
}

function load_core_deps(core_deps) {
    core_deps.uuidv1 = require('uuid/v1')
    core_deps.aop_provider = require('lib/benalu/benalu') // NOTE self built, due to an old npm
    core_deps.ajv = require('ajv')
    core_deps.morgan = require('morgan')
    core_deps.mongodb = require('mongodb')
    core_deps.driver = core_deps.mongodb

    const _connect = require('connect')
    core_deps.connect = _connect()
    return core_deps
}

function configure_web_app({ core_deps, web, configs, contexts }) {
    contexts.middleware = {
        logger: configs.logger, connect: core_deps.connect, generate_op_id: core_deps.uuidv1
    }
    return void web.app.configure(contexts.middleware)
}

function configure_swagger({ core_deps, configs, contexts }) {
    const swagger_doc = configs.web.swagger.configure_doc({
        core_deps, port: configs.web.port, swagger_configs: configs.web.swagger
    })
    contexts.swagger = {
        connect: core_deps.connect, swagger_doc
    }
}

/**
 * Controller factory
 */
function configure_controller({ infra, web, configs, treasurer }) {
    const prepared_controller = web.helpers.prepare_controller({
        logger: configs.logger, prefix: configs.web.controller_prefix,
        controller: treasurer.controller, error_handling_strategy: infra.error_handling_strategy,
    })
    const ready_treasurer = assoc('controller', prepared_controller, treasurer)
    return ready_treasurer
}
