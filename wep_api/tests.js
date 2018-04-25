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