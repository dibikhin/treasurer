
// const Cache = require('ttl');
// const caching_strategy_factory = require('infrastructure/aspects_factories/caching_strategy_factory');
// const error_handling_strategy_factory = require('infrastructure/aspects_factories/error_handling_strategy_factory');

// const error_handling_strategy = require('infrastructure/advice/error_handling_strategy');

// const helpers = require('infrastructure/helpers');

// const cache_adapter = require('db/cache_adapter');

// const cache = new Cache({ ttl: 30 * 1000 });

// order matters, but how? caching_strategy_factory may break next interceptors
// const accounts_db_adapter = benalu
//     .fromInstance(accounts_db_adapter_raw)
// // config cache 'enabled' option
// .addInterception(
//     caching_strategy_factory({ helpers, cache, cache_adapter }))
// .addInterception(
//     error_handling_strategy_factory({ helpers, logger: console }, { error_handling_strategy }))
//     .build();

// async function run_test(accounts_col) {
//     treasurer_ctx.db = { accounts: accounts_col };

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
