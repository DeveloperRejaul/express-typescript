import Joi from "joi";
import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import prisma from "../../../prisma";
import { sendMail } from "../../config/mail";
import { type Request, Response } from "express";

const {user:User} = prisma
/**
 * @description this function using for create user
 * @param {*} req 
 * @param {*} res 
 * @returns create user object 
 */
const requiredFields = ['email', 'password', 'name'];
const fields = ['email', 'password', 'name', 'location'];

const createUserSchema = Joi.object().keys({
	name: Joi.string().min(4).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(15).required(),
	address: Joi.object().keys({ street: Joi.string(), city: Joi.string(), state: Joi.string(), zip: Joi.string() })
});
export const createUser = () => async (req:Request, res:Response) => {

	try {
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });

		// check all requeued filed 
		if (!Object.keys(req.body).every(f => requiredFields.includes(f))) return res.status(201).send('fields is missing');

		// check all filed data type
		const { error } = createUserSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		// check mail unique
		if (req.body.email) {
			const existUser = await User.findUnique({ where: { email: req.body.email } });
			if (existUser) return res.status(400).send('Email already exists');
		}

		// bcrypt user password
		req.body.password = await bcrypt.hash(req.body.password, 10);

		// creating user 
		const user = await User.create({ data: req.body });
		res.status(200).send(user);
	} catch (err) {
		console.log(err);
		if (err.code === 'P2002') return res.status(203).send('Email Already exists ');
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for get all users
 * @param {*} req 
 * @param {*} res 
 * @returns all user data array of object  
 */
export const getUsers = ()=> async (req:Request, res:Response) => {
	try {
		const users = await User.findMany();
		res.status(200).send(users);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for get single user
 * @param {*} req 
 * @param {*} res 
 * @returns single user object  
 */
export const getUser = ()=> async (req:Request, res:Response) => {
	try {
		const user = await User.findUnique({ where: { id: req.params.id } });
		res.status(200).send(user);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};



/**
 * @description this function using for update user
 * @param {*} req 
 * @param {*} res 
 * @returns updated user
 */
const updateUserSchema = Joi.object().keys({
	name: Joi.string().min(4).max(30),
	email: Joi.string().email(),
	password: Joi.string().min(6).max(15),
	address: Joi.object().keys({ street: Joi.string(), city: Joi.string(), state: Joi.string(), zip: Joi.string() })
});
export const updateUser = ()=> async (req:Request, res:Response) => {
	try {
		// check all filed data type
		const { error } = updateUserSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		// password bcrypt
		if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);

		//  updating user 
		const user = await User.update({ where: { id: req.params.id }, data: req.body });
		res.status(200).send(user);

	} catch (error) {
		console.log(err);
		if (err.code === 'P2002') return res.status(203).send('Email Already exists ');
		res.status(500).send('soothing wrong');
	}
};



/**
 * @description this function using for delete user
 * @param {*} req 
 * @param {*} res 
 * @returns deleted user
 */
export const deleteUser = ()=> async (req:Request, res:Response) => {
	try {
		const user = await User.delete({ where: { id: req.params.id } });
		res.status(200).send(user);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for forget password
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
export const forgotPassword = ()=> async (req:Request, res:Response) => {
	try {
		// check mail exists 
		const user = await User.findUnique({ where: { email: req.body.email } });
		if (!user) return res.status(401).send('Your mail invalid');

		// create token 
		const date = Date.now();
		const code = Math.floor(1000 + Math.random() * 9000);
		const token = CryptoJS.AES.encrypt(JSON.stringify({ code, date, email: user.email }), process.env.JWT_SECRET).toString();
		await sendMail({ to: req.body.email, subject: 'Forgot Password verification code', text: `${code}` });
		res.status(200).send({ token });
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for forget password verification code check 
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const maxTime = 20 * 60 * 1000;
const codeSchema = Joi.object().keys({
	code: Joi.number().min(4).required(),
	token: Joi.string().required(),
});
export const codeVerification = ()=> async (req:Request, res:Response) => {
	try {
		// check valid data
		const { error } = codeSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		const bytes = CryptoJS.AES.decrypt(req.body.token, process.env.JWT_SECRET);
		const decode = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		const timeDiff = Date.now() - decode.date;

		//  check time limit 
		if (timeDiff > maxTime) return res.status(201).send('Maximum time limit expirer');

		//  check code valid
		if (decode.code !== req.body.code) return res.status(201).send('Code is not valid');

		res.status(200).send({ message: 'success', email: decode.email });
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};

/**
 * @description this function using for forget password
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const passwordSchema = Joi.object().keys({
	password: Joi.string().min(6).max(15).required(),
	token: Joi.string(),
});
export const newPassword = ()=> async (req:Request, res:Response) => {
	try {
		// check valid data
		const { error } = passwordSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		const bytes = CryptoJS.AES.decrypt(req.body.token, process.env.JWT_SECRET);
		const decode = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		const timeDiff = Date.now() - decode.date;

		//  check time limit 
		if (timeDiff > maxTime) return res.status(201).send('Maximum time limit expirer');

		//  password bcrypt
		req.body.password = await bcrypt.hash(req.body.password, 10);
		const user = await User.update({ where: { email: decode.email }, data: { password: req.body.password } });
		res.status(200).send(user);
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for logout user
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
export const logoutUser = ()=> async (req:Request, res:Response) => {
	try {
		console.log(req);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};

/**
 * @description this function using for login user
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const requiredField = ['email', 'password', 'isRemember'];

const loginUserSchema = Joi.object().keys({
	email: Joi.string().email(),
	password: Joi.string().min(6).max(15),
	isRemember: Joi.boolean()
});
export const loginUser = () => async (req:Request, res:Response) => {
	try {
		
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!requiredField.includes(k)) delete req.body[k]; });

		// check all requeued filed  
		if (!Object.keys(req.body).every(f => requiredField.includes(f))) return res.status(201).send('fields is missing');

		// check all filed data type
		const { error } = loginUserSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');


		const user = await User.findUnique({ where: { email: req.body.email } });
		if (!user) return res.status(200).send('Password or Email invalid');


		// check password valid
		const isValid = await bcrypt.compare(req.body.password, user.password);
		if (!isValid) return res.status(200).send('Password or Email invalid');

		// creating web token  
		user.token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie(process.env.JWT_SECRET, user.token, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			...req.body.isRemember && { expires: new Date(Date.now() + 172800000/*2 days*/) },
		});
		res.status(200).send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('soothing wrong');
	}

};

