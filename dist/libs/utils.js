"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var user_1 = __importDefault(require("../models/user"));
var express_validator_1 = require("express-validator");
var ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();
function isObjectIdValid(id) {
    // Checks if a string is valid id used in mongoose. Tjhe post below helped me
    // https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    return ObjectId.isValid(id)
        ? String(new ObjectId(id) === id)
            ? true
            : false
        : false;
}
function checkDBOperationResult(res, dbResult, successMessage, errorMessage, key) {
    var _a;
    if (dbResult === null || dbResult.length === 0) {
        throw {
            message: errorMessage,
            errors: [errorMessage]
        };
    }
    else {
        res.status(200).json((_a = {
                message: successMessage
            },
            _a[key] = dbResult,
            _a));
    }
}
function checkIdExists(res, id, message, key) {
    if (isObjectIdValid(id) === false) {
        console.log('wrong id');
        throw {
            message: message,
            errors: [message]
        };
    }
    else {
        console.log('good id');
    }
}
function checkValidationErrors(req, res, message) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        var validationErrors = errors.array().map(function (e) {
            return e.msg;
        });
        throw {
            message: message,
            errors: validationErrors
        };
    }
}
function checkValidPassword(foundUserPassword, inputPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptjs_1.default.compare(inputPassword, foundUserPassword)];
                case 1:
                    match = _a.sent();
                    return [2 /*return*/, match ? true : false];
            }
        });
    });
}
function checkUserExists(username) {
    return __awaiter(this, void 0, void 0, function () {
        var isUserInDB, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, user_1.default.find({ username: username })];
                case 1:
                    isUserInDB = _a.sent();
                    if (isUserInDB.length > 0) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
                case 2:
                    err_1 = _a.sent();
                    throw {
                        message: 'CHECK USER EXISTS: Error when checking for users exists',
                        errors: [err_1.message]
                    };
                case 3: return [2 /*return*/];
            }
        });
    });
}
function genPassword(userPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var saltRounds, hashPassword, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    saltRounds = 10;
                    return [4 /*yield*/, bcryptjs_1.default.hash(userPassword, saltRounds)];
                case 1:
                    hashPassword = _a.sent();
                    return [2 /*return*/, hashPassword];
                case 2:
                    err_2 = _a.sent();
                    throw {
                        message: 'GEN PASSWORD: Error when trying to hash password',
                        errors: [err_2.message]
                    };
                case 3: return [2 /*return*/];
            }
        });
    });
}
function issueJWT(user) {
    var _id = user._id;
    var expiresIn = '7d';
    var payload = {
        sub: _id,
        iat: Date.now()
    };
    var signedToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
        expiresIn: expiresIn
    });
    return {
        token: "Bearer " + signedToken,
        expiresIn: expiresIn
    };
}
module.exports = {
    issueJWT: issueJWT,
    isObjectIdValid: isObjectIdValid,
    genPassword: genPassword,
    checkValidationErrors: checkValidationErrors,
    checkUserExists: checkUserExists,
    checkIdExists: checkIdExists,
    checkValidPassword: checkValidPassword,
    checkDBOperationResult: checkDBOperationResult
};
