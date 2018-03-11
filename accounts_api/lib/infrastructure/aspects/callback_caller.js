module.exports = interceptor;

function interceptor(target, that, args) {
    console.log(args);
    return target.apply(null, args);
}