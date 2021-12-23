"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mongoose & Packages
var mongoose_1 = __importDefault(require("mongoose"));
var date_fns_1 = require("date-fns");
var Schema = mongoose_1.default.Schema;
var CommentSchema = new Schema({
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
}, { toJSON: { virtuals: true } });
CommentSchema.virtual('date_commented').get(function () {
    return (0, date_fns_1.format)(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});
var Comment = mongoose_1.default.model('Comment', CommentSchema);
exports.default = Comment;
