import User from '../models/user';
import { Request, Response, NextFunction } from 'express';
import {
	genPassword,
	issueJWT,
	logInValidationChain,
	signUpValidationChain,
	checkValidPassword
} from '../libs/authUtils';
import { checkValidationErrors } from '../libs/utils';

exports.sign_up_post = [
	...signUpValidationChain,
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(404).json({
					message: 'SIGN UP: Error with fields',
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
				posts: [],
				profile_pic_url: profile_pic_url ? profile_pic_url : '',
				friends: [],
				friend_requests: []
			});

			const newUserResult = await newUser.save();

			return res.status(200).json({
				message: 'User signed up successfully',
				user: newUserResult
			});
		} catch (err: any) {
			console.log('SIGN UP: Error while trying to save new user in db');
			console.log(err);

			if (err._message === 'User validation failed') {
				return res.status(404).json({
					message: 'SIGN UP: User already exists',
					errors: ['User already exists']
				});
			}

			res.status(500).json({
				message: 'SIGN UP: Error while trying to save new user in db',
				errors: [err.message]
			});
		}
	}
];

exports.log_in_post = [
	...logInValidationChain,
	async function (req: Request, res: Response, next: NextFunction) {
		console.log('IN HERE');
		try {
			const validationResult = checkValidationErrors(req);
			if (validationResult) {
				return res.status(404).json({
					message: 'LOG IN: Error with fields',
					errors: validationResult
				});
			}

			const { username, password } = req.body;

			const foundUser = await User.findOne({ username });
			if (!foundUser) {
				return res.status(404).json({
					message: 'LOG IN: Error while finding a user',
					errors: ['User not found']
				});
			}

			if (await checkValidPassword(foundUser.password, password)) {
				const { token, expiresIn } = issueJWT(foundUser._id);

				return res.status(200).json({
					message: 'Log in successful',
					token: token,
					expiresIn: expiresIn,
					user: foundUser
				});
			} else {
				return res.status(404).json({
					message: 'LOG IN: Error while checking for passwords',
					errors: ['Entered wrong password']
				});
			}
		} catch (err: any) {
			console.log('LOG IN: Error while trying to log in user');
			console.log(err);

			res.status(500).json({
				message: 'LOG IN: Error while trying to log in user',
				errors: err.errors
			});
		}
	}
];
