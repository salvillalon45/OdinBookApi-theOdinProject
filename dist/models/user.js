"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var date_fns_1 = require("date-fns");
var Schema = mongoose_1.default.Schema;
var UserSchema = new Schema({
    email: {
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
    friendRequests: [
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
        type: String
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});
UserSchema.virtual('full_name').get(function () {
    return this.first_name + ' ' + this.last_name;
});
UserSchema.virtual('date_joined').get(function () {
    return (0, date_fns_1.format)(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});
// module.exports = mongoose.model('User', UserSchema);
var User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
