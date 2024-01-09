import { Router } from'express';
import { createCategory, getCategory, updateCategory, deleteCategory } from'./category.fn';
import { auth }from'../../middleware/auth';
const router = Router();


export default (params) =>{
	router.post('/category', auth, createCategory(params));
	router.get('/category', auth, getCategory(params));
	router.put('/category/:id', auth, updateCategory(params));
	router.delete('/category/:id', auth, deleteCategory(params));  
    
	return router;
};