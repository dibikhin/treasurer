//const express = require('express');
const mongodb = require('mongodb');

const account = require('./models/account');
const db = require('./db/db');

//const app = express();

let mdb;
let accounts;

console.info('Starting...');

mongodb.MongoClient.connect('mongodb://localhost:27017/test')
    .then(_db => {
        mdb = _db.db('test');
        accounts = mdb.collection('accounts');
        // const account123 = {
        //   amount: mongodb.Decimal128.fromString('125.125'),
        //   threshold: mongodb.Decimal128.fromString('0.125'),
        //   state: 'active',
        //   deleted: false,
        //   created_at: new Date(),
        //   updated_at: null
        // };
        // mdb.collection('accounts').insertOne(account123);

        console.log('Connected successfully to server');

        const ctx = {
            driver: mongodb,
            db: db,
            collection: accounts
        };

        let params = {
            account_id: '5a885459ef5fa013c0abf723'
        };

        account.balance(ctx, params, (err, balance) => {
            console.info(err || 'no error');
            console.info(balance.toString());

            params.spending = '0.125';

            account.withdraw(ctx, params, (err, acc) => {
                console.info(err || 'no error');
                console.info(acc);

                params.refill = '1.0';

                account.deposit(ctx, params, (err, acc) => {
                    console.info(err || 'no error');
                    console.info(acc);
    
                    process.exit(0);
                });
            });
        });
    })
    .catch(error => console.error('error', error));
