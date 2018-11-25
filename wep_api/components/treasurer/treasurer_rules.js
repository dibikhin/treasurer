module.exports = {
    is_account_payable,
    is_transfer_parties_differ
}

function is_account_payable({ account, outgoing }) {
    const balance = parseFloat(account.balance)
    const threshold = parseFloat(account.threshold)
    return balance - parseFloat(outgoing) > threshold
}

function is_transfer_parties_differ({ from, to }) {
    return from !== to
}