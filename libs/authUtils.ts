// Packages
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
require('dotenv').config();

async function checkValidPassword(
	foundUserPassword: string,
	inputPassword: string
) {
	const match = await bcrypt.compare(inputPassword, foundUserPassword);
	return match ? true : false;
}

async function genPassword(userPassword: string) {
	try {
		const saltRounds = 10;
		const hashPassword = await bcrypt.hash(userPassword, saltRounds);

		return hashPassword;
	} catch (err: any) {
		return `Error: ${err.message}`;
	}
}

function issueJWT(userid: string) {
	const expiresIn = '7d';
	const payload = {
		sub: userid,
		iat: Date.now()
	};
	const signedToken = jwt.sign(payload, String(process.env.SECRET_KEY), {
		expiresIn: expiresIn
	});

	return {
		token: `Bearer ${signedToken}`,
		expiresIn: expiresIn
	};
}

export { issueJWT, genPassword, checkValidPassword };
