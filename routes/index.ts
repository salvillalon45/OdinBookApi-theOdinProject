import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
