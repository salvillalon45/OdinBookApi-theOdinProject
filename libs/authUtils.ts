import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import User from '../models/user';
require('dotenv').config();

const signUpValidationChain = [
	body('username')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Username must be at least 6 characters'),
	body('password')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Password must be at least 1 character'),
	body('first_name')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('First name cannot be empty'),
	body('last_name')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Last name cannot be empty')
];

async function checkValidPassword(
	foundUserPassword: string,
	inputPassword: string
) {
	const match = await bcrypt.compare(inputPassword, foundUserPassword);
	return match ? true : false;
}

async function checkUserExists(username: string) {
	try {
		const isUserInDB = await User.find({ username });
		if (isUserInDB.length > 0) {
			return true;
		}

		return false;
	} catch (err: any) {
		throw {
			message: 'CHECK USER EXISTS: Error when checking for users exists',
			errors: [err.message]
		};
	}
}

async function genPassword(userPassword: string) {
	try {
		const saltRounds = 10;
		const hashPassword = await bcrypt.hash(userPassword, saltRounds);

		return hashPassword;
	} catch (err: any) {
		throw {
			message: 'GEN PASSWORD: Error when trying to hash password',
			errors: [err.message]
		};
	}
}
function issueJWT(userid: string) {
	const expiresIn = '7d';
	const payload = {
		sub: userid,
		iat: Date.now()
	};
	const signedToken = jwt.sign(payload, String(process.env.SECRET_KEY), {
		expiresIn: expiresIn
	});

	return {
		token: `Bearer ${signedToken}`,
		expiresIn: expiresIn
	};
}

export {
	issueJWT,
	genPassword,
	checkUserExists,
	checkValidPassword,
	signUpValidationChain
};
