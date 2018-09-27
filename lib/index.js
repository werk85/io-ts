"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
var Type = /** @class */ (function () {
    function Type(
    /** a unique name for this runtime type */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate, 
    /** converts a value of type A to a value of type O */
    encode) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
    }
    Type.prototype.pipe = function (ab, name) {
        var _this = this;
        return new Type(name || "pipe(" + this.name + ", " + ab.name + ")", ab.is, function (i, c) {
            var validation = _this.validate(i, c);
            if (validation.isLeft()) {
                return validation;
            }
            else {
                return ab.validate(validation.value, c);
            }
        }, this.encode === exports.identity && ab.encode === exports.identity ? exports.identity : function (b) { return _this.encode(ab.encode(b)); });
    };
    Type.prototype.asDecoder = function () {
        return this;
    };
    Type.prototype.asEncoder = function () {
        return this;
    };
    /** a version of `validate` with a default context */
    Type.prototype.decode = function (i) {
        return this.validate(i, exports.getDefaultContext(this));
    };
    return Type;
}());
exports.Type = Type;
exports.identity = function (a) { return a; };
exports.getFunctionName = function (f) {
    return f.displayName || f.name || "<function" + f.length + ">";
};
exports.getContextEntry = function (key, type) { return ({ key: key, type: type }); };
exports.getValidationError = function (value, context) { return ({ value: value, context: context }); };
exports.getDefaultContext = function (type) { return [{ key: '', type: type }]; };
exports.appendContext = function (c, key, type) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key: key, type: type };
    return r;
};
exports.failures = function (errors) { return new Either_1.Left(errors); };
exports.failure = function (value, context) {
    return exports.failures([exports.getValidationError(value, context)]);
};
exports.success = function (value) { return new Either_1.Right(value); };
var pushAll = function (xs, ys) {
    var l = ys.length;
    for (var i = 0; i < l; i++) {
        xs.push(ys[i]);
    }
};
//
// basic types
//
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', function (m) { return m === null; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
exports.NullType = NullType;
/** @alias `null` */
exports.nullType = new NullType();
exports.null = exports.nullType;
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', function (m) { return m === void 0; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
exports.UndefinedType = UndefinedType;
var undefinedType = new UndefinedType();
exports.undefined = undefinedType;
var VoidType = /** @class */ (function (_super) {
    __extends(VoidType, _super);
    function VoidType() {
        var _this = _super.call(this, 'void', undefinedType.is, undefinedType.validate, exports.identity) || this;
        _this._tag = 'VoidType';
        return _this;
    }
    return VoidType;
}(Type));
exports.VoidType = VoidType;
/** @alias `void` */
exports.voidType = new VoidType();
exports.void = exports.voidType;
var AnyType = /** @class */ (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        var _this = _super.call(this, 'any', function (_) { return true; }, exports.success, exports.identity) || this;
        _this._tag = 'AnyType';
        return _this;
    }
    return AnyType;
}(Type));
exports.AnyType = AnyType;
exports.any = new AnyType();
var NeverType = /** @class */ (function (_super) {
    __extends(NeverType, _super);
    function NeverType() {
        var _this = _super.call(this, 'never', function (_) { return false; }, function (m, c) { return exports.failure(m, c); }, 
        /* istanbul ignore next */
        function () {
            throw new Error('cannot encode never');
        }) || this;
        _this._tag = 'NeverType';
        return _this;
    }
    return NeverType;
}(Type));
exports.NeverType = NeverType;
exports.never = new NeverType();
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', function (m) { return typeof m === 'string'; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
exports.StringType = StringType;
exports.string = new StringType();
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', function (m) { return typeof m === 'number'; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
exports.NumberType = NumberType;
exports.number = new NumberType();
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', function (m) { return typeof m === 'boolean'; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
exports.BooleanType = BooleanType;
exports.boolean = new BooleanType();
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'Array', Array.isArray, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
exports.AnyArrayType = AnyArrayType;
var arrayType = new AnyArrayType();
exports.Array = arrayType;
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'Dictionary', function (m) { return m !== null && typeof m === 'object'; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
exports.AnyDictionaryType = AnyDictionaryType;
exports.Dictionary = new AnyDictionaryType();
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType() {
        var _this = _super.call(this, 'object', exports.Dictionary.is, exports.Dictionary.validate, exports.identity) || this;
        _this._tag = 'ObjectType';
        return _this;
    }
    return ObjectType;
}(Type));
exports.ObjectType = ObjectType;
exports.object = new ObjectType();
var FunctionType = /** @class */ (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType() {
        var _this = _super.call(this, 'Function', 
        // tslint:disable-next-line:strict-type-predicates
        function (m) { return typeof m === 'function'; }, function (m, c) { return (_this.is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity) || this;
        _this._tag = 'FunctionType';
        return _this;
    }
    return FunctionType;
}(Type));
exports.FunctionType = FunctionType;
exports.Function = new FunctionType();
//
// refinements
//
var RefinementType = /** @class */ (function (_super) {
    __extends(RefinementType, _super);
    function RefinementType(name, is, validate, encode, type, predicate) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this.predicate = predicate;
        _this._tag = 'RefinementType';
        return _this;
    }
    return RefinementType;
}(Type));
exports.RefinementType = RefinementType;
exports.refinement = function (type, predicate, name) {
    if (name === void 0) { name = "(" + type.name + " | " + exports.getFunctionName(predicate) + ")"; }
    return new RefinementType(name, function (m) { return type.is(m) && predicate(m); }, function (i, c) {
        var validation = type.validate(i, c);
        if (validation.isLeft()) {
            return validation;
        }
        else {
            var a = validation.value;
            return predicate(a) ? exports.success(a) : exports.failure(a, c);
        }
    }, type.encode, type, predicate);
};
exports.Integer = exports.refinement(exports.number, function (n) { return n % 1 === 0; }, 'Integer');
//
// literals
//
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, validate, encode, value) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.value = value;
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
exports.LiteralType = LiteralType;
exports.literal = function (value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (m) { return m === value; };
    return new LiteralType(name, is, function (m, c) { return (is(m) ? exports.success(value) : exports.failure(m, c)); }, exports.identity, value);
};
//
// keyof
//
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, validate, encode, keys) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.keys = keys;
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
exports.KeyofType = KeyofType;
exports.keyof = function (keys, name) {
    if (name === void 0) { name = "(keyof " + JSON.stringify(Object.keys(keys)) + ")"; }
    var is = function (m) { return exports.string.is(m) && keys.hasOwnProperty(m); };
    return new KeyofType(name, is, function (m, c) { return (is(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity, keys);
};
//
// recursive types
//
var RecursiveType = /** @class */ (function (_super) {
    __extends(RecursiveType, _super);
    function RecursiveType(name, is, validate, encode, runDefinition) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.runDefinition = runDefinition;
        _this._tag = 'RecursiveType';
        return _this;
    }
    Object.defineProperty(RecursiveType.prototype, "type", {
        get: function () {
            return this.runDefinition();
        },
        enumerable: true,
        configurable: true
    });
    return RecursiveType;
}(Type));
exports.RecursiveType = RecursiveType;
exports.recursion = function (name, definition) {
    var cache;
    var runDefinition = function () {
        if (!cache) {
            cache = definition(Self);
        }
        return cache;
    };
    var Self = new RecursiveType(name, function (m) { return runDefinition().is(m); }, function (m, c) { return runDefinition().validate(m, c); }, function (a) { return runDefinition().encode(a); }, runDefinition);
    return Self;
};
//
// arrays
//
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
exports.array = function (type, name) {
    if (name === void 0) { name = "Array<" + type.name + ">"; }
    return new ArrayType(name, function (m) { return arrayType.is(m) && m.every(type.is); }, function (m, c) {
        var arrayValidation = arrayType.validate(m, c);
        if (arrayValidation.isLeft()) {
            return arrayValidation;
        }
        else {
            var xs = arrayValidation.value;
            var len = xs.length;
            var a = xs;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var x = xs[i];
                var validation = type.validate(x, exports.appendContext(c, String(i), type));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var vx = validation.value;
                    if (vx !== x) {
                        if (a === xs) {
                            a = xs.slice();
                        }
                        a[i] = vx;
                    }
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        }
    }, type.encode === exports.identity ? exports.identity : function (a) { return a.map(type.encode); }, type);
};
//
// interfaces
//
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
exports.InterfaceType = InterfaceType;
var getNameFromProps = function (props) {
    return "{ " + Object.keys(props)
        .map(function (k) { return k + ": " + props[k].name; })
        .join(', ') + " }";
};
var useIdentity = function (types, len) {
    for (var i = 0; i < len; i++) {
        if (types[i].encode !== exports.identity) {
            return false;
        }
    }
    return true;
};
/** @alias `interface` */
exports.type = function (props, name) {
    if (name === void 0) { name = getNameFromProps(props); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new InterfaceType(name, function (m) {
        if (!exports.Dictionary.is(m)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            if (!types[i].is(m[keys[i]])) {
                return false;
            }
        }
        return true;
    }, function (m, c) {
        var dictionaryValidation = exports.Dictionary.validate(m, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var o = dictionaryValidation.value;
            var a = o;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ok = o[k];
                var type_1 = types[i];
                var validation = type_1.validate(ok, exports.appendContext(c, k, type_1));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var vok = validation.value;
                    if (vok !== ok) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vok;
                    }
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        }
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var encode = types[i].encode;
                if (encode !== exports.identity) {
                    s[k] = encode(a[k]);
                }
            }
            return s;
        }, props);
};
exports.interface = exports.type;
//
// partials
//
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
exports.PartialType = PartialType;
exports.partial = function (props, name) {
    if (name === void 0) { name = "PartialType<" + getNameFromProps(props) + ">"; }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    var partials = {};
    for (var i = 0; i < len; i++) {
        partials[keys[i]] = exports.union([types[i], undefinedType]);
    }
    var partial = exports.type(partials);
    return new PartialType(name, partial.is, partial.validate, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                if (ak !== undefined) {
                    s[k] = types[i].encode(ak);
                }
            }
            return s;
        }, props);
};
//
// dictionaries
//
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, validate, encode, domain, codomain) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
exports.DictionaryType = DictionaryType;
exports.dictionary = function (domain, codomain, name) {
    if (name === void 0) { name = "{ [K in " + domain.name + "]: " + codomain.name + " }"; }
    return new DictionaryType(name, function (m) {
        return exports.Dictionary.is(m) && Object.keys(m).every(function (k) { return domain.is(k) && codomain.is(m[k]); });
    }, function (m, c) {
        var dictionaryValidation = exports.Dictionary.validate(m, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var o = dictionaryValidation.value;
            var a = {};
            var errors = [];
            var keys = Object.keys(o);
            var len = keys.length;
            var changed = false;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ok = o[k];
                var domainValidation = domain.validate(k, exports.appendContext(c, k, domain));
                var codomainValidation = codomain.validate(ok, exports.appendContext(c, k, codomain));
                if (domainValidation.isLeft()) {
                    pushAll(errors, domainValidation.value);
                }
                else {
                    var vk = domainValidation.value;
                    changed = changed || vk !== k;
                    k = vk;
                }
                if (codomainValidation.isLeft()) {
                    pushAll(errors, codomainValidation.value);
                }
                else {
                    var vok = codomainValidation.value;
                    changed = changed || vok !== ok;
                    a[k] = vok;
                }
            }
            return errors.length ? exports.failures(errors) : exports.success((changed ? a : o));
        }
    }, domain.encode === exports.identity && codomain.encode === exports.identity
        ? exports.identity
        : function (a) {
            var s = {};
            var keys = Object.keys(a);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                s[String(domain.encode(k))] = codomain.encode(a[k]);
            }
            return s;
        }, domain, codomain);
};
//
// unions
//
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
exports.UnionType = UnionType;
exports.union = function (types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' | ') + ")"; }
    var len = types.length;
    return new UnionType(name, function (m) { return types.some(function (type) { return type.is(m); }); }, function (m, c) {
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_2 = types[i];
            var validation = type_2.validate(m, exports.appendContext(c, String(i), type_2));
            if (validation.isRight()) {
                return validation;
            }
            else {
                pushAll(errors, validation.value);
            }
        }
        return exports.failures(errors);
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var i = 0;
            for (; i < len - 1; i++) {
                var type_3 = types[i];
                if (type_3.is(a)) {
                    return type_3.encode(a);
                }
            }
            return types[i].encode(a);
        }, types);
};
//
// intersections
//
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
exports.IntersectionType = IntersectionType;
function intersection(types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' & ') + ")"; }
    var len = types.length;
    return new IntersectionType(name, function (m) { return types.every(function (type) { return type.is(m); }); }, function (m, c) {
        var a = m;
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_4 = types[i];
            var validation = type_4.validate(a, c);
            if (validation.isLeft()) {
                pushAll(errors, validation.value);
            }
            else {
                a = validation.value;
            }
        }
        return errors.length ? exports.failures(errors) : exports.success(a);
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = a;
            for (var i = 0; i < len; i++) {
                var type_5 = types[i];
                s = type_5.encode(s);
            }
            return s;
        }, types);
}
exports.intersection = intersection;
//
// tuples
//
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
exports.TupleType = TupleType;
function tuple(types, name) {
    if (name === void 0) { name = "[" + types.map(function (type) { return type.name; }).join(', ') + "]"; }
    var len = types.length;
    return new TupleType(name, function (m) { return arrayType.is(m) && m.length === len && types.every(function (type, i) { return type.is(m[i]); }); }, function (m, c) {
        var arrayValidation = arrayType.validate(m, c);
        if (arrayValidation.isLeft()) {
            return arrayValidation;
        }
        else {
            var as = arrayValidation.value;
            var t = as;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var a = as[i];
                var type_6 = types[i];
                var validation = type_6.validate(a, exports.appendContext(c, String(i), type_6));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var va = validation.value;
                    if (va !== a) {
                        /* istanbul ignore next */
                        if (t === as) {
                            t = as.slice();
                        }
                        t[i] = va;
                    }
                }
            }
            if (as.length > len) {
                errors.push(exports.getValidationError(as[len], exports.appendContext(c, String(len), exports.never)));
            }
            return errors.length ? exports.failures(errors) : exports.success(t);
        }
    }, useIdentity(types, len) ? exports.identity : function (a) { return types.map(function (type, i) { return type.encode(a[i]); }); }, types);
}
exports.tuple = tuple;
//
// readonly objects
//
var ReadonlyType = /** @class */ (function (_super) {
    __extends(ReadonlyType, _super);
    function ReadonlyType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyType';
        return _this;
    }
    return ReadonlyType;
}(Type));
exports.ReadonlyType = ReadonlyType;
exports.readonly = function (type, name) {
    if (name === void 0) { name = "Readonly<" + type.name + ">"; }
    return new ReadonlyType(name, type.is, function (m, c) {
        return type.validate(m, c).map(function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            return x;
        });
    }, type.encode === exports.identity ? exports.identity : type.encode, type);
};
//
// readonly arrays
//
var ReadonlyArrayType = /** @class */ (function (_super) {
    __extends(ReadonlyArrayType, _super);
    function ReadonlyArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyArrayType';
        return _this;
    }
    return ReadonlyArrayType;
}(Type));
exports.ReadonlyArrayType = ReadonlyArrayType;
exports.readonlyArray = function (type, name) {
    if (name === void 0) { name = "ReadonlyArray<" + type.name + ">"; }
    var arrayType = exports.array(type);
    return new ReadonlyArrayType(name, arrayType.is, function (m, c) {
        return arrayType.validate(m, c).map(function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            else {
                return x;
            }
        });
    }, arrayType.encode, type);
};
//
// strict types
//
var StrictType = /** @class */ (function (_super) {
    __extends(StrictType, _super);
    function StrictType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'StrictType';
        return _this;
    }
    return StrictType;
}(Type));
exports.StrictType = StrictType;
/**
 * Specifies that only the given properties are allowed
 * @deprecated use `exact` instead
 */
exports.strict = function (props, name) {
    if (name === void 0) { name = "StrictType<" + getNameFromProps(props) + ">"; }
    var exactType = exact(exports.type(props));
    return new StrictType(name, exactType.is, exactType.validate, exactType.encode, props);
};
exports.isTagged = function (tag) {
    var f = function (type) {
        if (type instanceof InterfaceType || type instanceof StrictType) {
            return type.props.hasOwnProperty(tag);
        }
        else if (type instanceof IntersectionType) {
            return type.types.some(f);
        }
        else if (type instanceof UnionType) {
            return type.types.every(f);
        }
        else if (type instanceof RefinementType || type instanceof ExactType) {
            return f(type.type);
        }
        else {
            return false;
        }
    };
    return f;
};
var findTagged = function (tag, types) {
    var len = types.length;
    var is = exports.isTagged(tag);
    var i = 0;
    for (; i < len - 1; i++) {
        var type_7 = types[i];
        if (is(type_7)) {
            return type_7;
        }
    }
    return types[i];
};
exports.getTagValue = function (tag) {
    var f = function (type) {
        switch (type._tag) {
            case 'InterfaceType':
            case 'StrictType':
                return type.props[tag].value;
            case 'IntersectionType':
                return f(findTagged(tag, type.types));
            case 'UnionType':
                return f(type.types[0]);
            case 'RefinementType':
            case 'ExactType':
            case 'RecursiveType':
                return f(type.type);
        }
    };
    return f;
};
var TaggedUnionType = /** @class */ (function (_super) {
    __extends(TaggedUnionType, _super);
    function TaggedUnionType(name, is, validate, encode, types, tag) {
        var _this = _super.call(this, name, is, validate, encode, types) /* istanbul ignore next */ // <= workaround for https://github.com/Microsoft/TypeScript/issues/13455
         || this;
        _this.tag = tag;
        return _this;
    }
    return TaggedUnionType;
}(UnionType));
exports.TaggedUnionType = TaggedUnionType;
exports.taggedUnion = function (tag, types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' | ') + ")"; }
    var len = types.length;
    var values = new Array(len);
    var hash = {};
    var useHash = true;
    var get = exports.getTagValue(tag);
    for (var i = 0; i < len; i++) {
        var value = get(types[i]);
        useHash = useHash && exports.string.is(value);
        values[i] = value;
        hash[String(value)] = i;
    }
    var isTagValue = useHash
        ? function (m) { return exports.string.is(m) && hash.hasOwnProperty(m); }
        : function (m) { return values.indexOf(m) !== -1; };
    var getIndex = useHash
        ? function (tag) { return hash[tag]; }
        : function (tag) {
            var i = 0;
            for (; i < len - 1; i++) {
                if (values[i] === tag) {
                    break;
                }
            }
            return i;
        };
    var TagValue = new Type(values.map(function (l) { return JSON.stringify(l); }).join(' | '), isTagValue, function (m, c) { return (isTagValue(m) ? exports.success(m) : exports.failure(m, c)); }, exports.identity);
    return new TaggedUnionType(name, function (v) {
        if (!exports.Dictionary.is(v)) {
            return false;
        }
        var tagValue = v[tag];
        return TagValue.is(tagValue) && types[getIndex(tagValue)].is(v);
    }, function (s, c) {
        var dictionaryValidation = exports.Dictionary.validate(s, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var d = dictionaryValidation.value;
            var tagValueValidation = TagValue.validate(d[tag], exports.appendContext(c, tag, TagValue));
            if (tagValueValidation.isLeft()) {
                return tagValueValidation;
            }
            else {
                var i = getIndex(tagValueValidation.value);
                var type_8 = types[i];
                return type_8.validate(d, exports.appendContext(c, String(i), type_8));
            }
        }
    }, useIdentity(types, len) ? exports.identity : function (a) { return types[getIndex(a[tag])].encode(a); }, types, tag);
};
//
// exact types
//
var ExactType = /** @class */ (function (_super) {
    __extends(ExactType, _super);
    function ExactType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ExactType';
        return _this;
    }
    return ExactType;
}(Type));
exports.ExactType = ExactType;
var getProps = function (type) {
    switch (type._tag) {
        case 'RefinementType':
        case 'ReadonlyType':
            return getProps(type.type);
        case 'InterfaceType':
        case 'StrictType':
        case 'PartialType':
            return type.props;
        case 'IntersectionType':
            return type.types.reduce(function (props, type) { return Object.assign(props, getProps(type)); }, {});
    }
};
function exact(type, name) {
    if (name === void 0) { name = "ExactType<" + type.name + ">"; }
    var props = getProps(type);
    return new ExactType(name, function (m) { return type.is(m) && Object.getOwnPropertyNames(m).every(function (k) { return props.hasOwnProperty(k); }); }, function (m, c) {
        var looseValidation = type.validate(m, c);
        if (looseValidation.isLeft()) {
            return looseValidation;
        }
        else {
            var o = looseValidation.value;
            var keys = Object.getOwnPropertyNames(o);
            var len = keys.length;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var key = keys[i];
                if (!props.hasOwnProperty(key)) {
                    errors.push(exports.getValidationError(o[key], exports.appendContext(c, key, exports.never)));
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(o);
        }
    }, type.encode, type);
}
exports.exact = exact;
/** Drops the runtime type "kind" */
function clean(type) {
    return type;
}
exports.clean = clean;
function alias(type) {
    return function () { return type; };
}
exports.alias = alias;