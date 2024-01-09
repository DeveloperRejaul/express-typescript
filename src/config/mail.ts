import { createTransport } from 'nodemailer'

import { type ISendMail } from './type'

const transporter = createTransport({
  host: process.env.HOST_DOMAIN,
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})

export const sendMail = async ({ to, subject, text, html }: ISendMail): Promise<void> => {
  try {
    transporter.sendMail({ from: process.env.MAIL_FROM, subject, to, text, html }, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
