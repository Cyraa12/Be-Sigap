const db = require("../config/database.js");

// Buat aduan baru
// Tambah aduan dengan file bukti
exports.insertAduan = (data, result) => {
  const query = `
    INSERT INTO aduan (email, judul_aduan, isi_aduan, bukti_file)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    query,
    [data.email, data.judul_aduan, data.isi_aduan, data.bukti_file],
    (err, res) => {
      if (err) return result(err, null);
      result(null, res);
    }
  );
};


// Ambil semua aduan dan nama user
exports.getAllAduan = (result) => {
  const query = `
    SELECT a.*, u.nama, u.instansi 
    FROM aduan a
    INNER JOIN users u ON a.email = u.email
    ORDER BY a.created_at DESC
  `;
  db.query(query, (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// Ambil aduan berdasarkan email
exports.getAduanByEmail = (email, result) => {
  const query = `
    SELECT a.*, u.nama, u.instansi 
    FROM aduan a
    INNER JOIN users u ON a.email = u.email
    WHERE a.email = ?
    ORDER BY a.created_at DESC
  `;
  db.query(query, [email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

exports.updateAduan = (id, email, data, result) => {
  const query = `
    UPDATE aduan SET judul_aduan = ?, isi_aduan = ?, bukti_file = ?
    WHERE id = ? AND email = ?
  `;
  db.query(query, [data.judul_aduan, data.isi_aduan, data.bukti_file, id, email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

exports.deleteAduan = (id, email, result) => {
  const query = `DELETE FROM aduan WHERE id = ? AND email = ?`;
  db.query(query, [id, email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};


// Dapatkan detail aduan berdasarkan ID
exports.getAduanById = (id, result) => {
  const query = `SELECT * FROM aduan WHERE id = ?`;
  db.query(query, [id], (err, res) => {
    if (err) return result(err, null);
    result(null, res[0]); // ambil data pertama
  });
};

// Update balasan aduan
exports.replyToAduan = (id, data, result) => {
  const query = `
    UPDATE aduan 
    SET balasan_gmail = ?, balasan_dari = ?, waktu_balasan = ?
    WHERE id = ?
  `;
  db.query(
    query,
    [data.balasan_gmail, data.balasan_dari, data.waktu_balasan, id],
    (err, res) => {
      if (err) return result(err, null);
      result(null, res);
    }
  );
};
