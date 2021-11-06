import { Request, Response } from 'express';
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';
import { validationResult } from 'express-validator';
const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();

function isObjectIdValid(id: string) {
	// Checks if a string is valid id used in mongoose. Tjhe post below helped me
	// https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
	return ObjectId.isValid(id)
		? String(new ObjectId(id) === id)
			? true
			: false
		: false;
}

function checkDBOperationResult(
	res: Response,
	dbResult: any,
	successMessage: string,
	errorMessage: string,
	key: string
) {
	if (dbResult === null || dbResult.length === 0) {
		throw {
			message: errorMessage,
			errors: [errorMessage]
		};
	} else {
		res.status(200).json({
			message: successMessage,
			[key]: dbResult
		});
	}
}

function checkIdExists(
	res: Response,
	id: string,
	message: string,
	key: string
) {
	if (isObjectIdValid(id) === false) {
		console.log('wrong id');
		throw {
			message,
			errors: [message]
		};
	} else {
		console.log('good id');
	}
}

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
	isObjectIdValid,
	checkValidationErrors,
	checkIdExists,
	checkDBOperationResult,
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
};
