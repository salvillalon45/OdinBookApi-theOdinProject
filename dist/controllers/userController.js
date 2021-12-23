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
var express_validator_1 = require("express-validator");
// Models
var user_1 = __importDefault(require("../models/user"));
// Utils
var constants_1 = require("../libs/constants");
var fileUploadUtils_1 = require("../libs/fileUploadUtils");
var utils_1 = require("../libs/utils");
exports.get_users = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var users, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, user_1.default.find().populate({
                            path: 'friends friend_requests'
                        })];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Users retrieved successfully',
                            users: users
                        })];
                case 2:
                    err_1 = _a.sent();
                    console.log('GET POSTS: Error while trying to retrieve all posts');
                    console.log(err_1);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.GET_USERS,
                            message: 'GET USERS: Error while trying to retrieve all posts',
                            errors: [err_1.message]
                        })];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.get_user_by_id = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userid, user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userid = req.params.userid;
                    return [4 /*yield*/, user_1.default.findById(userid).populate({
                            path: 'friends friend_requests'
                        })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'User retrieved successfully',
                            user: user
                        })];
                case 2:
                    err_2 = _a.sent();
                    console.log('GET POSTS BY USER ID: Error while trying to retrieve user by id');
                    console.log(err_2);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.GET_USER_BY_ID,
                            message: 'GET POSTS BY USER ID: Error while trying to retrieve user by id',
                            errors: [err_2.message]
                        })];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.update_user_with_image = [
    (0, express_validator_1.body)('imageData')
        .custom(function (value, _a) {
        var req = _a.req;
        if (!req.file) {
            return 'No image';
        }
        else if (req.file.mimetype === 'image/bmp' ||
            req.file.mimetype === 'image/gif' ||
            req.file.mimetype === 'image/jpeg' ||
            req.file.mimetype === 'image/png' ||
            req.file.mimetype === 'image/tiff' ||
            req.file.mimetype === 'image/webp') {
            return 'image'; // return "non-falsy" value to indicate valid data"
        }
        else {
            return false; // return "falsy" value to indicate invalid data
        }
    })
        .withMessage('You may only submit image files.'),
    fileUploadUtils_1.upload.single('imageData'),
    function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var validationResult, user, updatedUser, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validationResult = (0, utils_1.checkValidationErrors)(req);
                    if (validationResult) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.UPDATE_USER_WITH_IMAGE,
                                errors: validationResult
                            })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, user_1.default.findById(req.params.userid)];
                case 2:
                    user = _a.sent();
                    user.profile_pic_url = req.file
                        ? process.env.BASE_URI + "/images/" + req.file.filename
                        : '';
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(req.params.userid, user, 'User')];
                case 3:
                    updatedUser = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Succesfully updated',
                            user: updatedUser
                        })];
                case 4:
                    err_3 = _a.sent();
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.UPDATE_USER_WITH_IMAGE,
                            message: 'UPDATE User WITH IMAGE: Error while trying to update user profile pic',
                            errors: [err_3.message]
                        })];
                case 5: return [2 /*return*/];
            }
        });
    }); }
];
