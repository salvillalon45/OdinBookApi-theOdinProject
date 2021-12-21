// Mongoose & Packages
import mongoose from 'mongoose';
import { format } from 'date-fns';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
	{
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
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		post_ref: {
			type: Schema.Types.ObjectId,
			ref: 'Post',
			required: true
		}
	},
	{ toJSON: { virtuals: true } }
);

CommentSchema.virtual('date_commented').get(function (this: any) {
	return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
