const benalu = require('benalu');
const mongodb = require('mongodb');

const create_callback_advice = require('infrastructure/advice/callback_advice');
const is_callback_valid = require('infrastructure/aspects/callback_validator');

const helpers = require('infrastructure/helpers');

const accounts_raw = require('models/accounts');
const accounts_db_adapter_raw = require('db/accounts_db_adapter');

console.info('Starting...');

// const context_manager = {};
// context_manager.accounts_ctx =
const accounts_ctx = {
    driver: mongodb,
    db_adapter: accounts_db_adapter_raw
};

// config.js > mongo_config.js
const conn_opts = {
    mongo_url: 'mongodb://localhost:27017',
    db_name: 'test',
    collection_name: 'accounts'
};

accounts_db_adapter_raw
    .init(accounts_ctx, conn_opts)
    .then(run_test)
    .catch(err => {
        console.error('error', err);
        process.exit(0);
    });

function run_test(accounts_col) {
    accounts_ctx.db = { accounts: accounts_col };

    let params = {
        account_id: '5a99b022b0a023125aaaae28' // mongodb.ObjectID.isValid('zxcv');
    };

    const accounts = benalu
        .fromInstance(accounts_raw)
        .addInterception(create_callback_advice(is_callback_valid))
        .build();

    // addInterception validate business rules

    accounts.balance(accounts_ctx, params, (err, data) => {
        if (err) {
            console.error(err);
        }
        console.info(data.value.balance.toString());

        params.outgoing = '0.125';
        accounts.withdraw(accounts_ctx, params, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.info(data.value.balance.toString());

            params.outgoing = null;
            params.incoming = '1.0';
            accounts.deposit(accounts_ctx, params, (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.info(data.value.balance.toString());

                params = {
                    from: '5a99b022b0a023125aaaae28',
                    to: '5a9a954f24ca261c2e2fc032',
                    tranche: '0.5'
                };
                accounts.transfer(accounts_ctx, params, (err, data) => {
                    console.info(data.from.value.balance.toString());
                    console.info(data.to.value.balance.toString());

                    console.info('Finished.');
                    process.exit(0);
                });
            });
        });
    });
}
