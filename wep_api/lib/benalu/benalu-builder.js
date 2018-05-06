'use strict';
exports.__esModule = true;
var invocations_1 = require('./invocations');
var BenaluBuilder = /** @class */ (function () {
    function BenaluBuilder(origin) {
        this.intercepts = [];
        this.origin = origin;
    }
    BenaluBuilder.prototype.addInterception = function (interception) {
        this.intercepts.push(interception);
        return this;
    };
    BenaluBuilder.prototype.build = function () {
        return new Proxy(this.origin, (function (origin, interceptors) {
            return {
                get: function (target, propKey) {
                    var propValue = target[propKey];
                    if (typeof propValue != 'function') {
                        var invocation_1 = new invocations_1.GetterInvocation(propValue, propKey.toString());
                        interceptors.forEach(function (x) {
                            invocation_1 = new invocations_1.InterceptorInvocation(invocation_1, x);
                        });
                        return invocation_1.proceed();
                    }
                    else {
                        return function () {
                            var invocation = new invocations_1.MethodInvocation(origin, propKey.toString(), arguments);
                            interceptors.forEach(function (x) {
                                invocation = new invocations_1.InterceptorInvocation(invocation, x);
                            });
                            return invocation.proceed();
                        };
                    }
                }
            };
        })(this.origin, this.intercepts.reverse()));
    };
    return BenaluBuilder;
}());
exports.BenaluBuilder = BenaluBuilder;
