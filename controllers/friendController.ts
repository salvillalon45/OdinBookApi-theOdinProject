import User from '../models/user';
import { Request, Response, NextFunction } from 'express';
import {
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
} from '../libs/utils';

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
		const updatedUser = await findByIdUpdateAndReturnNewResult(
			userid,
			relevantUser,
			'User'
		);
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
		const updatedFriendsRequest = removeItemFromArray(
			userToAccept.friend_requests,
			userid
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
		const result = await findByIdUpdateAndReturnNewResult(
			userid,
			relevantUser,
			'User'
		);

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

exports.withdraw_friend_request_delete = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userid, requestedFriendUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToAccept = await User.findById(requestedFriendUserId);
		if (!relevantUser || !userToAccept) {
			return res.status(404).json({
				context: 'WITHDRAW FRIEND REQUEST',
				errors: ['User or Requested User not found']
			});
		}

		// Check if friend request for the requestedFriendUserId exists
		if (!relevantUser.friend_requests.includes(requestedFriendUserId)) {
			return res.status(404).json({
				context: 'WITHDRAW FRIEND REQUEST',
				errors: ['Friend request not found']
			});
		}

		// Now delete the request
		const updatedRequests = removeItemFromArray(
			relevantUser.friend_requests,
			requestedFriendUserId
		);
		relevantUser.friend_requests = updatedRequests;
		const result = await findByIdUpdateAndReturnNewResult(
			userid,
			relevantUser,
			'User'
		);

		return res.status(200).json({
			message: 'Friend request withdrew successfully',
			user: result
		});
	} catch (err: any) {
		return res.status(500).json({
			message:
				'WITHDRAW FRIEND REQUEST: Error while trying to withdraw a friend request',
			errors: [err.message]
		});
	}
};

exports.decline_friend_request_delete = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userid, userToDeclineUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToDecline = await User.findById(userToDeclineUserId);
		if (!relevantUser || !userToDecline) {
			return res.status(404).json({
				context: 'DECLINE FRIEND REQUEST',
				errors: ['User or Requested User not found']
			});
		}

		// Now delete the request
		const updatedRequests = removeItemFromArray(
			userToDecline.friend_requests,
			userid
		);
		userToDecline.friend_requests = updatedRequests;
		const result = await findByIdUpdateAndReturnNewResult(
			userToDeclineUserId,
			userToDecline,
			'User'
		);

		return res.status(200).json({
			message: 'Friend request declined successfully',
			user: result
		});
	} catch (err: any) {
		return res.status(500).json({
			message:
				'DECLINE FRIEND REQUEST: Error while trying to decline a friend request',
			errors: [err.message]
		});
	}
};

exports.remove_friend_delete = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { userid, userToRemoveUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToRemove = await User.findById(userToRemoveUserId);
		if (!relevantUser || !userToRemove) {
			return res.status(404).json({
				context: 'REMOVE FRIEND',
				errors: ['User or Requested User not found']
			});
		}

		// Remove friend from relevant users friend list
		const updatedRequestsRelevantUser = removeItemFromArray(
			relevantUser.friends,
			userToRemoveUserId
		);
		relevantUser.friends = updatedRequestsRelevantUser;
		const updateRelevantUser = await findByIdUpdateAndReturnNewResult(
			userid,
			relevantUser,
			'User'
		);

		// Remove friend from user to delete friends list
		const updatedRequestsUserToRemove = removeItemFromArray(
			userToRemove.friends,
			userid
		);
		userToRemove.friends = updatedRequestsUserToRemove;
		const updateUserToRemove = await findByIdUpdateAndReturnNewResult(
			userToRemoveUserId,
			userToRemove,
			'User'
		);

		return res.status(200).json({
			message: 'Friend removed successfully',
			user: updateRelevantUser,
			user_to_remove: updateUserToRemove
		});
	} catch (err: any) {
		return res.status(500).json({
			message:
				'REMOVE FRIEND: Error while trying to remove a friend from friend list',
			errors: [err.message]
		});
	}
};
