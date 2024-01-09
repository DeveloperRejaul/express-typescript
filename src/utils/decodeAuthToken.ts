import jwt,{ Secret, JwtPayload, } from 'jsonwebtoken'
import prisma from '../../prisma/index'

export const decodeAuthToken = async (token: string) => {
  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // if (!decoded) return null

    // if (decoded?.email) return await prisma.user.findUnique({ where: { email: decoded?.email } })
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}
