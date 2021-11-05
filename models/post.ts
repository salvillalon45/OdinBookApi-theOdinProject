import mongoose from 'mongoose';
import { format } from 'date-fns';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	timestamp: {
		type: Date,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	attached_picture: {
		type: String,
		required: false
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

PostSchema.virtual('date_posted').get(function (this: any) {
	return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});

const Post = mongoose.model('Post', PostSchema);
export default Post;
