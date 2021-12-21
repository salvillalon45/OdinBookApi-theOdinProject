// Express & Packages
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

// Models
import User from '../models/user';

// Utils
import {
	GET_USER_BY_ID,
	GET_USERS,
	UPDATE_USER_WITH_IMAGE
} from '../libs/constants';
import { upload } from '../libs/fileUploadUtils';
import {
	checkValidationErrors,
	findByIdUpdateAndReturnNewResult
} from '../libs/utils';

exports.get_users = async function (req: Request, res: Response) {
	try {
		const users = await User.find().populate({
			path: 'friends friend_requests'
		});

		return res.status(200).json({
			message: 'Users retrieved successfully',
			users
		});
	} catch (err: any) {
		console.log('GET POSTS: Error while trying to retrieve all posts');
		console.log(err);

		return res.status(500).json({
			context: GET_USERS,
			message: 'GET USERS: Error while trying to retrieve all posts',
			errors: [err.message]
		});
	}
};

exports.get_user_by_id = async function (req: Request, res: Response) {
	try {
		const { userid } = req.params;

		const user = await User.findById(userid).populate({
			path: 'friends friend_requests'
		});

		return res.status(200).json({
			message: 'User retrieved successfully',
			user
		});
	} catch (err: any) {
		console.log(
			'GET POSTS BY USER ID: Error while trying to retrieve user by id'
		);
		console.log(err);

		return res.status(500).json({
			context: GET_USER_BY_ID,
			message:
				'GET POSTS BY USER ID: Error while trying to retrieve user by id',
			errors: [err.message]
		});
	}
};

exports.update_user_with_image = [
	body('imageData')
		.custom((value, { req }) => {
			if (!req.file) {
				return 'No image';
			} else if (
				req.file.mimetype === 'image/bmp' ||
				req.file.mimetype === 'image/gif' ||
				req.file.mimetype === 'image/jpeg' ||
				req.file.mimetype === 'image/png' ||
				req.file.mimetype === 'image/tiff' ||
				req.file.mimetype === 'image/webp'
			) {
				return 'image'; // return "non-falsy" value to indicate valid data"
			} else {
				return false; // return "falsy" value to indicate invalid data
			}
		})
		.withMessage('You may only submit image files.'),

	upload.single('imageData'),

	async (req: Request, res: Response, next: NextFunction) => {
		const validationResult = checkValidationErrors(req);
		if (validationResult) {
			return res.status(400).json({
				context: UPDATE_USER_WITH_IMAGE,
				errors: validationResult
			});
		}

		try {
			const user = await User.findById(req.params.userid);
			user.profile_pic_url = req.file
				? `${process.env.BASE_URI}/images/` + req.file.filename
				: '';
			const updatedUser = await findByIdUpdateAndReturnNewResult(
				req.params.userid,
				user,
				'User'
			);

			return res.status(200).json({
				message: 'Succesfully updated',
				user: updatedUser
			});
		} catch (err: any) {
			return res.status(500).json({
				context: UPDATE_USER_WITH_IMAGE,
				message:
					'UPDATE User WITH IMAGE: Error while trying to update user profile pic',
				errors: [err.message]
			});
		}
	}
];
