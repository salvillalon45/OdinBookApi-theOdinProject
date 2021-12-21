// Express & Packages
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

const fileFilter = (req: Request, file: any, cb: any) => {
	const { mimetype } = file;
	if (
		mimetype == 'image/png' ||
		mimetype == 'image/jpg' ||
		mimetype == 'image/jpeg'
	) {
		cb(null, true);
	} else {
		// rejects storing a file
		cb(null, false);
		return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
	}
};

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});
