import { Request, Response } from 'express';

import User from '../models/user';

import { genPassword, issueJWT, checkValidPassword } from '../libs/authUtils';
import {
	logInValidationChain,
	signUpValidationChain
} from '../libs/chainsUtils';
import { checkValidationErrors } from '../libs/utils';
import { SIGN_UP, LOG_IN } from '../libs/constants';

exports.sign_up_post = [
	...signUpValidationChain,
	async function (req: Request, res: Response) {
		try {
			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(404).json({
					context: SIGN_UP,
					errors: validationResult
				});
			}

			const {
				first_name,
				last_name,
				username,
				password,
				profile_pic_url
			} = req.body;

			const hashPassword = await genPassword(password);
			if (hashPassword.includes('Error:')) {
				return res.status(404).json({
					context: SIGN_UP,
					message: 'GEN PASSWORD: Error when trying to hash password',
					errors: [hashPassword]
				});
			}

			const newUser = new User({
				first_name,
				last_name,
				username,
				password: hashPassword,
				timestamp: new Date(),
				profile_pic_url: profile_pic_url ? profile_pic_url : '',
				friends: [],
				friend_requests: []
			});

			const newUserResult = await newUser.save();

			return res.status(200).json({
				context: SIGN_UP,
				message: 'User signed up successfully',
				user: newUserResult
			});
		} catch (err: any) {
			console.log('SIGN UP: Error while trying to save new user in db');
			console.log(err);

			if (err._message === 'User validation failed') {
				return res.status(404).json({
					context: SIGN_UP,
					message: 'SIGN UP: User already exists',
					errors: ['User already exists']
				});
			}

			return res.status(500).json({
				context: SIGN_UP,
				message: 'SIGN UP: Error while trying to save new user in db',
				errors: [err.message]
			});
		}
	}
];

exports.log_in_post = [
	...logInValidationChain,
	async function (req: Request, res: Response) {
		console.log('In route 1');
		try {
			const { username, password } = req.body;
			console.log('In route');
			console.log({ username, password });
			const validationResult = checkValidationErrors(req);
			console.log({ validationResult });
			if (validationResult) {
				return res.status(404).json({
					context: LOG_IN,
					errors: validationResult
				});
			}

			const foundUser = await User.findOne({ username });
			if (!foundUser) {
				return res.status(404).json({
					context: LOG_IN,
					message: 'LOG IN: User not found',
					errors: ['User not found']
				});
			}

			if (await checkValidPassword(foundUser.password, password)) {
				const { token, expiresIn } = issueJWT(foundUser._id);

				return res.status(200).json({
					context: LOG_IN,
					message: 'Log in successful',
					token: token,
					expiresIn: expiresIn,
					user: foundUser
				});
			} else {
				return res.status(404).json({
					context: LOG_IN,
					message: 'LOG IN: Entered wrong password',
					errors: ['Entered wrong password']
				});
			}
		} catch (err: any) {
			console.log('LOG IN: Error while trying to log in user');
			console.log(err);

			res.status(500).json({
				context: LOG_IN,
				message: 'LOG IN: Error while trying to log in user',
				// errors: err.errors
				errors: [err.message]
			});
		}
	}
];
