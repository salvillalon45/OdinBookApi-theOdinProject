"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer = require('multer');
var DIR = './public/images';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName);
    }
});
var fileFilter = function (req, file, cb) {
    var mimetype = file.mimetype;
    if (mimetype == 'image/png' ||
        mimetype == 'image/jpg' ||
        mimetype == 'image/jpeg') {
        cb(null, true);
    }
    else {
        // rejects storing a file
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
