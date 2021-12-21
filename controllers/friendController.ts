// Express
import { Request, Response } from 'express';

// Models
import User from '../models/user';

// Utils
import {
	findByIdUpdateAndReturnNewResult,
	removeItemFromArray
} from '../libs/utils';
import {
	MAKE_FRIEND_REQUEST,
	ACCEPT_FRIEND_REQUEST,
	WITHDRAW_FRIEND_REQUEST,
	DECLINE_FRIEND_REQUEST,
	REMOVE_FRIEND
} from '../libs/constants';

exports.make_friend_request_post = async function (
	req: Request,
	res: Response
) {
	try {
		const { userid, requestedFriendUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const requestedUser = await User.findById(requestedFriendUserId);
		if (!relevantUser || !requestedUser) {
			return res.status(404).json({
				context: MAKE_FRIEND_REQUEST,
				errors: ['User or Requested User not found']
			});
		}

		// Check requesting user is not the same as the relevant user
		if (userid === requestedFriendUserId) {
			return res.status(400).json({
				context: MAKE_FRIEND_REQUEST,
				errors: ['You cannot friend yourself']
			});
		}

		// Check that the requesting user is not already a friend of the
		// relevant user
		if (relevantUser.friends.includes(requestedFriendUserId)) {
			return res.status(400).json({
				context: MAKE_FRIEND_REQUEST,
				errors: ['You are already a friend of this user']
			});
		}

		// Check that the relevant user has not already send a friend request
		if (relevantUser.friend_requests.includes(requestedFriendUserId)) {
			return res.status(404).json({
				context: MAKE_FRIEND_REQUEST,
				errors: ['You have already send a friend request to this user']
			});
		}

		const requestedUserUpdatedFriendRequests = [
			...requestedUser.friend_requests,
			userid
		];
		requestedUser.friend_requests = requestedUserUpdatedFriendRequests;
		const updatedRequestedUser = await findByIdUpdateAndReturnNewResult(
			requestedFriendUserId,
			requestedUser,
			'User'
		);

		return res.status(200).json({
			message: 'Friend request submitted',
			requested_user: updatedRequestedUser
		});
	} catch (err: any) {
		return res.status(500).json({
			context: MAKE_FRIEND_REQUEST,
			message:
				'MAKE FRIEND REQUEST: Error while trying to send a friend request',
			errors: [err.message]
		});
	}
};

/*
	To Note. When thinking of Friend request. The way that it works is as follows.
	All the friend requests that I received are from other users. Everytime a user send a friend
	request. That friend request will get store in their array not in my friend_requests array
	Example:
	sal9 makes a friend request to sal10
	sal9.friend_request array will be empty
	sal10.friend_request will contain that request from sal9
	In the code below
	- If sal10 logs in to OdinBook they will see the friend request made from sal9
	- userid will be sal10
	- userToAcceptUserId will be sal9
*/
exports.accept_friend_request_put = async function (
	req: Request,
	res: Response
) {
	try {
		const { userid, userToAcceptUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToAccept = await User.findById(userToAcceptUserId);
		if (!relevantUser || !userToAccept) {
			return res.status(404).json({
				context: ACCEPT_FRIEND_REQUEST,
				errors: ['User or Requested User not found']
			});
		}

		// Check that relevant user has a friend request from userToAccept
		if (!relevantUser.friend_requests.includes(userToAcceptUserId)) {
			return res.status(400).json({
				context: ACCEPT_FRIEND_REQUEST,
				errors: ['Friend request not found']
			});
		}

		// Here we clear the friend request that the userToAccept made to the relevant user
		const updatedFriendsRequest = removeItemFromArray(
			relevantUser.friend_requests,
			userToAcceptUserId
		);
		relevantUser.friend_requests = updatedFriendsRequest;

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
			context: ACCEPT_FRIEND_REQUEST,
			message:
				'ACCEPT FRIEND REQUEST: Error while trying to accept a friend request',
			errors: [err.message]
		});
	}
};

/*
	To Note. When thinking of Friend request. The way that it works is as follows.
	Everytime a user send a friend request. That friend request will get store in their array not 
	in my friend_requests array
	Example:
	sal9 makes a friend request to sal10
	sal9.friend_request array will be empty
	sal10.friend_request will contain that request from sal9
	In the code below
	- If sal9 logs in to OdinBook they will see a list of friends that they can send friend requests to
	- They will see sal10 as a potential friend option 
	- sal9 will send friend request to sal10
	- sal9 is userid
	- sal10 is requestedFriendUserId
	Since sal10 has a friend_request from sal9 and we are trying to withdraw the request that sal9 made
	we are going to look into sal10 array and remove it
*/
exports.withdraw_friend_request_delete = async function (
	req: Request,
	res: Response
) {
	try {
		const { userid, requestedFriendUserId } = req.body;
		const userToWithdraw = await User.findById(userid);
		const relevantUser = await User.findById(requestedFriendUserId);

		if (!relevantUser || !userToWithdraw) {
			return res.status(404).json({
				context: WITHDRAW_FRIEND_REQUEST,
				errors: ['User or Requested User not found']
			});
		}

		// Check if friend request for the requestedFriendUserId exists
		if (!relevantUser.friend_requests.includes(userid)) {
			return res.status(404).json({
				context: WITHDRAW_FRIEND_REQUEST,
				errors: ['Friend request not found']
			});
		}

		// Now delete the request
		const updatedRequests = removeItemFromArray(
			relevantUser.friend_requests,
			userid
		);
		relevantUser.friend_requests = updatedRequests;

		const result = await findByIdUpdateAndReturnNewResult(
			relevantUser._id,
			relevantUser,
			'User'
		);

		return res.status(200).json({
			message: 'Friend request withdrew successfully',
			user: result
		});
	} catch (err: any) {
		return res.status(500).json({
			context: WITHDRAW_FRIEND_REQUEST,
			message:
				'WITHDRAW FRIEND REQUEST: Error while trying to withdraw a friend request',
			errors: [err.message]
		});
	}
};

/*
	To Note. Here we are looking at the point of view from a user who received a friend request but
	now they are trying to decline the friend request they received
	Example:
	- sal9 send a friend request to sal10
	- sal10 decides to decline the friend request
	- sal0 is userid
	- sal9 is userToDeclineUserId
*/
exports.decline_friend_request_delete = async function (
	req: Request,
	res: Response
) {
	try {
		const { userid, userToDeclineUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToDecline = await User.findById(userToDeclineUserId);
		if (!relevantUser || !userToDecline) {
			return res.status(404).json({
				context: DECLINE_FRIEND_REQUEST,
				errors: ['User or Requested User not found']
			});
		}

		// Now delete the request
		const updatedRequests = removeItemFromArray(
			relevantUser.friend_requests,
			userToDeclineUserId
		);
		relevantUser.friend_requests = updatedRequests;

		const result = await findByIdUpdateAndReturnNewResult(
			userid,
			relevantUser,
			'User'
		);

		return res.status(200).json({
			message: 'Friend request declined successfully',
			user: result
		});
	} catch (err: any) {
		return res.status(500).json({
			context: DECLINE_FRIEND_REQUEST,
			message:
				'DECLINE FRIEND REQUEST: Error while trying to decline a friend request',
			errors: [err.message]
		});
	}
};

// Not used
exports.remove_friend_delete = async function (req: Request, res: Response) {
	try {
		const { userid, userToRemoveUserId } = req.body;
		const relevantUser = await User.findById(userid);
		const userToRemove = await User.findById(userToRemoveUserId);
		if (!relevantUser || !userToRemove) {
			return res.status(404).json({
				context: REMOVE_FRIEND,
				errors: ['User or Requested User not found']
			});
		}

		// Remove friend from relevant users friend list
		const updatedFriendsRelevantUser = removeItemFromArray(
			relevantUser.friends,
			userToRemoveUserId
		);
		relevantUser.friends = updatedFriendsRelevantUser;
		const updatedRelevantUser = await findByIdUpdateAndReturnNewResult(
			userid,
			relevantUser,
			'User'
		);

		// Remove friend from user to delete friends list
		const updatedFriendsUserToRemove = removeItemFromArray(
			userToRemove.friends,
			userid
		);
		userToRemove.friends = updatedFriendsUserToRemove;
		const updatedUserToRemove = await findByIdUpdateAndReturnNewResult(
			userToRemoveUserId,
			userToRemove,
			'User'
		);

		return res.status(200).json({
			message: 'Friend removed successfully',
			user: updatedRelevantUser,
			user_to_remove: updatedUserToRemove
		});
	} catch (err: any) {
		console.log(
			'REMOVE FRIEND: Error while trying to remove a friend from friend list'
		);
		console.log(err);

		return res.status(500).json({
			context: REMOVE_FRIEND,
			message:
				'REMOVE FRIEND: Error while trying to remove a friend from friend list',
			errors: [err.message]
		});
	}
};
