// Express & Packages
import { Request } from 'express';
import { validationResult } from 'express-validator';
require('dotenv').config();

// Models
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';

function checkValidationErrors(req: Request) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const validationErrors = errors.array().map((e) => {
			return e.msg;
		});

		return validationErrors;
	} else {
		return null;
	}
}

async function findByIdUpdateAndReturnNewResult(
	id: string,
	updateObject: any,
	modelFlag: string
) {
	let modelToUse = null;

	if (modelFlag === 'User') {
		modelToUse = User;
	} else if (modelFlag === 'Post') {
		modelToUse = Post;
	} else if (modelFlag === 'Comment') {
		modelToUse = Comment;
	}

	if (modelToUse === null) {
		return null;
	}

	return await modelToUse.findByIdAndUpdate(id, updateObject, {
		new: true
	});
}

function removeItemFromArray(arr: [], removeFlag: string) {
	return arr.filter((item: any) => {
		return String(item) !== removeFlag;
	});
}

export {
	checkValidationErrors,
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
};
