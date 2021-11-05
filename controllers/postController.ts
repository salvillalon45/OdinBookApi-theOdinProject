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
import { postCreateValidationChain } from '../libs/chainsUtils';
const ObjectId = require('mongoose').Types.ObjectId;

// exports.posts_get = async function (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) {
// 	try {
// 		const posts = await Post.find().populate('author');

// 		checkDBOperationResult(
// 			res,
// 			posts,
// 			'GET POSTS: Posts retrieved successfully',
// 			'GET POSTS: No posts available for this post',
// 			'posts'
// 		);
// 	} catch (err) {
// 		console.log('GET POSTS: Error while trying to retrieve all posts');
// 		console.log(err);
// 		res.status(500).json({
// 			message: 'GET POSTS: Error while trying to retrieve all posts',
// 			errors: err.errors
// 		});
// 	}
// };

exports.create_post = [
	...postCreateValidationChain,
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
			console.log({ result });
			const res1 = await result.populate('author');
			console.log({ res1 });

			res.status(200).json({
				message: 'CREATE POST: Post crea`ted successfully',
				comment: newPost
			});
		} catch (err: any) {
			console.log('CREATE POST: Error while trying to create a post');
			console.log(err);

			res.status(500).json({
				message: 'CREATE POST: Error while trying to create a post',
				errors: err.errors
			});
		}
	}
];
