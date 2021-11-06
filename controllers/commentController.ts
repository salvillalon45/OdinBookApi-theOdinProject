import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';
import { Request, Response, NextFunction } from 'express';
import {
	checkValidationErrors,
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
} from '../libs/utils';
import {
	postCreateUpdateValidationChain,
	commentCreateValidationChain
} from '../libs/chainsUtils';

exports.create_comment = [
	...commentCreateValidationChain,
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const { content, user_ref } = req.body;
			const { postid } = req.params;

			const postResult = await Post.findById(postid);
			if (!postResult) {
				return res.status(404).json({
					errors: ['Cannot create a comment without a post']
				});
			}

			const newComment = new Comment({
				timestamp: new Date(),
				content,
				user_ref,
				post_ref: postid
			});

			await newComment.save();

			res.status(200).json({
				message: 'CREATE COMMENT: Comment created successfully',
				comment: newComment
			});
		} catch (err) {
			console.log(
				'CREATE COMMENT: Error while trying to create a comment'
			);
			console.log(err);
			res.status(500).json({
				message:
					'CREATE COMMENT: Error while trying to create a comment',
				errors: err.errors
			});
		}
	}
];
