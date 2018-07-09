export function run_demo(jQuery, document, _, opts) {
    jQuery(document).ready(function run_demo() {
        jQuery.ajaxSetup({
            contentType: 'application/json; charset=utf-8'
        })

        _demo(opts.account_ids[0])

        const run_demo = account_id => {
            setInterval(() => {
                _demo(account_id)
                _deposit(account_id)
                _deposit(account_id)
            }, _.sample([11000, 17000]))
        }
        opts.account_ids.forEach(run_demo)

        const run_transfer_demo = account_ids => {
            _transfer_demo(account_ids)

            setInterval(() => {
                _transfer_demo(account_ids)
            }, 3000)
            setInterval(() => {
                _transfer_demo(account_ids.slice().reverse())
            }, 5000)
        }
        run_transfer_demo(opts.account_ids)
    })

    function _demo(account_id) {
        _balance(account_id)
        _deposit(account_id)
        _withdraw(account_id)
    }

    function _transfer_demo(account_ids) {
        _transfer(account_ids)
    }

    function _balance(account_id) {
        const bound_add_row = _add_row.bind({ operation: 'balance' })
        jQuery
            .get('/v0/treasurer/balance/' + account_id)
            .done(bound_add_row)
    }

    function _deposit(account_id) {
        const deposit_request = { account_id, incoming: _rand_value() }
        const deposit_request_json = JSON.stringify(deposit_request)
        const bound_add_row = _add_row.bind({ operation: 'deposit', amount: deposit_request.incoming })

        jQuery
            .post('/v0/treasurer/deposit', deposit_request_json, null, 'json')
            .done(bound_add_row)
    }

    function _withdraw(account_id) {
        const withdraw_request = { account_id, outgoing: _rand_value() }
        const withdraw_request_json = JSON.stringify(withdraw_request)
        const bound_add_row = _add_row.bind({ operation: 'withdraw', amount: withdraw_request.outgoing })

        jQuery
            .post('/v0/treasurer/withdraw', withdraw_request_json, null, 'json')
            .done(bound_add_row)
    }

    function _transfer(account_ids) {
        const transfer_request = {
            from: account_ids[0],
            to: account_ids[1],
            tranche: _rand_value()
        }
        const transfer_request_json = JSON.stringify(transfer_request)
        const bound_add_row = _add_row.bind({ operation: 'transfer', amount: transfer_request.tranche })

        jQuery
            .post('/v0/treasurer/transfer', transfer_request_json, null, 'json')
            .done(bound_add_row)
    }

    function _add_row(data, __, request) {
        const html_template = '<tr> \
            <td> <%- moment %> </td> \
            <td> <%- op_id %> </td> \
            <td> <%- operation %> </td> \
            <td> <%- id_from %> </td> \
            <td> <%= id_to %> </td> \
            <td> <%= amount %> </td> \
            <td> <%- balance_from %> </td> \
            <td> <%= balance_to %> </td> \
            <td> <%= currency %> </td> \
        </tr> '

        const table_row = {
            moment: new Date().toLocaleString(),
            op_id: request.getResponseHeader('X-Request-ID').replace(/^(.{6}).+(.{4})$/, '$1…$2'),
            operation: this.operation.toUpperCase(), // opts.ops_abbrs[this.operation].toUpperCase(),
            id_from: ((data.from && data.from.account_brief) || data.account_brief).id.toString().replace(/^(.{4}).+(.{6})$/, '$1…$2'),
            id_to: (((data.to && data.to.account_brief) || { id: null }).id || '&mdash;').toString().replace(/^(.{4}).+(.{6})$/, '$1…$2'),
            amount: this.amount || '&mdash;',
            balance_from: ((data.from && data.from.account_brief) || data.account_brief).balance,
            balance_to: ((data.to && data.to.account_brief) || { balance: null }).balance || '&mdash;',
            currency: ((data.from && data.from.account_brief) || data.account_brief).currency
        }
        const format = _.template(html_template)
        const filled_template = format(table_row)
        jQuery('#ops tr:first').before(filled_template)
    }

    function _rand_value() {
        return _.sample([1.125, 2, 3.7])
    }
}
