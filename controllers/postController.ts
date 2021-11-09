import { Request, Response } from 'express';
import { body } from 'express-validator';

import User from '../models/user';
import Post from '../models/post';

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
	LIKE_POST
} from '../libs/constants';
import { postCreateUpdateValidationChain } from '../libs/chainsUtils';

exports.get_posts = async function (req: Request, res: Response) {
	try {
		const { userid, skip } = req.body;

		const user = await User.findById(userid);
		const posts = await Post.find(
			{
				author: [userid, ...user.friends]
			},
			null,
			{
				skip,
				limit: 5
			}
		)
			.sort({ timestamp: 'desc' })
			.populate('author comments');

		return res.status(200).json({
			message: 'Posts retrieved successfully',
			posts
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
	body('img-file')
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

	upload.single('img-file'),

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

			let uri = process.env.BASE_URI;
			const mongoDB =
				process.env.DEV_MONGODB_URI || process.env.MONGODB_URI;
			console.log({ mongoDB });
			console.log(
				'process.env.DEV_MONGODB_URI:: ',
				process.env.DEV_MONGODB_URI
			);
			console.log('process.env.MONGODB_URI:: ', process.env.MONGODB_URI);
			if (process.env.MONGODB_URI) {
				console.log('Wht is prodURI');
				uri = process.env.PROD_URI;
				console.log({ uri });
			}

			const attached_picture = req.file
				? `${uri}/public/images/` + req.file.filename
				: null;
			const newPost = new Post({
				timestamp: new Date(),
				content,
				author,
				attached_picture: attached_picture ?? '',
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

			res.status(500).json({
				context: CREATE_POST,
				message: 'CREATE POST: Error while trying to create a post',
				errors: [err.message]
			});
		}
	}
];

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
