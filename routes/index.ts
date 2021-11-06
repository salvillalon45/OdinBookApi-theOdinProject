import express from 'express';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
	return res.status(200).json('Hey there');
});

export default router;
