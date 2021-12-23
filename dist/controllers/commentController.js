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
var post_1 = __importDefault(require("../models/post"));
var comment_1 = __importDefault(require("../models/comment"));
// Utils
var utils_1 = require("../libs/utils");
var chainsUtils_1 = require("../libs/chainsUtils");
var constants_1 = require("../libs/constants");
exports.create_comment = __spreadArray(__spreadArray([], chainsUtils_1.commentCreateUpdateValidationChain, true), [
    function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, content, author, postid, validationResult, post, newComment, savedComment, updatedPost, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, content = _a.content, author = _a.userid;
                        postid = req.params.postid;
                        validationResult = (0, utils_1.checkValidationErrors)(req);
                        if (validationResult) {
                            return [2 /*return*/, res.status(400).json({
                                    context: constants_1.CREATE_COMMENT,
                                    errors: validationResult
                                })];
                        }
                        return [4 /*yield*/, post_1.default.findById(postid)];
                    case 1:
                        post = _b.sent();
                        if (!post) {
                            return [2 /*return*/, res.status(404).json({
                                    context: constants_1.CREATE_COMMENT,
                                    errors: ['Cannot create a comment without a post']
                                })];
                        }
                        newComment = new comment_1.default({
                            timestamp: new Date(),
                            content: content,
                            author: author,
                            post_ref: postid
                        });
                        return [4 /*yield*/, newComment.save()];
                    case 2:
                        savedComment = _b.sent();
                        post.comments.push(savedComment);
                        return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(postid, post, 'Post')];
                    case 3:
                        updatedPost = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: 'Comment created successfully',
                                comment: newComment,
                                updated_post: updatedPost
                            })];
                    case 4:
                        err_1 = _b.sent();
                        console.log('CREATE COMMENT: Error while trying to create a comment');
                        console.log(err_1);
                        return [2 /*return*/, res.status(500).json({
                                context: constants_1.CREATE_COMMENT,
                                message: 'CREATE COMMENT: Error while trying to create a comment',
                                errors: [err_1.message]
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
], false);
exports.update_like_comment = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var commentid, userIdToLikeComment, comment, updatedLikes, updatedComment_1, updatedComment, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    commentid = req.params.commentid;
                    userIdToLikeComment = req.body.userid;
                    return [4 /*yield*/, comment_1.default.findById(commentid)];
                case 1:
                    comment = _a.sent();
                    if (!comment) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.LIKE_COMMENT,
                                errors: ['Comment not found']
                            })];
                    }
                    if (!comment.likes.includes(userIdToLikeComment)) return [3 /*break*/, 3];
                    updatedLikes = (0, utils_1.removeItemFromArray)(comment.likes, userIdToLikeComment);
                    comment.likes = updatedLikes;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(commentid, comment, 'Comment')];
                case 2:
                    updatedComment_1 = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Comment unliked sucessfully',
                            updated_comment: updatedComment_1
                        })];
                case 3:
                    comment.likes.push(userIdToLikeComment);
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(commentid, comment, 'Comment')];
                case 4:
                    updatedComment = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Comment liked successfully',
                            updated_comment: updatedComment
                        })];
                case 5:
                    err_2 = _a.sent();
                    console.log('LIKE COMMENT: Error while trying to like a comment');
                    console.log(err_2);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.LIKE_COMMENT,
                            message: 'LIKE COMMENT: Error while trying to like a comment',
                            errors: [err_2.message]
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
};
// Not used
exports.delete_comment = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, commentIdToRemove, postid, author, post, comment, updatedComments, updatedPost, deletedComment, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.params, commentIdToRemove = _a.commentid, postid = _a.postid;
                    author = req.body.userid;
                    return [4 /*yield*/, post_1.default.findById(postid)];
                case 1:
                    post = _b.sent();
                    if (!post) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.DELETE_COMMENT,
                                errors: ['Post not found']
                            })];
                    }
                    return [4 /*yield*/, comment_1.default.findById(commentIdToRemove)];
                case 2:
                    comment = _b.sent();
                    if (String(comment.author) !== author) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.DELETE_COMMENT,
                                errors: ['You can only delete your own comments']
                            })];
                    }
                    updatedComments = (0, utils_1.removeItemFromArray)(post.comments, commentIdToRemove);
                    post.comments = updatedComments;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(postid, post, 'Post')];
                case 3:
                    updatedPost = _b.sent();
                    return [4 /*yield*/, comment_1.default.findByIdAndRemove(commentIdToRemove)];
                case 4:
                    deletedComment = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Comment deleted successfully',
                            updated_post: updatedPost,
                            deleted_comment: deletedComment
                        })];
                case 5:
                    err_3 = _b.sent();
                    console.log('DELETE COMMENT: Error while trying to delete a comment');
                    console.log(err_3);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.DELETE_COMMENT,
                            message: 'DELETE COMMENT: Error while trying to delete a comment',
                            errors: [err_3.message]
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
};
// Not used
exports.update_comment = __spreadArray(__spreadArray([], chainsUtils_1.commentCreateUpdateValidationChain, true), [
    function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, content, author, commentid, validationResult, comment, updatedComment, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, content = _a.content, author = _a.userid;
                        commentid = req.params.commentid;
                        validationResult = (0, utils_1.checkValidationErrors)(req);
                        if (validationResult) {
                            return [2 /*return*/, res.status(400).json({
                                    context: constants_1.UPDATE_COMMENT,
                                    errors: validationResult
                                })];
                        }
                        return [4 /*yield*/, comment_1.default.findById(commentid)];
                    case 1:
                        comment = _b.sent();
                        if (String(comment.author) !== author) {
                            return [2 /*return*/, res.status(400).json({
                                    context: constants_1.UPDATE_COMMENT,
                                    errors: ['You can only update comments you made']
                                })];
                        }
                        comment.timestamp = new Date();
                        comment.content = content;
                        return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(commentid, comment, 'Comment')];
                    case 2:
                        updatedComment = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: 'Comment updated successfully',
                                updated_comment: updatedComment
                            })];
                    case 3:
                        err_4 = _b.sent();
                        console.log('UPDATE COMMENT: Error while trying to update a comment');
                        console.log(err_4);
                        return [2 /*return*/, res.status(500).json({
                                context: constants_1.UPDATE_COMMENT,
                                message: 'UPDATE COMMENT: Error while trying to update a comment',
                                errors: [err_4.message]
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
], false);
