import { Router } from'express';
import { auth }  from'../../middleware/auth';
const router = Router();
import {
	createUser, getUsers, updateUser, deleteUser, getUser, loginUser, logoutUser, forgotPassword,
	newPassword,codeVerification
} from'./user.fn';


export default  (params) => {
	
	router.post('/user/login',  loginUser(params));
	router.post('/user/signup', createUser(params));
	router.post('/user/logout', logoutUser(params));
	router.post('/user/forgot-password', forgotPassword(params));
	router.post('/user/code-check', codeVerification(params));
	router.post('/user/new-password', newPassword(params));
	
	
	// all user routes 
	router.get('/auth/user', auth, getUsers(params));
	router.get('/auth/user/:id', auth, getUser(params));
	router.put('/auth/user/:id', auth, updateUser(params));
	router.delete('/auth/user/:id', auth, deleteUser(params));
	
	
	return router;
};
