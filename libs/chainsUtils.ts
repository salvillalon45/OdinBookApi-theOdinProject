// Packages
import { body } from 'express-validator';

const postCreateUpdateValidationChain = [
	body('content')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Post content cannot be empty')
];

const commentCreateUpdateValidationChain = [
	body('content')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Comment content cannot be empty')
];

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

const logInValidationChain = [
	body('username')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Username is required'),
	body('password')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Password is required')
];

export {
	signUpValidationChain,
	postCreateUpdateValidationChain,
	logInValidationChain,
	commentCreateUpdateValidationChain
};
