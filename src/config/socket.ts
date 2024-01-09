import * as socketIo from "socket.io";
import * as http from "http";
import settings from '../settings'
import { decodeAuthToken } from '../utils/decodeAuthToken'


export const socketStart = (server :http.Server ) => {
  const io = new socketIo.Server(server, { cors: { origin:settings.origin}, pingInterval: 6000 })
  io.use(async (socket, next) => {
    if(typeof socket.handshake.headers?.token === "string"){
      const token = socket.handshake.headers?.token?.split(" ")[1];
      if(token!==undefined){
        const user = await decodeAuthToken(token);
        // if (!user) next(Error('Unauthorized user'))
        // socket.join(user.id)
        // next()
      }
    }
  })
  return io
}

// const token = socket.handshake?.headers?.token?.split(' ')[1]
//     if (token) {
//       const user = await decodeAuthToken(token)
//       if (!user) next(Error('Unauthorized user'))
//       socket.join(user?.id)
//       next()
//     }