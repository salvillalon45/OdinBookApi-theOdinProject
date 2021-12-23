"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mongoose & Packages
var mongoose_1 = __importDefault(require("mongoose"));
var date_fns_1 = require("date-fns");
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose_1.default.Schema;
var UserSchema = new Schema({
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
}, { toJSON: { virtuals: true } });
UserSchema.plugin(uniqueValidator);
UserSchema.virtual('full_name').get(function () {
    return this.first_name + ' ' + this.last_name;
});
UserSchema.virtual('date_joined').get(function () {
    return (0, date_fns_1.format)(new Date(this.timestamp), "MMMM dd yyyy ' at ' HH:mm");
});
var User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
