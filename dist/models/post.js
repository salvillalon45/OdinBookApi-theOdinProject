"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mongoose & Packages
var mongoose_1 = __importDefault(require("mongoose"));
var date_fns_1 = require("date-fns");
var Schema = mongoose_1.default.Schema;
var PostSchema = new Schema({
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
}, { toJSON: { virtuals: true } });
PostSchema.virtual('date_posted').get(function () {
    return (0, date_fns_1.format)(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});
var Post = mongoose_1.default.model('Post', PostSchema);
exports.default = Post;
