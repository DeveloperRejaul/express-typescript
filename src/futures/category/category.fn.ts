import Joi from "joi";
import {type  Request, Response} from 'express'
import prisma from "../../../prisma";
const {category: Category} = prisma




/**
 * @description creating product category  
 * @param {} req 
 * @param {*} res 
 */
const fields = ['name', 'child', 'product', 'role'];

const createCategorySchema = Joi.object().keys({
	name: Joi.string().min(5).max(30).required(),
	child: Joi.array(),
	product: Joi.array()
});

export const createCategory = ()=> async (req:Request, res:Response) => {
	try {
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });

		// check all filed data type
		const { error } = createCategorySchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		// check role 
		if (req.role === 'USER' || !req.role) return res.status(200).send('Valid user required');

		const category = await Category.create({ data: { ...req.body, userId: req.id } });
		res.status(200).send(category);
	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:14 ~ export const createCategory= ~ err:', err);
		res.status(404).send('Soothing wrong');
	}

};


/**
 * @description get product category  
 * @param {} req 
 * @param {*} res 
 */
export const getCategory = ()=> async (req:Request, res:Response) => {
	try {
		const category = await Category.findMany({ include: { user: { select: { email: true, name: true } } } });
		res.status(200).send(category);
	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:32 ~ export const getCategory= ~ err:', err);
		res.status(404).send('Soothing wrong');
	}
};



/**
 * @description update product category  
 * @param {} req 
 * @param {*} res 
 */
const updateCategorySchema = Joi.object().keys({
	name: Joi.string().min(5).max(30),
	child: Joi.array(),
	product: Joi.array()
});

export const updateCategory = ()=> async (req:Request, res:Response) => {
	try {
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });

		// check all filed data type
		const { error } = updateCategorySchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		//check user role
		if (req.role === 'USER' || !req.role) return res.status(200).send('Valid user required');

		const category = await Category.update({ where: { id: req.params.id, }, data: req.body });
		res.status(200).send(category);
	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:51 ~ export const updateCategory= ~ err:', err);
		res.status(404).send('Soothing wrong');
	}

};



/**
 * @description delete product category  
 * @param {} req 
 * @param {*} res 
 */
export const deleteCategory = ()=> async (req:Request, res:Response) => {
	try {
		//check user role
		if (req.role === 'USER' || !req.role) return res.status(200).send('Valid user required');

		const category = await Category.delete({ where: { id: req.params.id } });
		res.status(200).send(category);

	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:70 ~ export const deleteCategory ~ err:', err);
		res.status(404).send('Soothing wrong');
	}
};



