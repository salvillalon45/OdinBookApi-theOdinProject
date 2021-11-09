import { Request } from 'express';
const multer = require('multer');

const DIR = './public/images';

const storage = multer.diskStorage({
	destination: function (req: Request, file: any, cb: any) {
		cb(null, DIR);
	},
	filename: (req: Request, file: any, cb: any) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, Date.now() + '-' + fileName);
	}
});

export const upload = multer({
	storage: storage,
	fileFilter: function (req: Request, file: any, cb: any) {
		const { mimetype } = file;
		if (
			mimetype == 'image/png' ||
			mimetype == 'image/jpg' ||
			mimetype == 'image/jpeg'
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	}
});

// module.exports = multer({
// 	storage: storage,
// 	fileFilter: (req: Request, file: any, cb: any) => {
// 		const { mimetype } = file;
// 		if (
// 			mimetype == 'image/png' ||
// 			mimetype == 'image/jpg' ||
// 			mimetype == 'image/jpeg'
// 		) {
// 			cb(null, true);
// 		} else {
// 			cb(null, false);
// 			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
// 		}
// 	}
// });
