const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require('dotenv').config();
import User from '../models/user';

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET_KEY
		},
		async function (
			jwtPayload: string,
			done: (arg0: null, arg1: boolean) => any
		) {
			try {
				const user = await User.findById(jwtPayload.sub);
				console.log('PASSPORT JWT STRATEGY: What is User');
				console.log(user);
				return done(null, user);
			} catch (err) {
				console.log(
					'PASSPORT JWT STRATEGY: Error when verifying token'
				);
				console.log(err);
				return done(null, false);
			}
		}
	)
);
