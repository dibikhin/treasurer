const benalu = require('benalu');
const mongodb = require('mongodb');

const create_callback_advice = require('infrastructure/advice/callback_advice');
const is_callback_valid = require('infrastructure/aspects/callback_validator');

const helpers = require('infrastructure/helpers');

const generic_factory = require('infrastructure/factories/generic_factory');

const accounts_model_module = require('models/accounts');
const accounts_db_adapter = require('db/accounts_db_adapter');

const accounts_db = generic_factory({
    helpers: helpers,
    module: accounts_db_adapter,
    target_context: {
        driver: mongodb
    }
});

console.info('Starting...');

accounts_db
    .init({
        mongo_url: 'mongodb://localhost:27017',
        db_name: 'test',
        collection_name: 'accounts'
    })
    .then(run)
    .catch(err => {
        console.error('error', err);
        process.exit(0);
    });

function run() {
    const accounts_unwrapped = generic_factory({
        helpers: helpers,
        module: accounts_model_module,
        target_context: {
            db: accounts_db
        }
    });

    let params = {
        account_id: '5a885459ef5fa013c0abf723' // mongodb.ObjectID.isValid('zxcv');
    };

    const accounts = benalu
        .fromInstance(accounts_unwrapped)
        .addInterception(create_callback_advice(is_callback_valid))
        .build();

    accounts.balance(params, (err, balance) => {
        if (err) {
            console.error(err);
        }
        console.info(balance.toString());
        params.spending = '0.125';
        accounts.withdraw(params, (err, acc) => {
            if (err) {
                console.error(err);
            }
            console.info(acc.value.amount.toString());
            params.spending = null;
            params.refill = '1.0';
            accounts.deposit(params, (err, acc) => {
                if (err) {
                    console.error(err);
                }
                console.info(acc.value.amount.toString());
                console.info('Finished.');
                process.exit(0);
            });
        });
    });
}
