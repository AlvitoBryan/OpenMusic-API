const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    const message = {
      from: process.env.SMTP_USER,
      to: targetEmail,
      subject: 'Ekspor Playlist',
      text: 'Terlampir hasil ekspor playlist Anda.',
      attachments: [
        {
          filename: 'playlist.json',
          content,
        },
      ],
    };

    await this._transporter.sendMail(message);
  }
}

module.exports = MailSender;

