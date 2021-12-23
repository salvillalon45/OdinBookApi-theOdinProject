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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Models
var user_1 = __importDefault(require("../models/user"));
// Utils
var utils_1 = require("../libs/utils");
var constants_1 = require("../libs/constants");
exports.make_friend_request_post = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userid, requestedFriendUserId, relevantUser, requestedUser, requestedUserUpdatedFriendRequests, updatedRequestedUser, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, userid = _a.userid, requestedFriendUserId = _a.requestedFriendUserId;
                    return [4 /*yield*/, user_1.default.findById(userid)];
                case 1:
                    relevantUser = _b.sent();
                    return [4 /*yield*/, user_1.default.findById(requestedFriendUserId)];
                case 2:
                    requestedUser = _b.sent();
                    if (!relevantUser || !requestedUser) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.MAKE_FRIEND_REQUEST,
                                errors: ['User or Requested User not found']
                            })];
                    }
                    // Check requesting user is not the same as the relevant user
                    if (userid === requestedFriendUserId) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.MAKE_FRIEND_REQUEST,
                                errors: ['You cannot friend yourself']
                            })];
                    }
                    // Check that the requesting user is not already a friend of the
                    // relevant user
                    if (relevantUser.friends.includes(requestedFriendUserId)) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.MAKE_FRIEND_REQUEST,
                                errors: ['You are already a friend of this user']
                            })];
                    }
                    // Check that the relevant user has not already send a friend request
                    if (relevantUser.friend_requests.includes(requestedFriendUserId)) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.MAKE_FRIEND_REQUEST,
                                errors: ['You have already send a friend request to this user']
                            })];
                    }
                    requestedUserUpdatedFriendRequests = __spreadArray(__spreadArray([], requestedUser.friend_requests, true), [
                        userid
                    ], false);
                    requestedUser.friend_requests = requestedUserUpdatedFriendRequests;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(requestedFriendUserId, requestedUser, 'User')];
                case 3:
                    updatedRequestedUser = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Friend request submitted',
                            requested_user: updatedRequestedUser
                        })];
                case 4:
                    err_1 = _b.sent();
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.MAKE_FRIEND_REQUEST,
                            message: 'MAKE FRIEND REQUEST: Error while trying to send a friend request',
                            errors: [err_1.message]
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
};
/*
    To Note. When thinking of Friend request. The way that it works is as follows.
    All the friend requests that I received are from other users. Everytime a user send a friend
    request. That friend request will get store in their array not in my friend_requests array
    Example:
    sal9 makes a friend request to sal10
    sal9.friend_request array will be empty
    sal10.friend_request will contain that request from sal9
    In the code below
    - If sal10 logs in to OdinBook they will see the friend request made from sal9
    - userid will be sal10
    - userToAcceptUserId will be sal9
*/
exports.accept_friend_request_put = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userid, userToAcceptUserId, relevantUser, userToAccept, updatedFriendsRequest, updatedUserToAcceptFriends, updatedRelevantUserFriends, result, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.body, userid = _a.userid, userToAcceptUserId = _a.userToAcceptUserId;
                    return [4 /*yield*/, user_1.default.findById(userid)];
                case 1:
                    relevantUser = _b.sent();
                    return [4 /*yield*/, user_1.default.findById(userToAcceptUserId)];
                case 2:
                    userToAccept = _b.sent();
                    if (!relevantUser || !userToAccept) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.ACCEPT_FRIEND_REQUEST,
                                errors: ['User or Requested User not found']
                            })];
                    }
                    // Check that relevant user has a friend request from userToAccept
                    if (!relevantUser.friend_requests.includes(userToAcceptUserId)) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.ACCEPT_FRIEND_REQUEST,
                                errors: ['Friend request not found']
                            })];
                    }
                    updatedFriendsRequest = (0, utils_1.removeItemFromArray)(relevantUser.friend_requests, userToAcceptUserId);
                    relevantUser.friend_requests = updatedFriendsRequest;
                    updatedUserToAcceptFriends = __spreadArray(__spreadArray([], userToAccept.friends, true), [userid], false);
                    userToAccept.friends = updatedUserToAcceptFriends;
                    return [4 /*yield*/, user_1.default.findByIdAndUpdate(userToAcceptUserId, userToAccept)];
                case 3:
                    _b.sent();
                    updatedRelevantUserFriends = __spreadArray(__spreadArray([], relevantUser.friends, true), [
                        userToAcceptUserId
                    ], false);
                    relevantUser.friends = updatedRelevantUserFriends;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(userid, relevantUser, 'User')];
                case 4:
                    result = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Friend request accepted',
                            user: result
                        })];
                case 5:
                    err_2 = _b.sent();
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.ACCEPT_FRIEND_REQUEST,
                            message: 'ACCEPT FRIEND REQUEST: Error while trying to accept a friend request',
                            errors: [err_2.message]
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
};
/*
    To Note. When thinking of Friend request. The way that it works is as follows.
    Everytime a user send a friend request. That friend request will get store in their array not
    in my friend_requests array
    Example:
    sal9 makes a friend request to sal10
    sal9.friend_request array will be empty
    sal10.friend_request will contain that request from sal9
    In the code below
    - If sal9 logs in to OdinBook they will see a list of friends that they can send friend requests to
    - They will see sal10 as a potential friend option
    - sal9 will send friend request to sal10
    - sal9 is userid
    - sal10 is requestedFriendUserId
    Since sal10 has a friend_request from sal9 and we are trying to withdraw the request that sal9 made
    we are going to look into sal10 array and remove it
*/
exports.withdraw_friend_request_delete = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userid, requestedFriendUserId, userToWithdraw, relevantUser, updatedRequests, result, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, userid = _a.userid, requestedFriendUserId = _a.requestedFriendUserId;
                    return [4 /*yield*/, user_1.default.findById(userid)];
                case 1:
                    userToWithdraw = _b.sent();
                    return [4 /*yield*/, user_1.default.findById(requestedFriendUserId)];
                case 2:
                    relevantUser = _b.sent();
                    if (!relevantUser || !userToWithdraw) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.WITHDRAW_FRIEND_REQUEST,
                                errors: ['User or Requested User not found']
                            })];
                    }
                    // Check if friend request for the requestedFriendUserId exists
                    if (!relevantUser.friend_requests.includes(userid)) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.WITHDRAW_FRIEND_REQUEST,
                                errors: ['Friend request not found']
                            })];
                    }
                    updatedRequests = (0, utils_1.removeItemFromArray)(relevantUser.friend_requests, userid);
                    relevantUser.friend_requests = updatedRequests;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(relevantUser._id, relevantUser, 'User')];
                case 3:
                    result = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Friend request withdrew successfully',
                            user: result
                        })];
                case 4:
                    err_3 = _b.sent();
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.WITHDRAW_FRIEND_REQUEST,
                            message: 'WITHDRAW FRIEND REQUEST: Error while trying to withdraw a friend request',
                            errors: [err_3.message]
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
};
/*
    To Note. Here we are looking at the point of view from a user who received a friend request but
    now they are trying to decline the friend request they received
    Example:
    - sal9 send a friend request to sal10
    - sal10 decides to decline the friend request
    - sal0 is userid
    - sal9 is userToDeclineUserId
*/
exports.decline_friend_request_delete = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userid, userToDeclineUserId, relevantUser, userToDecline, updatedRequests, result, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, userid = _a.userid, userToDeclineUserId = _a.userToDeclineUserId;
                    return [4 /*yield*/, user_1.default.findById(userid)];
                case 1:
                    relevantUser = _b.sent();
                    return [4 /*yield*/, user_1.default.findById(userToDeclineUserId)];
                case 2:
                    userToDecline = _b.sent();
                    if (!relevantUser || !userToDecline) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.DECLINE_FRIEND_REQUEST,
                                errors: ['User or Requested User not found']
                            })];
                    }
                    updatedRequests = (0, utils_1.removeItemFromArray)(relevantUser.friend_requests, userToDeclineUserId);
                    relevantUser.friend_requests = updatedRequests;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(userid, relevantUser, 'User')];
                case 3:
                    result = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Friend request declined successfully',
                            user: result
                        })];
                case 4:
                    err_4 = _b.sent();
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.DECLINE_FRIEND_REQUEST,
                            message: 'DECLINE FRIEND REQUEST: Error while trying to decline a friend request',
                            errors: [err_4.message]
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
};
// Not used
exports.remove_friend_delete = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userid, userToRemoveUserId, relevantUser, userToRemove, updatedFriendsRelevantUser, updatedRelevantUser, updatedFriendsUserToRemove, updatedUserToRemove, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.body, userid = _a.userid, userToRemoveUserId = _a.userToRemoveUserId;
                    return [4 /*yield*/, user_1.default.findById(userid)];
                case 1:
                    relevantUser = _b.sent();
                    return [4 /*yield*/, user_1.default.findById(userToRemoveUserId)];
                case 2:
                    userToRemove = _b.sent();
                    if (!relevantUser || !userToRemove) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.REMOVE_FRIEND,
                                errors: ['User or Requested User not found']
                            })];
                    }
                    updatedFriendsRelevantUser = (0, utils_1.removeItemFromArray)(relevantUser.friends, userToRemoveUserId);
                    relevantUser.friends = updatedFriendsRelevantUser;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(userid, relevantUser, 'User')];
                case 3:
                    updatedRelevantUser = _b.sent();
                    updatedFriendsUserToRemove = (0, utils_1.removeItemFromArray)(userToRemove.friends, userid);
                    userToRemove.friends = updatedFriendsUserToRemove;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(userToRemoveUserId, userToRemove, 'User')];
                case 4:
                    updatedUserToRemove = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Friend removed successfully',
                            user: updatedRelevantUser,
                            user_to_remove: updatedUserToRemove
                        })];
                case 5:
                    err_5 = _b.sent();
                    console.log('REMOVE FRIEND: Error while trying to remove a friend from friend list');
                    console.log(err_5);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.REMOVE_FRIEND,
                            message: 'REMOVE FRIEND: Error while trying to remove a friend from friend list',
                            errors: [err_5.message]
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
};
