import { Request, Response ,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma'
const {user:User} = prisma;


export const auth = async (req:Request, res:Response, next:NextFunction) => {

	try {
		if (!req.headers.authorization) return res.status(400).send('Authorization Token Required');
		const token = req.headers.authorization.split(' ')[1];
		if (!token) return res.status(400).send('Atomization failed');

		const user = jwt.decode(token);
		if (!user) return res.status(400).send('Atomization failed');

		// check user exists
		const userExists = await User.findUnique({ where: { id: user.id } });
		if (!userExists) return res.status(400).send('Atomization failed');
		req.email = user.email;
		req.id = user.id;
		req.role = user.role;
		next();
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}

};