const db = require("../config/database");

// ==== THREADS ====

// Buat thread baru
exports.insertThread = (email, judul, isi, result) => {
  const query = "INSERT INTO forum_threads (email, judul, isi) VALUES (?, ?, ?)";
  db.query(query, [email, judul, isi], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// ==== KOMENTAR ====

// Tambahkan komentar ke thread
exports.insertComment = (thread_id, email, komentar, result) => {
  const query = "INSERT INTO forum_comments (thread_id, email, komentar) VALUES (?, ?, ?)";
  db.query(query, [thread_id, email, komentar], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// Ambil komentar berdasarkan thread_id
exports.selectCommentsByThread = (thread_id, result) => {
  const query = `
    SELECT fc.*, u.nama 
    FROM forum_comments fc
    JOIN users u ON fc.email = u.email
    WHERE fc.thread_id = ?
    ORDER BY fc.created_at ASC
  `;
  db.query(query, [thread_id], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// ==== LAPORAN ====

// Laporkan thread atau komentar
exports.insertReport = (reported_by_email, thread_id, comment_id, alasan, result) => {
  const query = `
    INSERT INTO forum_reports (reported_by_email, thread_id, comment_id, alasan)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [reported_by_email, thread_id, comment_id, alasan], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// === EDIT THREAD ===
exports.updateThreadById = (id, email, judul, isi, result) => {
  const query = `
    UPDATE forum_threads 
    SET judul = ?, isi = ? 
    WHERE id = ? AND email = ?`;
  db.query(query, [judul, isi, id, email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// === DELETE THREAD ===
exports.deleteThreadById = (id, email, result) => {
  const query = `DELETE FROM forum_threads WHERE id = ? AND email = ?`;
  db.query(query, [id, email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// === EDIT KOMENTAR ===
exports.updateCommentById = (id, email, komentar, result) => {
  const query = `
    UPDATE forum_comments 
    SET komentar = ? 
    WHERE id = ? AND email = ?`;
  db.query(query, [komentar, id, email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// === DELETE KOMENTAR ===
exports.deleteCommentById = (id, email, result) => {
  const query = `DELETE FROM forum_comments WHERE id = ? AND email = ?`;
  db.query(query, [id, email], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

module.exports.getAllThreads = (result) => {
  const query = `
    SELECT ft.*, u.nama 
    FROM forum_threads ft 
    JOIN users u ON ft.email = u.email 
    ORDER BY ft.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error saat mengambil threads:", err);
      return result(err, null);
    }
    result(null, results);
  });
};