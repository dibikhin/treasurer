export function run_demo(jQuery, document, _, opts) {
    jQuery(document).ready(function run_demo() {
        jQuery.ajaxSetup({
            contentType: 'application/json; charset=utf-8'
        })
        const run_demo = account_id => {
            _demo(account_id)

            setInterval(() => {
                _demo(account_id)
            }, 5000)
        }
        opts.account_ids.forEach(run_demo)
    })

    function _demo(account_id) {
        _balance(account_id)
        _deposit(account_id)
        _withdraw(account_id)
    }

    function _balance(account_id) {
        const bound_add_row = _add_row.bind({ operation: 'balance' })
        jQuery
            .get('/v0/treasurer/balance/' + account_id)
            .done(bound_add_row)
    }

    function _deposit(account_id) {
        const deposit_request = { account_id, incoming: 1.25 }
        const deposit_request_json = JSON.stringify(deposit_request)
        const bound_add_row = _add_row.bind({ operation: 'deposit', amount: deposit_request.incoming })

        jQuery
            .post('/v0/treasurer/deposit', deposit_request_json, null, 'json')
            .done(bound_add_row)
    }

    function _withdraw(account_id) {
        const withdraw_request = { account_id, outgoing: 1.25 }
        const withdraw_request_json = JSON.stringify(withdraw_request)
        const bound_add_row = _add_row.bind({ operation: 'withdraw', amount: withdraw_request.outgoing })

        jQuery
            .post('/v0/treasurer/withdraw', withdraw_request_json, null, 'json')
            .done(bound_add_row)
    }

    function _add_row({ account_brief }, __, request) {
        const html_template = '<tr> \
            <td> <%- moment %> </td> \
            <td> <%- op_id %> </td> \
            <td> <%- operation %> </td> \
            < td > <% - id_from %> </td> \
            <td> <%= id_to %> </td> \
            <td> <%= amount %> </td> \
            <td> <%- balance_from %> </td> \
            <td> <%= balance_to %> </td> \
        </tr >'

        const table_row = {
            moment: new Date().toLocaleString(),
            op_id: request.getResponseHeader('X-Request-ID').replace(/^(.{6}).+(.{4})$/, '$1…$2'),
            operation: opts.ops_abbrs[this.operation].toUpperCase(),
            id_from: account_brief.id.replace(/^(.{4}).+(.{6})$/, '$1…$2'),
            id_to: '&mdash;',
            amount: this.amount || '&mdash;',
            balance_from: account_brief.balance,
            balance_to: '&mdash;'
        }
        const format = _.template(html_template)
        const filled_template = format(table_row)
        jQuery('#ops tr:first').before(filled_template)
    }
}
