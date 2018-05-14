/**
 * Entry point
 * @module bootstrapper
 */

console.info('Starting...');

const uuidv1 = require('uuid/v1');
const benalu = require('lib/benalu/benalu'); // self built, due to an old npm
const _ajv = require('ajv');

const mongodb = require('mongodb');

const http = require('http');

const serve_static = require('serve-static');
const no_cache = require('nocache');
const favicon = require('serve-favicon');
const cors = require('cors');
const _connect = require('connect');
const connect = _connect();

const json = require('res-json');
const js_yaml = require('js-yaml');
const fs = require('fs');

const swagger_tools = require('swagger-tools');

const infra = require('infrastructure');

const config = require('config');

const web = require('web');
const treasurer = require('components/treasurer');
const db = require('components/db');

const bootstrapper = { run };
bootstrapper.run();

/**
 * Config & start the app
 */
async function run() {
    const treasurer_params_validators = config.ajv.config({
        _ajv, infra, mongo_is_valid: mongodb.ObjectID.isValid, schemas: treasurer.params_schemas
    });

    const contexts = {};

    contexts.treasurer = {
        driver: mongodb,
        db_adapter: treasurer.dal,
        is_payable: treasurer.threshold_strategy
    };
    await db.connect(contexts.treasurer, config.mongo);

    contexts.treasurer_aop = {
        infra,
        aop_provider: benalu,
        target: treasurer.model,
        params_validators: treasurer_params_validators
    };
    const treasurer_model_proxy = treasurer.aop.init(contexts.treasurer_aop);

    contexts.app = {
        treasurer: treasurer_model_proxy,
        treasurer_ctx: contexts.treasurer
    };
    contexts.middleware = {
        app: connect, app_ctx: contexts.app, favicon, serve_static, no_cache, cors, json, generate_op_id: uuidv1
    };
    await web.app.config(contexts.middleware);

    const swagger_doc = config.web.swagger.configure_doc({ fs, js_yaml, port: config.web.port, swagger: config.web.swagger });
    contexts.swagger = {
        http, connect, swagger_tools, swagger_doc
    };

    // TODO isn't generic
    const controllers = {
        'treasurer_controller_balance': treasurer.controller.balance,
        'treasurer_controller_deposit': treasurer.controller.deposit,
        'treasurer_controller_withdraw': treasurer.controller.withdraw,
    };

    const swagger_opts = config.web.to_swagger_opts(config.web, controllers);
    return await web.swagger.run(contexts.swagger, swagger_opts, web.server.run);
}


// tid 5ae727e310184a24eabab171


// TODO ask for benalu npm update or post a private npm
// TODO eslint: remove and ban console.console.log();
// TODO eslint: semi? https://eslint.org/docs/rules/semi
// TODO ban string literals, move to config
// TODO play with "javascript.implicitProjectConfig.checkJs": true
