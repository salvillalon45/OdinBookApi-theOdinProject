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
const ObjectId = require('mongoose').Types.ObjectId;

exports.make_friend_request_post = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userid, requestedFriendUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const requestedUser = await User.findById(requestedFriendUserId);
		if (!relevantUser || !requestedUser) {
			return res.status(404).json({
				context: 'MAKE FRIEND REQUEST',
				errors: ['User or Requested User not found']
			});
		}

		// Check requesting user is not the same as the relevant user
		if (userid === requestedFriendUserId) {
			return res.status(404).json({
				context: 'MAKE FRIEND REQUEST',
				errors: ['You cannot friend yourself']
			});
		}

		// Check that the requesting user is not already a friend of the
		// relevant user
		if (relevantUser.friends.includes(requestedFriendUserId)) {
			return res.status(404).json({
				context: 'MAKE FRIEND REQUEST',
				errors: ['You are already a friend of this user']
			});
		}

		// Check that the requesting user has not already send a friend request
		if (relevantUser.friend_requests.includes(requestedFriendUserId)) {
			return res.status(404).json({
				context: 'MAKE FRIEND REQUEST',
				errors: ['You have already send a friend request to this user']
			});
		}

		// Push the requesting user's id to the relevant user's friendrequest array
		const updatedFriendRequests = [
			...relevantUser.friend_requests,
			requestedFriendUserId
		];
		relevantUser.friend_requests = updatedFriendRequests;
		const updatedUser = await User.findByIdAndUpdate(userid, relevantUser, {
			new: true
		});
		console.log({ updatedUser });
		return res.status(200).json({
			message: 'Friend request submitted',
			user: updatedUser
		});
	} catch (err: any) {
		return res.status(500).json({
			message:
				'MAKE FRIEND REQUEST: Error while trying to send a friend request',
			errors: [err.message]
		});
	}
};

exports.accept_friend_request_put = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userid, userToAcceptUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToAccept = await User.findById(userToAcceptUserId);
		if (!relevantUser || !userToAccept) {
			return res.status(404).json({
				context: 'ACCEPT FRIEND REQUEST',
				errors: ['User or Requested User not found']
			});
		}

		// Check that requested user has a friend request from relevant user
		if (!userToAccept.friend_requests.includes(userid)) {
			return res.status(400).json({
				context: 'ACCEPT FRIEND REQUEST',
				errors: ['Friend request not found']
			});
		}

		// Here we clear the friend request that the userToAccept made to the relevant user
		// User1 -----> User2 (User1 sends friend request)
		// User1 <----- User2 (User2 accepts friend request) User1 = userToAccept and User2 = relevantUser
		const updatedFriendsRequest = userToAccept.friend_requests.filter(
			(friend_request: any) => {
				return String(friend_request) !== userid;
			}
		);
		userToAccept.friend_requests = updatedFriendsRequest;

		// Here we update the friends list of userToAccept
		const updatedUserToAcceptFriends = [...userToAccept.friends, userid];
		userToAccept.friends = updatedUserToAcceptFriends;
		await User.findByIdAndUpdate(userToAcceptUserId, userToAccept);

		// Now update the relevant user friends list
		const updatedRelevantUserFriends = [
			...relevantUser.friends,
			userToAcceptUserId
		];
		relevantUser.friends = updatedRelevantUserFriends;
		const result = await User.findByIdAndUpdate(userid, relevantUser, {
			new: true
		});

		// const result = await User.findById(userid).populate('friends');
		return res.status(200).json({
			message: 'Friend request accepted',
			user: result
		});
	} catch (err: any) {
		return res.status(500).json({
			message:
				'ACCEPT FRIEND REQUEST: Error while trying to accept a friend request',
			errors: [err.message]
		});
	}
};
