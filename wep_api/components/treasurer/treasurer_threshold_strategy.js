module.exports = threshold_strategy

function threshold_strategy({ account }) {
    const balance = parseFloat(account.balance)
    const threshold = parseFloat(account.threshold)
    return balance > threshold
}
