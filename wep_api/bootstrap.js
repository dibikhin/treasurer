/**
 * Entry point
 * @module bootstrap
 */

const connect = require('connect')();
const swagger_tools = require('swagger-tools');
const js_yaml = require('js-yaml');
const fs = require('fs');

const app = require('./app');
const server = require('./bin/www');

const port = 8080; // TODO config TODO warn on constant

const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swagger_doc = js_yaml.safeLoad(spec);
swagger_doc.host = process.env.NODE_ENV === 'development' ? `localhost:${port}` : swagger_doc.host;

const app_ctx = {
    app: connect,
    swagger_tools,
    swagger_doc,
    run_server: server.run
};

const opts = {
    port,
    swaggerUi: '/swagger.yaml',
    controllers: './controllers',
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

const uuidv1 = require('uuid/v1');
const mongodb = require('mongodb');

const threshold_strategy = require('business_rules/threshold_strategy');
const accounts_db_adapter = require('db/accounts_db_adapter');
const accounts_db_bootstrap = require('db/accounts_db_bootstrap');
const treasurer = require('models/treasurer');

const treasurer_ctx = {
    driver: mongodb,
    db_adapter: accounts_db_adapter,
    is_payable: threshold_strategy
};

const conn_opts = {
    mongo_url: 'mongodb://localhost:27017',
    db_name: 'test',
    collection_name: 'accounts'
};

(async function () {
    try {
        const accounts_col = await accounts_db_bootstrap.init(treasurer_ctx, conn_opts);
        treasurer_ctx.db = { accounts: accounts_col };
    } catch (err) {
        console.error(err);
    }
})();

const app_ctx2 = {
    log: console.log,
    op_id: uuidv1,
    Treasurer: treasurer,
    treasurer_ctx: treasurer_ctx
};

connect.use(function (req, res, next) {
    req.ctx = app_ctx2;
    next();
});

// 5a99b022b0a023125aaaae28

app.run(app_ctx, opts);

// const Ajv = require('ajv');
// const ajv = new Ajv({ allErrors: true });

// const benalu = require('./node_modules/benalu/benalu'); // self built, due to old npm
// const mongodb = require('mongodb');
// // const Cache = require('ttl');

// const treasurer_params_schemas = require('schemas/treasurer_params.json');

// const threshold_strategy = require('business_rules/threshold_strategy');

// // const caching_strategy_factory = require('infrastructure/aspects_factories/caching_strategy_factory');
// const params_validator_factory = require('infrastructure/aspects_factories/params_validator_factory');
// // const error_handling_strategy_factory = require('infrastructure/aspects_factories/error_handling_strategy_factory');

// const is_params_valid = require('infrastructure/advice/params_validator');
// // const error_handling_strategy = require('infrastructure/advice/error_handling_strategy');

// const ajv_helpers = require('infrastructure/ajv/helpers');
// const ajv_add_custom_keywords = require('infrastructure/ajv/custom_keywords');
// // const helpers = require('infrastructure/helpers');

// const accounts_db_adapter_raw = require('db/accounts_db_adapter');
// const accounts_db_bootstrap = require('db/accounts_db_bootstrap');
// // const cache_adapter = require('db/cache_adapter');

// const treasurer_raw = require('models/treasurer');

// console.info('Starting...');

// // const cache = new Cache({ ttl: 30 * 1000 }); // TODO config

// // // order matters, but how? caching_strategy_factory may break next interceptors
// const accounts_db_adapter = benalu
//     .fromInstance(accounts_db_adapter_raw)
//     //     // // TODO config cache 'enabled' option    
//     //     // .addInterception(
//     //     //     caching_strategy_factory({ helpers, cache, cache_adapter }))
//     //     // .addInterception(
//     //     //     error_handling_strategy_factory({ helpers, logger: console }, { error_handling_strategy }))
//     //     // TODO params validation
//     .build();

// ajv_add_custom_keywords({ ajv_helpers, ajv, mongodb });
// // add_keyword(ajv, { keyword: 'is_frozen_deep', is_valid: Object.isFrozenDeep });
// const treasurer_params_validators = ajv_helpers.compile_validators({ ajv, schemas: treasurer_params_schemas });

// const treasurer = benalu
//     .fromInstance(treasurer_raw)
//     .addInterception(
//         params_validator_factory({
//             params_validators: treasurer_params_validators,
//             params_validator_advice: is_params_valid
//         }))
//     //     // .addInterception(
//     //     //     error_handling_strategy_factory({ helpers, logger: console }, { error_handling_strategy }))
//     .build();

// // addInterception validate business rules ?

// // TODO const contexts_manager = {};
// // contexts_manager.treasurer_ctx =
// const treasurer_ctx = {
//     driver: mongodb,
//     db_adapter: accounts_db_adapter,
//     is_payable: threshold_strategy
// };

// const conn_opts = {
//     mongo_url: 'mongodb://localhost:27017',
//     db_name: 'test',
//     collection_name: 'accounts'
// };

// (async function () {
//     try {
//         const accounts_col = await accounts_db_bootstrap.init(treasurer_ctx, conn_opts);
//         await run_test(accounts_col);
//     } catch (err) {
//         console.log(err);
//     }
// })();

// async function run_test(accounts_col) {
//     treasurer_ctx.db = { accounts: accounts_col };

//     const op_id = uuidv1();

//     const balance_params = Object.freeze({
//         account_id: '5a99b022b0a023125aaaae28',
//         op_id
//     });

//     let data = await treasurer.balance(treasurer_ctx, balance_params);
//     if (!data) {
//         console.error('Nothing found');
//         console.error(balance_params);
//         process.exit(0);
//     }
//     console.info('b1=' + data.value.balance.toString());

//     const withdraw_params = Object.freeze({ account_id: balance_params.account_id, outgoing: '0.125', op_id });
//     data = await treasurer.withdraw(treasurer_ctx, withdraw_params);

//     console.info(data.value.balance.toString());

//     setTimeout(async () => {
//         data = await treasurer.balance(treasurer_ctx, balance_params);

//         console.info('b2=' + data.value.balance.toString());

//         const deposit_params = Object.freeze({ account_id: balance_params.account_id, incoming: '1.0', op_id });
//         data = await treasurer.deposit(treasurer_ctx, deposit_params);

//         console.info(data.value.balance.toString());

//         data = await treasurer.balance(treasurer_ctx, balance_params);

//         console.info('b3=' + data.value.balance.toString());

//         const transfer_params = Object.freeze({
//             from: '5a99b022b0a023125aaaae28',
//             to: '5a9a954f24ca261c2e2fc032',
//             tranche: '0.5',
//             op_id
//         });
//         data = await treasurer.transfer(treasurer_ctx, transfer_params);
//         console.info(data.from.value.balance.toString());
//         console.info(data.to.value.balance.toString());

//         console.info('Finished.');
//         process.exit(0);
//     }, 1000);
// }

// // .then(() => {
// //     const account123 = {
// //         balance: ctx.driver.Decimal128.fromString('125.125'),
// //         threshold: ctx.driver.Decimal128.fromString('0.125'),
// //         state: 'active',
// //         deleted: false,
// //         created_at: new Date(),
// //         updated_at: new Date()
// //     };
// //     ctx.accounts.insertOne(account123);
// // })