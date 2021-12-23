"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express & Packages
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var passport = require('passport');
// Controllers
var auth_controller = require('../controllers/authController');
var friend_controller = require('../controllers/friendController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');
var user_controller = require('../controllers/userController');
// SIGNUP
// ------------------------------------------------------------
router.post('/sign-up', auth_controller.sign_up_post);
// LOGIN
// ------------------------------------------------------------
router.post('/log-in', auth_controller.log_in_post);
// FRIEND
// ------------------------------------------------------------
router.post('/friend-request', passport.authenticate('jwt', { session: false }), friend_controller.make_friend_request_post);
router.put('/friend-request', passport.authenticate('jwt', { session: false }), friend_controller.accept_friend_request_put);
router.delete('/friend-request/withdraw', passport.authenticate('jwt', { session: false }), friend_controller.withdraw_friend_request_delete);
router.delete('/friend-request/decline', friend_controller.decline_friend_request_delete);
router.delete('/friend-request/remove', passport.authenticate('jwt', { session: false }), friend_controller.remove_friend_delete);
// POSTS
// ------------------------------------------------------------
router.get('/posts/:userid', passport.authenticate('jwt', { session: false }), post_controller.get_posts);
router.post('/posts', passport.authenticate('jwt', { session: false }), post_controller.create_post);
router.delete('/posts/:postid', passport.authenticate('jwt', { session: false }), post_controller.delete_post);
router.put('/posts/:postid', passport.authenticate('jwt', { session: false }), post_controller.update_post);
router.put('/posts/:postid/like', passport.authenticate('jwt', { session: false }), post_controller.update_like_post);
router.put('/posts/:postid/image', passport.authenticate('jwt', { session: false }), post_controller.update_post_with_image);
// COMMENTS
// ------------------------------------------------------------
router.post('/posts/:postid/comments', passport.authenticate('jwt', { session: false }), comment_controller.create_comment);
router.delete('/posts/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), comment_controller.delete_comment);
router.put('/posts/:postid/comments/:commentid/like', passport.authenticate('jwt', { session: false }), comment_controller.update_like_comment);
router.put('/posts/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), comment_controller.update_comment);
// USERS
// ------------------------------------------------------------
router.get('/users', user_controller.get_users);
router.get('/users/:userid', passport.authenticate('jwt', { session: false }), user_controller.get_user_by_id);
router.put('/users/:userid/image', passport.authenticate('jwt', { session: false }), user_controller.update_user_with_image);
exports.default = router;
