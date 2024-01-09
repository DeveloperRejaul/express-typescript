import dotEnv from "dotenv"
dotEnv.config();

import {json,urlencoded}  from 'express';
import cookieParser  from 'cookie-parser';
import cors  from 'cors';
import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import settings from "./settings";
import { routes } from "./futures";
import { socketStart } from "./config/socket";

const port = process.env.PORT || 4000;


export default function App (){

	const app = express.default();
	const server:http.Server = http.createServer(app);
	const io =  socketStart(server)
    
	// io.on('connection', (socket)=>{
	// 	console.log(`user connected: ${socket.id}`);
	// 	socket.on('disconnect', () => {
	// 		console.log(`user disconnect: ${socket.id}`);
	// 	});
	// });
    
	app.use(json());
	app.use(urlencoded({extended:true}));
	app.use(cookieParser());

    
	const corsOptions ={ origin:settings.origin, credentials:true,  optionSuccessStatus:200 };
	app.use(cors(corsOptions));
	// routes.forEach(fn=> app.use('/api/v-1', fn(io)));
	app.get('/', (_req, res) => res.send({ message: 'server is ok' }));
	// app.use((req, res, next) => res.send({ message: "bad url" }));
	// app.use((err, req, res, next) => res.send({ message: "other error" }));
	server.listen(port, () => console.log(`app listening on port ${port}!`));
};