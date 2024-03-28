import nodemailer from 'nodemailer'
import { NODEMAILER_PASSWORD, NODEMAILER_USER } from '../../config/config.js'

class GmailEmailService {

  constructor() {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD
      }
    })
  }

  async send(destinatario, asunto, mensaje, adjuntos = []) {
    const emailOptions = {
      from: NODEMAILER_USER,
      to: destinatario,
      subject: asunto,
      text: mensaje
    }

    if (adjuntos.length > 0) {
      emailOptions.attachments = adjuntos
    }

    await this.transport.sendMail(emailOptions)
  }
}

export const gmailEmailService = new GmailEmailService()
