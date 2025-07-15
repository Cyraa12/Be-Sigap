const aduanModel = require("../models/aduanModel.js");
const nodemailer = require("nodemailer");

// Fungsi kirim email langsung
const sendEmailNotification = async (emailPengirim, judul, isi, bukti_file) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "ryumirza2120@gmail.com",
    subject: `Aduan Baru dari ${emailPengirim}`,
    text: `Judul: ${judul}\n\nIsi: ${isi}`,
    attachments: bukti_file
      ? [
          {
            filename: bukti_file,
            path: `./uploads/bukti/${bukti_file}`, // ✅ fix path
          },
        ]
      : [],
  };

  await transporter.sendMail(mailOptions);
};

// Tambahkan aduan
exports.createAduan = async (req, res) => {
  const { email, judul_aduan, isi_aduan } = req.body;
  const bukti_file = req.file ? req.file.filename : null;

  if (!email || !judul_aduan || !isi_aduan) {
    return res.status(400).json({ error: "Semua field wajib diisi." });
  }

  const data = { email, judul_aduan, isi_aduan, bukti_file };

  aduanModel.insertAduan(data, async (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // ✅ Kirim email notifikasi setelah berhasil insert
    try {
      await sendEmailNotification(email, judul_aduan, isi_aduan, bukti_file);
    } catch (e) {
      console.error("Gagal kirim email notifikasi:", e);
    }

    res.status(201).json({ message: "Aduan berhasil dikirim!" });
  });
};

// Ambil semua aduan
exports.getAllAduan = (req, res) => {
  aduanModel.getAllAduan((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

// Ambil aduan berdasarkan email user
exports.getAduanByEmail = (req, res) => {
  const email = req.params.email;
  aduanModel.getAduanByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

// Update aduan
exports.updateAduan = (req, res) => {
  const id = req.params.id;
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email diperlukan untuk verifikasi update." });
  }

  const data = {
    isi_aduan: req.body.isi_aduan,
    bukti_file: req.file ? req.file.filename : null,
  };

  // Ambil data lama terlebih dahulu untuk email notifikasi
  aduanModel.getAduanById(id, (err, oldAduan) => {
    if (err || !oldAduan) {
      return res.status(404).json({ error: "Aduan tidak ditemukan." });
    }

    aduanModel.updateAduan(id, email, data, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: "Aduan tidak ditemukan atau email tidak cocok." });
      }

      // Kirim notifikasi update
      try {
        await sendEmailNotification(
          oldAduan.email,
          `Laporan ${data.judul_aduan || oldAduan.judul_aduan}`,
          `Laporan telah diperbarui.\n\nLaporan : ${data.judul_aduan || oldAduan.judul_aduan}\nIsi Laporan: ${data.isi_aduan || oldAduan.isi_aduan}`,
          data.bukti_file
        );
      } catch (e) {
        console.error("Gagal kirim email notifikasi update:", e);
      }

      res.status(200).json({ message: "Aduan berhasil diperbarui." });
    });
  });
};

// Hapus aduan
exports.deleteAduan = (req, res) => {
  const id = req.params.id;
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email wajib dikirim untuk verifikasi penghapusan." });
  }

  // Ambil data lama untuk notifikasi
  aduanModel.getAduanById(id, (err, oldAduan) => {
    if (err || !oldAduan) {
      return res.status(404).json({ error: "Aduan tidak ditemukan." });
    }

    aduanModel.deleteAduan(id, email, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: "Aduan tidak ditemukan atau email tidak cocok." });
      }

      // Kirim notifikasi penghapusan
      try {
        await sendEmailNotification(
          oldAduan.email,
          `Laporan ${oldAduan.judul_aduan}`,
          `Laporan telah dihapus.`,
          null
        );
      } catch (e) {
        console.error("Gagal kirim email notifikasi delete:", e);
      }

      res.status(200).json({ message: "Aduan berhasil dihapus." });
    });
  });
};

// Balas aduan
exports.replyToAduan = (req, res) => {
  const id = req.params.id;
  const { balasan_gmail, balasan_dari } = req.body;

  if (!balasan_gmail || !balasan_dari) {
    return res.status(400).json({ error: "Field balasan wajib diisi." });
  }

  // ✅ Hanya izinkan adminsigap@gmail.com
  if (balasan_dari !== "adminsigap@gmail.com") {
    return res.status(403).json({ error: "Hanya adminsigap@gmail.com yang dapat membalas laporan." });
  }

  const waktu_balasan = new Date();
  const data = { balasan_gmail, balasan_dari, waktu_balasan };

  // Ambil data aduan lama
  aduanModel.getAduanById(id, (err, oldAduan) => {
    if (err || !oldAduan) {
      return res.status(404).json({ error: "Aduan tidak ditemukan." });
    }

    aduanModel.replyToAduan(id, data, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Kirim email notifikasi balasan ke pelapor
      try {
        await sendEmailNotification(
          oldAduan.email,
          `Laporan ${oldAduan.judul_aduan}`,
          `Halo, Laporan anda telah mendapatkan balasan:\n"${balasan_gmail}", Mohon cek kambali di aplikasi Sigap Anda.`,
          null
        );
      } catch (e) {
        console.error("Gagal kirim notifikasi balasan:", e);
      }

      res.status(200).json({ message: "Balasan aduan berhasil disimpan dan dikirim ke email." });
    });
  });
};
