module.exports = threshold_strategy;

function threshold_strategy(params) {
    const balance = parseFloat(params.account.balance);
    const threshold = parseFloat(params.account.threshold);
    return balance > threshold;
}