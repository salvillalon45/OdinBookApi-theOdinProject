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

exports.make_friend_request_post = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userid } = req.body;
		const requestedFriendUserId = '';
		const relevantUser = await User.findById(userid);

		// check requesting user is not the same as the relevant user
		if (relevantUser._id == requestedFriendUserId) {
			return res.status(404).json({
				message: 'SIGN UP: Error with fields',
				errors: ['You cannot friend yoursel']
			});
		}
	} catch (err: any) {}
};
