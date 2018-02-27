const mongodb = require('mongodb');

const helpers = require('./infrastructure/helpers');

const accounts_db_factory = require('./infrastructure/accounts_db_factory');
const accounts_model_factory = require('./infrastructure/accounts_model_factory');

const accounts_model_module = require('./models/accounts');
const accounts_db_module = require('./db/accounts');

const accounts_db = accounts_db_factory({
    helpers: helpers,
    driver: mongodb,
    module: accounts_db_module
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
    const accounts = accounts_model_factory({
        helpers: helpers,
        db: accounts_db,
        module: accounts_model_module
    });
    let params = {
        account_id: '5a885459ef5fa013c0abf723'
    };
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
