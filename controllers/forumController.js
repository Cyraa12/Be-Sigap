const forumModel = require("../models/forumModel");

// Buat thread baru
exports.createThread = (req, res) => {
  const { email, judul, isi } = req.body;

  if (!email || !judul || !isi) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  forumModel.insertThread(email, judul, isi, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Thread berhasil dibuat", data: result });
  });
};

// Tambah komentar ke thread
exports.addComment = (req, res) => {
  const { thread_id, email, komentar } = req.body;

  if (!thread_id || !email || !komentar) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  forumModel.insertComment(thread_id, email, komentar, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Komentar berhasil ditambahkan", data: result });
  });
};

// Ambil semua komentar dari thread tertentu
exports.getCommentsByThread = (req, res) => {
  const thread_id = req.params.id;

  forumModel.selectCommentsByThread(thread_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

// Laporkan komentar atau thread
exports.reportContent = (req, res) => {
  const { reported_by_email, thread_id, comment_id, alasan } = req.body;

  if (!reported_by_email || !alasan || (!thread_id && !comment_id)) {
    return res.status(400).json({ error: "Field tidak lengkap" });
  }

  forumModel.insertReport(reported_by_email, thread_id || null, comment_id || null, alasan, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Laporan berhasil dikirim", data: result });
  });
};

// === EDIT THREAD ===
exports.editThread = (req, res) => {
  const id = req.params.id;
  const { email, judul, isi } = req.body;

  forumModel.updateThreadById(id, email, judul, isi, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Thread berhasil diupdate" });
  });
};

// === DELETE THREAD ===
exports.deleteThread = (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  forumModel.deleteThreadById(id, email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Thread berhasil dihapus" });
  });
};

// === EDIT KOMENTAR ===
exports.editComment = (req, res) => {
  const id = req.params.id;
  const { email, komentar } = req.body;

  forumModel.updateCommentById(id, email, komentar, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Komentar berhasil diupdate" });
  });
};

// === DELETE KOMENTAR ===
exports.deleteComment = (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  forumModel.deleteCommentById(id, email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Komentar berhasil dihapus" });
  });
};

exports.getAllThreads = (req, res) => {
  forumModel.getAllThreads((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil thread", error: err });
    }
    res.status(200).json(results);
  });
};