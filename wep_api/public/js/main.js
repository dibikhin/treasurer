export function run_demo(jQuery, document, _) {
    jQuery(document).ready(function run_demo() {
        jQuery.ajaxSetup({
            contentType: 'application/json; charset=utf-8'
        });

        const account_id = '5ae727e310184a24eabab171';

        _demo(account_id);

        setInterval(() => {
            _demo(account_id);
        }, 5000);
    });

    function _demo(account_id) {
        _balance(account_id);
        _deposit(account_id);
        _withdraw(account_id);
    }

    function _balance(account_id) {
        const bound_add_row = _add_row.bind({ operation: 'balance' });
        jQuery
            .get('/v0/treasurer/balance/' + account_id)
            .done(bound_add_row);
    }

    function _deposit(account_id) {
        const deposit_request = { account_id, incoming: 1.25 };
        const deposit_request_json = JSON.stringify(deposit_request);
        const bound_add_row = _add_row.bind({ operation: 'deposit', amount: deposit_request.incoming });

        jQuery
            .post('/v0/treasurer/deposit', deposit_request_json, null, 'json')
            .done(bound_add_row);
    }

    function _withdraw(account_id) {
        const withdraw_request = { account_id, outgoing: 1.25 };
        const withdraw_request_json = JSON.stringify(withdraw_request);
        const bound_add_row = _add_row.bind({ operation: 'withdraw', amount: withdraw_request.outgoing });

        jQuery
            .post('/v0/treasurer/withdraw', withdraw_request_json, null, 'json')
            .done(bound_add_row);
    }

    function _add_row(data) {
        const html_template = '<tr> \
            <td> <%- moment %> </td> \
            <td> <%- operation %> </td> \
            <td> <%- id %> </td> \
            <td> <%- amount %> </td> \
            <td> <%- final_balance %> </td> \
        </tr>';

        const account_brief = data.account_brief;
        const table_row = {
            moment: new Date().toLocaleString(),
            operation: this.operation.toUpperCase(),
            id: account_brief.id,
            amount: this.amount || '-',
            final_balance: account_brief.balance
        };
        const format = _.template(html_template);
        const filled_template = format(table_row);
        jQuery('#ops tr:first').before(filled_template);
    }
}