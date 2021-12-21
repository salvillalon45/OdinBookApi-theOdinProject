// Express & Packages
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

// Models
import User from '../models/user';
import Post from '../models/post';

// Utils
import {
	checkValidationErrors,
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
} from '../libs/utils';
import { upload } from '../libs/fileUploadUtils';
import {
	GET_POSTS,
	CREATE_POST,
	UPDATE_POST,
	DELETE_POST,
	LIKE_POST,
	UPDATE_POST_WITH_IMAGE
} from '../libs/constants';
import { postCreateUpdateValidationChain } from '../libs/chainsUtils';

exports.get_posts = async function (req: Request, res: Response) {
	try {
		const { skip: strSkip, limit: strLimit } = req.query;
		const { userid } = req.params;

		const skip = Number(strSkip);
		const limit = Number(strLimit);

		const user = await User.findById(userid);
		const posts = await Post.find(
			{ author: [userid, ...user.friends] },
			null
		)
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
			.populate('likes');
		const userPosts = await Post.find({ author: [userid] }, null)
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
			.populate('likes');

		return res.status(200).json({
			message: 'Posts retrieved successfully',
			posts,
			userPosts
		});
	} catch (err: any) {
		console.log('GET POSTS: Error while trying to retrieve all posts');
		console.log(err);

		return res.status(500).json({
			context: GET_POSTS,
			message: 'GET POSTS: Error while trying to retrieve all posts',
			errors: [err.message]
		});
	}
};

exports.create_post = [
	...postCreateUpdateValidationChain,
	async function (req: Request, res: Response) {
		try {
			const { content, userid: author } = req.body;

			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(400).json({
					context: CREATE_POST,
					errors: validationResult
				});
			}

			const newPost = new Post({
				timestamp: new Date(),
				content,
				author,
				likes: [],
				comments: []
			});

			const result = await newPost.save();
			const populatePost = await result.populate('author');
			return res.status(200).json({
				message: 'Post created successfully',
				post: populatePost
			});
		} catch (err: any) {
			console.log('CREATE POST: Error while trying to create a post');
			console.log(err);

			return res.status(500).json({
				context: CREATE_POST,
				message: 'CREATE POST: Error while trying to create a post',
				errors: [err.message]
			});
		}
	}
];

exports.update_post_with_image = [
	body('imageData')
		.custom((value, { req }) => {
			if (!req.file) {
				return 'No image';
			} else if (
				req.file.mimetype === 'image/bmp' ||
				req.file.mimetype === 'image/gif' ||
				req.file.mimetype === 'image/jpeg' ||
				req.file.mimetype === 'image/png' ||
				req.file.mimetype === 'image/tiff' ||
				req.file.mimetype === 'image/webp'
			) {
				return 'image'; // return "non-falsy" value to indicate valid data"
			} else {
				return false; // return "falsy" value to indicate invalid data
			}
		})
		.withMessage('You may only submit image files.'),

	upload.single('imageData'),

	async (req: Request, res: Response, next: NextFunction) => {
		const validationResult = checkValidationErrors(req);
		if (validationResult) {
			return res.status(400).json({
				context: UPDATE_POST_WITH_IMAGE,
				errors: validationResult
			});
		}

		try {
			const post = await Post.findById(req.params.postid);
			post.attached_picture = req.file
				? `${process.env.BASE_URI}/images/` + req.file.filename
				: '';
			// const savedPost = await post.save();
			// const updatedPost = await Post.findById(savedPost._id).populate(
			// 	'author'
			// );
			const updatedPost = await findByIdUpdateAndReturnNewResult(
				// req.params.userid,
				post._id,
				post,
				'Post'
			);

			return res
				.status(200)
				.json({ message: 'Succesfully posted', post: updatedPost });
		} catch (err: any) {
			return res.status(500).json({
				context: UPDATE_POST_WITH_IMAGE,
				message:
					'UPDATE POST WITH IMAGE: Error while trying to create a post',
				errors: [err.message]
			});
		}
	}
];

// Not used
exports.update_post = [
	...postCreateUpdateValidationChain,
	async function (req: Request, res: Response) {
		try {
			const { postid } = req.params;
			const { content, userid: author } = req.body;

			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(400).json({
					context: UPDATE_POST,
					errors: validationResult
				});
			}

			const post = await Post.findById(postid);
			if (String(post.author) !== author) {
				return res.status(400).json({
					context: UPDATE_POST,
					errors: ['You can only update posts you made']
				});
			}
			post.timestamp = new Date();
			post.content = content;
			const updatedPost = await findByIdUpdateAndReturnNewResult(
				postid,
				post,
				'Post'
			);

			return res.status(200).json({
				message: 'Post updated successfully',
				updated_post: updatedPost
			});
		} catch (err: any) {
			console.log('UPDATE POST: Error while trying to update a post');
			console.log(err);

			return res.status(500).json({
				context: UPDATE_POST,
				message: 'UPDATE POST: Error while trying to update a post',
				errors: [err.message]
			});
		}
	}
];

// Not used
exports.delete_post = async function (req: Request, res: Response) {
	try {
		const { postid } = req.params;
		const { userid: author } = req.body;

		const post = await Post.findById(postid);
		if (!post) {
			return res.status(404).json({
				context: DELETE_POST,
				errors: ['Post not found']
			});
		}

		if (String(post.author) !== author) {
			return res.status(400).json({
				context: DELETE_POST,
				errors: ['You can only delete posts you made']
			});
		}

		const deletedPost = await Post.findByIdAndRemove(postid);
		return res.status(200).json({
			message: 'Post deleted successfully',
			deletedPost
		});
	} catch (err: any) {
		console.log('DELETE POST: Error while trying to delete a post');
		console.log(err);

		return res.status(500).json({
			context: DELETE_POST,
			message: 'DELETE POST: Error while trying to delete a post',
			errors: [err.message]
		});
	}
};

exports.update_like_post = async function (req: Request, res: Response) {
	try {
		const { postid } = req.params;
		const { userid: userIdToLikePost } = req.body;

		const post = await Post.findById(postid);
		if (post.likes.includes(userIdToLikePost)) {
			const updatedLikes = removeItemFromArray(
				post.likes,
				userIdToLikePost
			);
			post.likes = updatedLikes;
			const postResult = await findByIdUpdateAndReturnNewResult(
				postid,
				post,
				'Post'
			);

			return res.status(200).json({
				message: 'Post unliked sucessfully',
				post: postResult
			});
		}

		post.likes.push(userIdToLikePost);
		const postResult = await findByIdUpdateAndReturnNewResult(
			postid,
			post,
			'Post'
		);

		return res.status(200).json({
			message: 'Post liked successfully',
			post: postResult
		});
	} catch (err: any) {
		console.log('LIKE POST: Error while trying to like a post');
		console.log(err);

		return res.status(500).json({
			context: LIKE_POST,
			message: 'LIKE POST: Error while trying to like a post',
			errors: [err.message]
		});
	}
};
