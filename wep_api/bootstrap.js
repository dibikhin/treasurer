/**
 * Entry point
 * @module bootstrap
 */

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const benalu = require('benalu/benalu'); // self built, due to old npm
const mongodb = require('mongodb');
const Cache = require('ttl');

const accounts_params_schemas = require('schemas/accounts_params.json');

const threshold_strategy = require('business_rules/threshold_strategy');

const caching_strategy_factory = require('infrastructure/aspects_factories/caching_strategy_factory');
const callback_validator_factory = require('infrastructure/aspects_factories/callback_validator_factory');
const params_validator_factory = require('infrastructure/aspects_factories/params_validator_factory');

const is_callback_valid = require('infrastructure/advice/callback_validator');
const is_params_valid = require('infrastructure/advice/params_validator');
const caching_strategy = require('infrastructure/advice/caching_strategy');

const ajv_helpers = require('infrastructure/ajv_helpers');
const helpers = require('infrastructure/helpers');

const accounts_db_adapter_raw = require('db/accounts_db_adapter');
const accounts_db_bootstrap = require('db/accounts_db_bootstrap');

const accounts_raw = require('models/accounts');

console.info('Starting...');

// TODO find lazy (on call expiry) cache w/ function caching & callback substitution
const cache = new Cache({ ttl: 30 * 1000 }); // TODO config

const accounts_db_adapter = benalu
    .fromInstance(accounts_db_adapter_raw)
    .addInterception(callback_validator_factory({ helpers }, is_callback_valid)) // TODO config cache 'enabled' option
    // order matters, but how? caching_strategy_factory may break next interceptors
    .addInterception(caching_strategy_factory({ helpers, cache }, { caching_strategy }))
    .addInterception((invocation) => {
        function callback_interceptor(target, that, args) {
            const err = args[0];
            if (err) {
                console.log(err);
            }
            return target.apply(null, args);
        }

        const callback = helpers.get_callback(invocation.parameters);
        const wrapped_callback = wrap_function(callback, interceptor);
        helpers.set_callback(invocation.parameters, callback_interceptor);
    })
    .build();

// TODO move to custom_keywords.js
ajv_helpers.add_keyword(ajv, {
    keyword: 'mongo_object_id',
    is_valid: mongodb.ObjectID.isValid
});

ajv_helpers.add_keyword(ajv, {
    keyword: 'is_frozen',
    is_valid: Object.isFrozen
});

// add_keyword(ajv, { keyword: 'is_frozen_deep', is_valid: Object.isFrozenDeep });

const accounts_params_validators = ajv_helpers.compile_validators({ ajv, schemas: accounts_params_schemas });

// TODO 'accounts' -> 'treasurer'

const accounts = benalu
    .fromInstance(accounts_raw)
    .addInterception(callback_validator_factory({ helpers }, is_callback_valid))
    .addInterception(params_validator_factory({ params_validators: accounts_params_validators }, is_params_valid))
    .build();

// addInterception validate business rules ?

// TODO const contexts_manager = {};
// contexts_manager.accounts_ctx =
const accounts_ctx = {
    driver: mongodb,
    db_adapter: accounts_db_adapter,
    is_payable: threshold_strategy
};

// TODO config.js > mongo_config.js
const conn_opts = {
    mongo_url: 'mongodb://localhost:27017',
    db_name: 'test',
    collection_name: 'accounts'
};

accounts_db_bootstrap
    .init(accounts_ctx, conn_opts)
    .then(run_test)
    .catch(err => {
        console.error('error', err);
        process.exit(0);
    });

function run_test(accounts_col) {
    accounts_ctx.db = { accounts: accounts_col };

    const balance_params = Object.freeze({
        account_id: '5a99b022b0a023125aaaae28'
    });

    accounts.balance(accounts_ctx, balance_params, (err, data) => {
        if (err) { console.error(err); process.exit(0); }
        console.info('b1=' + data.value.balance.toString());

        const withdraw_params = Object.freeze({ account_id: balance_params.account_id, outgoing: '0.125' });
        accounts.withdraw(accounts_ctx, withdraw_params, (err, data) => {
            if (err) { console.error(err); process.exit(0); }
            console.info(data.value.balance.toString());

            setTimeout(() => {
                accounts.balance(accounts_ctx, balance_params, (err, data) => {
                    if (err) { console.error(err); process.exit(0); }
                    console.info('b2=' + data.value.balance.toString());

                    const deposit_params = Object.freeze({ account_id: balance_params.account_id, incoming: '1.0' });
                    accounts.deposit(accounts_ctx, deposit_params, (err, data) => {
                        if (err) { console.error(err); process.exit(0); }
                        console.info(data.value.balance.toString());

                        accounts.balance(accounts_ctx, balance_params, (err, data) => {
                            if (err) { console.error(err); process.exit(0); }
                            console.info('b3=' + data.value.balance.toString());

                            const transfer_params = Object.freeze({
                                from: '5a99b022b0a023125aaaae28',
                                to: '5a9a954f24ca261c2e2fc032',
                                tranche: '0.5'
                            });
                            accounts.transfer(accounts_ctx, transfer_params, (err, data) => {
                                console.info(data.from.value.balance.toString());
                                console.info(data.to.value.balance.toString());

                                console.info('Finished.');
                                process.exit(0);
                            });
                        });
                    });
                });
            }, 1000);
        });
    });
}
