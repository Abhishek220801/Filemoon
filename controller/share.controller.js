const ShareModel = require("../model/share.model")
const nodemailer = require("nodemailer")

const conn = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

const getEmailTemplate = (link) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Download Ready</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Arial, sans-serif;">

    <table width="100%" bgcolor="#f5f7fa" cellpadding="0" cellspacing="0">
    <tr>
    <td align="center">

    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden;">

    <!-- HEADER -->
    <tr>
    <td style="background:#4f46e5; padding:20px; text-align:center; color:white; font-size:22px; font-weight:bold;">
    {{company_name}}
    </td>
    </tr>

    <!-- BODY -->
    <tr>
    <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">

    <p>Hi <strong>{{client_name}}</strong>,</p>

    <p>Your requested file is ready for download.</p>

    <p style="margin:20px 0;">
    <strong>File Name:</strong> {{file_name}}
    </p>

    <!-- BUTTON -->
    <table cellpadding="0" cellspacing="0" align="center" style="margin:30px auto;">
    <tr>
    <td align="center">
    <a href="${link}" 
        style="
        background:#4f46e5;
        color:white;
        padding:14px 28px;
        text-decoration:none;
        font-size:16px;
        border-radius:6px;
        display:inline-block;
        font-weight:bold;">
        Download File
    </a>
    </td>
    </tr>
    </table>

    <p style="font-size:14px; color:#666;">
    This link will expire in <strong>{{expiry_time}}</strong>.
    </p>

    <p style="margin-top:25px;">
    If the button doesn’t work, copy and paste this link into your browser:
    </p>

    <p style="word-break:break-all; font-size:14px; color:#4f46e5;">
    {{download_link}}
    </p>

    <p style="margin-top:30px;">
    Thanks,<br>
    Team {{company_name}}
    </p>

    </td>
    </tr>

    <!-- FOOTER -->
    <tr>
    <td style="background:#f1f1f1; padding:20px; text-align:center; font-size:12px; color:#888;">
    This is an automated email. Please do not reply.
    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>
`
}

const shareFile = async (req, res) => {
  try {
    const {email, fileId} = req.body;
    const link = `http://localhost:8080/api/file/download/${fileId}`
    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Filemoon - A new file ready for download",
      // text: 'Hello from Abhishek via SMTP nodemailer',
      html: getEmailTemplate(link),
    }
    await conn.sendMail(options)
    res.status(200).json({ message: "Email sent!" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  shareFile,
}
