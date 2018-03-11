
function deposit_rule (invocation) {
    cache.delete([invocation['1'].account_id]);
    invocation.proceed();
};