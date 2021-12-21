// Mongoose & Packages
import mongoose from 'mongoose';
import { format } from 'date-fns';
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: {
			unique: true,
			type: String,
			required: true
		},
		first_name: {
			required: true,
			type: String
		},
		last_name: {
			required: true,
			type: String
		},
		password: {
			type: String,
			required: true
		},
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		friend_requests: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		timestamp: {
			type: Date,
			required: true
		},
		profile_pic_url: {
			type: String,
			required: false
		}
	},
	{ toJSON: { virtuals: true } }
);

UserSchema.plugin(uniqueValidator);

UserSchema.virtual('full_name').get(function (this: any) {
	return this.first_name + ' ' + this.last_name;
});

UserSchema.virtual('date_joined').get(function (this: any) {
	return format(new Date(this.timestamp), "MMMM dd yyyy ' at ' HH:mm");
});

const User = mongoose.model('User', UserSchema);
export default User;
