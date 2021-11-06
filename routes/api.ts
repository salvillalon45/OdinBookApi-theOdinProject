import express from 'express';
const router = express.Router();
const passport = require('passport');
const auth_controller = require('../controllers/authController');
const friend_controller = require('../controllers/friendController');
const post_controller = require('../controllers/postController');
// const comment_controller = require('../controllers/commentController');

// SIGNUP
// ------------------------------------------------------------
router.post('/sign-up', auth_controller.sign_up_post);

// LOGIN
// ------------------------------------------------------------
router.post('/log-in', auth_controller.log_in_post);

// FRIEND
// ------------------------------------------------------------
router.post(
	'/friend-request',
	passport.authenticate('jwt', { session: false }),
	friend_controller.make_friend_request_post
);
router.put(
	'/friend-request',
	passport.authenticate('jwt', { session: false }),
	friend_controller.accept_friend_request_put
);
router.delete(
	'/friend-request/withdraw',
	passport.authenticate('jwt', { session: false }),
	friend_controller.withdraw_friend_request_delete
);
router.delete(
	'/friend-request/decline',
	friend_controller.decline_friend_request_delete
);
router.delete(
	'/friend-request/remove',
	passport.authenticate('jwt', { session: false }),
	friend_controller.remove_friend_delete
);

// POSTS
// ------------------------------------------------------------
router.get(
	'/posts',
	passport.authenticate('jwt', { session: false }),
	post_controller.get_posts
);
router.post(
	'/posts',
	passport.authenticate('jwt', { session: false }),
	post_controller.create_post
);
router.delete(
	'/posts/:postid',
	passport.authenticate('jwt', { session: false }),
	post_controller.delete_post
);
router.put(
	'/posts/:postid',
	passport.authenticate('jwt', { session: false }),
	post_controller.update_post
);
router.put(
	'/posts/:postid/like',
	passport.authenticate('jwt', { session: false }),
	post_controller.update_like_post
);

// COMMENTS
// ------------------------------------------------------------
// router.get(
// 	'/posts/:postid/comments',
// 	passport.authenticate('jwt', { session: false }),
// 	comment_controller.get_comments
// );
// router.post('/posts/:postid/comments', comment_controller.create_comment);
// router.delete(
// 	'/posts/:postid/comments/:commentid',
// 	passport.authenticate('jwt', { session: false }),
// 	comment_controller.delete_comment
// );
// router.put(
// 	'/posts/:postid/comments/:commentid',
// 	comment_controller.update_comment
// );

export default router;
