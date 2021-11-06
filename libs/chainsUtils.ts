import { body } from 'express-validator';

const postCreateUpdateValidationChain = [
	body('content')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Post content cannot be empty')
];

export { postCreateUpdateValidationChain };
