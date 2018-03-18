"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var core_1 = require("./core");
var MethodInvocation = /** @class */ (function (_super) {
    __extends(MethodInvocation, _super);
    function MethodInvocation(original, memberName, parameters) {
        var _this = _super.call(this) || this;
        _this.original = original;
        _this.memberName = memberName;
        _this.parameters = parameters;
        _this.memberType = "method";
        return _this;
    }
    MethodInvocation.prototype.proceed = function () {
        return this.original[this.memberName].apply(this.original, this.parameters);
    };
    return MethodInvocation;
}(core_1.Invocation));
exports.MethodInvocation = MethodInvocation;
var GetterInvocation = /** @class */ (function (_super) {
    __extends(GetterInvocation, _super);
    function GetterInvocation(value, memberName) {
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.memberName = memberName;
        _this.memberType = "getter";
        return _this;
    }
    GetterInvocation.prototype.proceed = function () {
        return this.value;
    };
    return GetterInvocation;
}(core_1.Invocation));
exports.GetterInvocation = GetterInvocation;
var InterceptorInvocation = /** @class */ (function (_super) {
    __extends(InterceptorInvocation, _super);
    function InterceptorInvocation(next, interceptor) {
        var _this = _super.call(this) || this;
        _this.next = next;
        _this.interceptor = interceptor;
        _this.memberName = next.memberName;
        _this.parameters = next.parameters;
        _this.memberType = next.memberType;
        return _this;
    }
    InterceptorInvocation.prototype.proceed = function () {
        return this.interceptor(this.next);
    };
    return InterceptorInvocation;
}(core_1.Invocation));
exports.InterceptorInvocation = InterceptorInvocation;
