// lib/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendAduanNotification = (aduan) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "feiticeiraz.n@gmail.com",
    subject: `Aduan Baru dari ${aduan.email}`,
    text: `Judul: ${aduan.judul_aduan}\n\nIsi: ${aduan.isi_aduan}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Gagal kirim email notifikasi:", error);
    }
    console.log("Email notifikasi berhasil dikirim:", info.response);
  });
};
