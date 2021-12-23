"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentCreateUpdateValidationChain = exports.logInValidationChain = exports.postCreateUpdateValidationChain = exports.signUpValidationChain = void 0;
// Packages
var express_validator_1 = require("express-validator");
var postCreateUpdateValidationChain = [
    (0, express_validator_1.body)('content')
        .isLength({ min: 1 })
        .trim()
        .escape()
        .withMessage('Post content cannot be empty')
];
exports.postCreateUpdateValidationChain = postCreateUpdateValidationChain;
var commentCreateUpdateValidationChain = [
    (0, express_validator_1.body)('content')
        .isLength({ min: 1 })
        .trim()
        .escape()
        .withMessage('Comment content cannot be empty')
];
exports.commentCreateUpdateValidationChain = commentCreateUpdateValidationChain;
var signUpValidationChain = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Username must be at least 6 characters'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Password must be at least 1 character'),
    (0, express_validator_1.body)('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name cannot be empty'),
    (0, express_validator_1.body)('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name cannot be empty')
];
exports.signUpValidationChain = signUpValidationChain;
var logInValidationChain = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Username is required'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Password is required')
];
exports.logInValidationChain = logInValidationChain;
