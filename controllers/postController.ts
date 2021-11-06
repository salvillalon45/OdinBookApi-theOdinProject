import User from '../models/user';
import Post from '../models/post';
import { Request, Response, NextFunction } from 'express';
import {
	genPassword,
	issueJWT,
	logInValidationChain,
	signUpValidationChain,
	checkValidPassword
} from '../libs/authUtils';
import {
	checkValidationErrors,
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
} from '../libs/utils';
import { postCreateUpdateValidationChain } from '../libs/chainsUtils';
const ObjectId = require('mongoose').Types.ObjectId;

exports.get_posts = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
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
			// Comments here when we start populating comments
			.populate('author');

		return res.status(200).json({
			message: 'Posts retrieved successfully',
			posts
		});
	} catch (err: any) {
		console.log('GET POSTS: Error while trying to retrieve all posts');
		console.log(err);

		res.status(500).json({
			message: 'GET POSTS: Error while trying to retrieve all posts',
			errors: [err.message]
		});
	}
};

exports.create_post = [
	...postCreateUpdateValidationChain,
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(404).json({
					message: 'CREATE POST: Error with fields',
					errors: validationResult
				});
			}

			const { content, author, attached_picture } = req.body;
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
				message: 'CREATE POST: Post created successfully',
				post: populatePost
			});
		} catch (err: any) {
			console.log('CREATE POST: Error while trying to create a post');
			console.log(err);

			res.status(500).json({
				message: 'CREATE POST: Error while trying to create a post',
				errors: [err.message]
			});
		}
	}
];

exports.update_post = [
	...postCreateUpdateValidationChain,
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const { postid } = req.params;
			const { content, userid } = req.body;
			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(400).json({
					message: 'UPDATE POST: Error with fields',
					errors: validationResult
				});
			}

			const relPost = await Post.findById(postid);
			if (String(relPost.author) !== userid) {
				return res.status(400).json({
					errors: ['You can only update posts you made']
				});
			}

			const updatedPost = new Post({
				content,
				timestamp: new Date(),
				author: userid,
				_id: postid
			});

			const postResult = await findByIdUpdateAndReturnNewResult(
				postid,
				updatedPost,
				'Post'
			);

			return res.status(200).json({
				message: 'Post updated successfully',
				post: postResult
			});
		} catch (err: any) {
			console.log('UPDATE POST: Error while trying to update a post');
			console.log(err);

			return res.status(500).json({
				message: 'UPDATE POST: Error while trying to update a post',
				errors: [err.message]
			});
		}
	}
];

exports.delete_post = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { postid } = req.params;
		const { userid } = req.body;

		const relPost = await Post.findById(postid);
		if (!relPost) {
			return res.status(404).json({
				errors: ['Post not found']
			});
		}

		if (String(relPost.author) !== userid) {
			return res.status(400).json({
				errors: ['You can only delete posts you made']
			});
		}

		const deletedPost = await Post.findByIdAndRemove(postid);
		return res.status(200).json({
			message: 'DELETE POST: Post deleted successfully',
			deletedPost
		});
	} catch (err: any) {
		console.log('DELETE POST: Error while trying to delete a post');
		console.log(err);
		return res.status(500).json({
			message: 'DELETE POST: Error while trying to delete a post',
			errors: [err.message]
		});
	}
};

exports.update_like_post = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { postid } = req.params;
		const { userid: userIdToLikePost } = req.body;

		const relPost = await Post.findById(postid);

		if (relPost.likes.includes(userIdToLikePost)) {
			const updatedLikes = removeItemFromArray(
				relPost.likes,
				userIdToLikePost
			);
			relPost.likes = updatedLikes;
			const postResult = await findByIdUpdateAndReturnNewResult(
				postid,
				relPost,
				'Post'
			);
			return res.status(200).json({
				message: 'Post unliked sucessfully',
				post: postResult
			});
		}

		relPost.likes.push(userIdToLikePost);
		const postResult = await findByIdUpdateAndReturnNewResult(
			postid,
			relPost,
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
			message: 'LIKE POST: Error while trying to like a post',
			errors: [err.message]
		});
	}
};
