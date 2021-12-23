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
var express_validator_1 = require("express-validator");
// Models
var user_1 = __importDefault(require("../models/user"));
var post_1 = __importDefault(require("../models/post"));
// Utils
var utils_1 = require("../libs/utils");
var fileUploadUtils_1 = require("../libs/fileUploadUtils");
var constants_1 = require("../libs/constants");
var chainsUtils_1 = require("../libs/chainsUtils");
exports.get_posts = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, strSkip, strLimit, userid, skip, limit, user, posts, userPosts, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.query, strSkip = _a.skip, strLimit = _a.limit;
                    userid = req.params.userid;
                    skip = Number(strSkip);
                    limit = Number(strLimit);
                    return [4 /*yield*/, user_1.default.findById(userid)];
                case 1:
                    user = _b.sent();
                    return [4 /*yield*/, post_1.default.find({ author: __spreadArray([userid], user.friends, true) }, null)
                            .limit(limit * 1)
                            .skip((skip - 1) * limit)
                            .sort({ timestamp: 'desc' })
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'post_ref author'
                            }
                        })
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'post_ref',
                                populate: {
                                    path: 'comments'
                                }
                            }
                        })
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'likes'
                            }
                        })
                            .populate('author')
                            .populate('likes')];
                case 2:
                    posts = _b.sent();
                    return [4 /*yield*/, post_1.default.find({ author: [userid] }, null)
                            .limit(limit * 1)
                            .skip((skip - 1) * limit)
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'post_ref author'
                            }
                        })
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'likes'
                            }
                        })
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'post_ref',
                                populate: {
                                    path: 'comments'
                                }
                            }
                        })
                            .populate('author')
                            .populate('likes')];
                case 3:
                    userPosts = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Posts retrieved successfully',
                            posts: posts,
                            userPosts: userPosts
                        })];
                case 4:
                    err_1 = _b.sent();
                    console.log('GET POSTS: Error while trying to retrieve all posts');
                    console.log(err_1);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.GET_POSTS,
                            message: 'GET POSTS: Error while trying to retrieve all posts',
                            errors: [err_1.message]
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.create_post = __spreadArray(__spreadArray([], chainsUtils_1.postCreateUpdateValidationChain, true), [
    function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, content, author, validationResult, newPost, result, populatePost, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, content = _a.content, author = _a.userid;
                        validationResult = (0, utils_1.checkValidationErrors)(req);
                        if (validationResult) {
                            return [2 /*return*/, res.status(400).json({
                                    context: constants_1.CREATE_POST,
                                    errors: validationResult
                                })];
                        }
                        newPost = new post_1.default({
                            timestamp: new Date(),
                            content: content,
                            author: author,
                            likes: [],
                            comments: []
                        });
                        return [4 /*yield*/, newPost.save()];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.populate('author')];
                    case 2:
                        populatePost = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: 'Post created successfully',
                                post: populatePost
                            })];
                    case 3:
                        err_2 = _b.sent();
                        console.log('CREATE POST: Error while trying to create a post');
                        console.log(err_2);
                        return [2 /*return*/, res.status(500).json({
                                context: constants_1.CREATE_POST,
                                message: 'CREATE POST: Error while trying to create a post',
                                errors: [err_2.message]
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
], false);
exports.update_post_with_image = [
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
        var validationResult, post, updatedPost, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validationResult = (0, utils_1.checkValidationErrors)(req);
                    if (validationResult) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.UPDATE_POST_WITH_IMAGE,
                                errors: validationResult
                            })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, post_1.default.findById(req.params.postid)];
                case 2:
                    post = _a.sent();
                    post.attached_picture = req.file
                        ? process.env.BASE_URI + "/images/" + req.file.filename
                        : '';
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(
                        // req.params.userid,
                        post._id, post, 'Post')];
                case 3:
                    updatedPost = _a.sent();
                    return [2 /*return*/, res
                            .status(200)
                            .json({ message: 'Succesfully posted', post: updatedPost })];
                case 4:
                    err_3 = _a.sent();
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.UPDATE_POST_WITH_IMAGE,
                            message: 'UPDATE POST WITH IMAGE: Error while trying to create a post',
                            errors: [err_3.message]
                        })];
                case 5: return [2 /*return*/];
            }
        });
    }); }
];
// Not used
exports.update_post = __spreadArray(__spreadArray([], chainsUtils_1.postCreateUpdateValidationChain, true), [
    function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postid, _a, content, author, validationResult, post, updatedPost, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        postid = req.params.postid;
                        _a = req.body, content = _a.content, author = _a.userid;
                        validationResult = (0, utils_1.checkValidationErrors)(req);
                        if (validationResult) {
                            return [2 /*return*/, res.status(400).json({
                                    context: constants_1.UPDATE_POST,
                                    errors: validationResult
                                })];
                        }
                        return [4 /*yield*/, post_1.default.findById(postid)];
                    case 1:
                        post = _b.sent();
                        if (String(post.author) !== author) {
                            return [2 /*return*/, res.status(400).json({
                                    context: constants_1.UPDATE_POST,
                                    errors: ['You can only update posts you made']
                                })];
                        }
                        post.timestamp = new Date();
                        post.content = content;
                        return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(postid, post, 'Post')];
                    case 2:
                        updatedPost = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: 'Post updated successfully',
                                updated_post: updatedPost
                            })];
                    case 3:
                        err_4 = _b.sent();
                        console.log('UPDATE POST: Error while trying to update a post');
                        console.log(err_4);
                        return [2 /*return*/, res.status(500).json({
                                context: constants_1.UPDATE_POST,
                                message: 'UPDATE POST: Error while trying to update a post',
                                errors: [err_4.message]
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
], false);
// Not used
exports.delete_post = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var postid, author, post, deletedPost, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    postid = req.params.postid;
                    author = req.body.userid;
                    return [4 /*yield*/, post_1.default.findById(postid)];
                case 1:
                    post = _a.sent();
                    if (!post) {
                        return [2 /*return*/, res.status(404).json({
                                context: constants_1.DELETE_POST,
                                errors: ['Post not found']
                            })];
                    }
                    if (String(post.author) !== author) {
                        return [2 /*return*/, res.status(400).json({
                                context: constants_1.DELETE_POST,
                                errors: ['You can only delete posts you made']
                            })];
                    }
                    return [4 /*yield*/, post_1.default.findByIdAndRemove(postid)];
                case 2:
                    deletedPost = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Post deleted successfully',
                            deletedPost: deletedPost
                        })];
                case 3:
                    err_5 = _a.sent();
                    console.log('DELETE POST: Error while trying to delete a post');
                    console.log(err_5);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.DELETE_POST,
                            message: 'DELETE POST: Error while trying to delete a post',
                            errors: [err_5.message]
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.update_like_post = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var postid, userIdToLikePost, post, updatedLikes, postResult_1, postResult, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    postid = req.params.postid;
                    userIdToLikePost = req.body.userid;
                    return [4 /*yield*/, post_1.default.findById(postid)];
                case 1:
                    post = _a.sent();
                    if (!post.likes.includes(userIdToLikePost)) return [3 /*break*/, 3];
                    updatedLikes = (0, utils_1.removeItemFromArray)(post.likes, userIdToLikePost);
                    post.likes = updatedLikes;
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(postid, post, 'Post')];
                case 2:
                    postResult_1 = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Post unliked sucessfully',
                            post: postResult_1
                        })];
                case 3:
                    post.likes.push(userIdToLikePost);
                    return [4 /*yield*/, (0, utils_1.findByIdUpdateAndReturnNewResult)(postid, post, 'Post')];
                case 4:
                    postResult = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            message: 'Post liked successfully',
                            post: postResult
                        })];
                case 5:
                    err_6 = _a.sent();
                    console.log('LIKE POST: Error while trying to like a post');
                    console.log(err_6);
                    return [2 /*return*/, res.status(500).json({
                            context: constants_1.LIKE_POST,
                            message: 'LIKE POST: Error while trying to like a post',
                            errors: [err_6.message]
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
};
