// Express
import { Request, Response } from 'express';

// Models
import Post from '../models/post';
import Comment from '../models/comment';

// Utils
import {
	checkValidationErrors,
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
} from '../libs/utils';
import { commentCreateUpdateValidationChain } from '../libs/chainsUtils';
import {
	CREATE_COMMENT,
	DELETE_COMMENT,
	UPDATE_COMMENT,
	LIKE_COMMENT
} from '../libs/constants';

exports.create_comment = [
	...commentCreateUpdateValidationChain,
	async function (req: Request, res: Response) {
		try {
			const { content, userid: author } = req.body;
			const { postid } = req.params;

			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(400).json({
					context: CREATE_COMMENT,
					errors: validationResult
				});
			}

			const post = await Post.findById(postid);
			if (!post) {
				return res.status(404).json({
					context: CREATE_COMMENT,
					errors: ['Cannot create a comment without a post']
				});
			}

			const newComment = new Comment({
				timestamp: new Date(),
				content,
				author,
				post_ref: postid
			});
			const savedComment = await newComment.save();
			post.comments.push(savedComment);
			const updatedPost = await findByIdUpdateAndReturnNewResult(
				postid,
				post,
				'Post'
			);

			return res.status(200).json({
				message: 'Comment created successfully',
				comment: newComment,
				updated_post: updatedPost
			});
		} catch (err: any) {
			console.log(
				'CREATE COMMENT: Error while trying to create a comment'
			);
			console.log(err);

			return res.status(500).json({
				context: CREATE_COMMENT,
				message:
					'CREATE COMMENT: Error while trying to create a comment',
				errors: [err.message]
			});
		}
	}
];

exports.update_like_comment = async function (req: Request, res: Response) {
	try {
		const { commentid } = req.params;
		const { userid: userIdToLikeComment } = req.body;

		const comment = await Comment.findById(commentid);
		if (!comment) {
			return res.status(400).json({
				context: LIKE_COMMENT,
				errors: ['Comment not found']
			});
		}

		if (comment.likes.includes(userIdToLikeComment)) {
			const updatedLikes = removeItemFromArray(
				comment.likes,
				userIdToLikeComment
			);
			comment.likes = updatedLikes;
			const updatedComment = await findByIdUpdateAndReturnNewResult(
				commentid,
				comment,
				'Comment'
			);

			return res.status(200).json({
				message: 'Comment unliked sucessfully',
				updated_comment: updatedComment
			});
		}

		comment.likes.push(userIdToLikeComment);
		const updatedComment = await findByIdUpdateAndReturnNewResult(
			commentid,
			comment,
			'Comment'
		);

		return res.status(200).json({
			message: 'Comment liked successfully',
			updated_comment: updatedComment
		});
	} catch (err: any) {
		console.log('LIKE COMMENT: Error while trying to like a comment');
		console.log(err);

		return res.status(500).json({
			context: LIKE_COMMENT,
			message: 'LIKE COMMENT: Error while trying to like a comment',
			errors: [err.message]
		});
	}
};

// Not used
exports.delete_comment = async function (req: Request, res: Response) {
	try {
		const { commentid: commentIdToRemove, postid } = req.params;
		const { userid: author } = req.body;

		const post = await Post.findById(postid);
		if (!post) {
			return res.status(404).json({
				context: DELETE_COMMENT,
				errors: ['Post not found']
			});
		}

		const comment = await Comment.findById(commentIdToRemove);
		if (String(comment.author) !== author) {
			return res.status(400).json({
				context: DELETE_COMMENT,
				errors: ['You can only delete your own comments']
			});
		}

		const updatedComments = removeItemFromArray(
			post.comments,
			commentIdToRemove
		);
		post.comments = updatedComments;
		const updatedPost = await findByIdUpdateAndReturnNewResult(
			postid,
			post,
			'Post'
		);
		const deletedComment = await Comment.findByIdAndRemove(
			commentIdToRemove
		);
		return res.status(200).json({
			message: 'Comment deleted successfully',
			updated_post: updatedPost,
			deleted_comment: deletedComment
		});
	} catch (err: any) {
		console.log('DELETE COMMENT: Error while trying to delete a comment');
		console.log(err);

		return res.status(500).json({
			context: DELETE_COMMENT,
			message: 'DELETE COMMENT: Error while trying to delete a comment',
			errors: [err.message]
		});
	}
};

// Not used
exports.update_comment = [
	...commentCreateUpdateValidationChain,
	async function (req: Request, res: Response) {
		try {
			const { content, userid: author } = req.body;
			const { commentid } = req.params;

			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(400).json({
					context: UPDATE_COMMENT,
					errors: validationResult
				});
			}

			const comment = await Comment.findById(commentid);
			if (String(comment.author) !== author) {
				return res.status(400).json({
					context: UPDATE_COMMENT,
					errors: ['You can only update comments you made']
				});
			}
			comment.timestamp = new Date();
			comment.content = content;
			const updatedComment = await findByIdUpdateAndReturnNewResult(
				commentid,
				comment,
				'Comment'
			);
			return res.status(200).json({
				message: 'Comment updated successfully',
				updated_comment: updatedComment
			});
		} catch (err: any) {
			console.log(
				'UPDATE COMMENT: Error while trying to update a comment'
			);
			console.log(err);

			return res.status(500).json({
				context: UPDATE_COMMENT,
				message:
					'UPDATE COMMENT: Error while trying to update a comment',
				errors: [err.message]
			});
		}
	}
];
