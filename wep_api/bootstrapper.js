/**
 * Entry point
 * @module bootstrapper
 */

module.exports = { run }

function run() {
    console.info('Starting...')

    const uuidv1 = require('uuid/v1')
    const benalu = require('lib/benalu/benalu') // NOTE self built, due to an old npm
    const ajv = require('ajv')
    const morgan = require('morgan')

    const mongodb = require('mongodb')

    const http = require('http')

    const serve_static = require('serve-static')
    const no_cache = require('nocache')
    const favicon = require('serve-favicon')
    const cors = require('cors')
    const _connect = require('connect')
    const connect = _connect()

    const json = require('res-json')
    const js_yaml = require('js-yaml')
    const fs = require('fs')

    const swagger_tools = require('swagger-tools')

    const infra = require('infrastructure')
    const errors = require('errors')

    const configs = require('configs')
    const web = require('web')
    const treasurer = require('components/treasurer')
    const db = require('components/db')

    // TODO move. Throw or log?
    process.on('unhandledRejection', function throw_unhandled(reason) { throw reason })

    _run()

    async function _run() {
        const contexts = {}
        contexts.treasurer = {}
        contexts.treasurer.dal = { driver: mongodb }

        await db.connect(contexts.treasurer.dal, configs.mongo)

        configs.treasurer = {}
        configs.treasurer.params_validators = configs.ajv.configure({
            ajv, infra, mongo_is_valid: mongodb.ObjectID.isValid, schemas: treasurer.params_schemas
        })

        configure_web_app({ web, configs, contexts })
        configure_swagger({ configs, contexts })

        const treasurer_controller_proxy = wire_component({
            errors, infra, configs, web, contexts, treasurer
        })
        const swagger_opts = configs.web.to_swagger_opts(configs.web, treasurer_controller_proxy)
        const run_params = {
            add_error_handlers: web.helpers.add_error_handlers,
            error_handlers: web.error_handlers
        }
        return void web.swagger.run(contexts.swagger, run_params, swagger_opts, web.server.run)
    }

    /**
     * @private
     */

    function configure_web_app({ web, configs, contexts }) {
        contexts.middleware = {
            morgan, logger: configs.logger, app: connect, favicon, serve_static, no_cache, cors, json, generate_op_id: uuidv1
        }
        return void web.app.configure(contexts.middleware)
    }

    function configure_swagger({ configs, contexts }) {
        const swagger_doc = configs.web.swagger.configure_doc({
            fs, js_yaml, port: configs.web.port, swagger: configs.web.swagger
        })
        contexts.swagger = {
            http, connect, swagger_tools, swagger_doc
        }
    }

    function wire_component({ errors, infra, configs, web, contexts, treasurer }) {
        const treasurer_dal_proxy = proxify_baked_dal({ infra, contexts, })
        contexts.treasurer.model = {
            Errors: errors,
            Dal: treasurer_dal_proxy,
            Model: null,
            Rules: treasurer.rules
        }

        const treasurer_model_proxy = proxify_baked_model({ infra, contexts, })
        contexts.treasurer.controller = {
            Errors: errors,
            Model: treasurer_model_proxy
        }
        contexts.treasurer.model.Model = contexts.treasurer.controller.Model

        // TODO freeze deeper
        Object.freeze(contexts)

        const controller = web.helpers.prepare_controller({
            logger: configs.logger, prefix: configs.web.treasurer_controller_prefix,
            controller: treasurer.controller, error_handling_strategy: infra.error_handling_strategy,
        })

        const treasurer_controller_proxy = proxify_baked_controller({ infra, contexts, controller })
        return treasurer_controller_proxy
    }

    // TODO below: generalize and move to The Framework
    function proxify_baked_dal({ infra, contexts }) {
        const treasurer_dal_baked = infra.di.inject_first_param(treasurer.dal, contexts.treasurer.dal)
        const treasurer_dal_proxy = infra.aop.proxy_factory.create({
            aop_provider: benalu,
            target: treasurer_dal_baked,
            interceptors: [
                infra.aspects_factories.params_freezer_factory({
                    params_freezer_advice: Object.freeze
                })
            ]
        })
        return treasurer_dal_proxy
    }

    function proxify_baked_model({ infra, contexts }) {
        const treasurer_model_baked = infra.di.inject_first_param(treasurer.model, contexts.treasurer.model)
        const treasurer_model_proxy = infra.aop.proxy_factory.create({
            aop_provider: benalu,
            target: treasurer_model_baked,
            interceptors: [
                infra.aspects_factories.params_freezer_factory({
                    params_freezer_advice: Object.freeze
                }),
                infra.aspects_factories.params_validator_factory({
                    params_validators: configs.treasurer.params_validators,
                    params_validator_advice: infra.advice.params_validator
                })
            ]
        })
        return treasurer_model_proxy
    }

    function proxify_baked_controller({ infra, contexts, controller }) {
        const treasurer_controller_baked = infra.di.inject_first_param(controller, contexts.treasurer.controller)
        const treasurer_controller_proxy = infra.aop.proxy_factory.create({
            aop_provider: benalu,
            target: treasurer_controller_baked,
            interceptors: [
                infra.aspects_factories.error_handler_factory({ logger: configs.logger })
            ]
        })
        return treasurer_controller_proxy
    }
}
