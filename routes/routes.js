const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/auth.js");
const fileFilter = function (req, file, cb) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf"
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Only images and PDF files are allowed");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }

  cb(null, true);
};


const checkAndCreateFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathFolder = path.join(__dirname, `../uploads/${file.fieldname}`);
    checkAndCreateFolder(pathFolder);
    cb(null, pathFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: diskStorage,
  fileFilter: fileFilter,  // <-- ini baru benar, fileFilter di sini
});

const { allUsers, showAUser, createAccount, updateUser, loginUser, allEmail, allInstansi, getEmailDay, getNamaUser, getProfile, getNamaInstansiUser } = require("../controllers/users.js");
const { getOpenFund, createOpenFund, filterFund } = require("../controllers/openfundController.js");
const {
  createThread,
  getAllThreads,
  addComment,
  getCommentsByThread,
  reportContent,
  editThread,
  deleteThread,
  editComment,
  deleteComment,
} = require("../controllers/forumController");
const { createAduan,
  getAllAduan,
  getAduanByEmail,
  updateAduan,
  deleteAduan
 } = require("../controllers/aduanController.js");

// init express router
const router = express.Router();

////////////////////////// USER ////////////////////////////////

// get all user
router.get("/api/users", allUsers);
router.get("/api/email", allEmail);
router.get("/api/instansi", allInstansi);
router.get("/api/emailday", getEmailDay);
router.get("/api/users/nama/:email", getNamaUser);

router.post("/api/users/login", loginUser);
// get  user
router.get("/api/users/:email", showAUser);
router.get("/api/profile", verifyToken, getProfile);
router.get("/api/users/nama-instansi/:email", getNamaInstansiUser);

// create account
router.post("/api/users", createAccount);

//update user
router.put("/api/users/:email", updateUser);

////////////////////////// OPEN FUND ////////////////////////////////

// fileFilter tetap digunakan untuk filter gambar, jadi untuk OpenFund file PDF jangan difilter
const openFundStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.join(__dirname, "../uploads/laporan");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, "laporan-" + Date.now() + path.extname(file.originalname));
  },
});

const openFundUpload = multer({ storage: openFundStorage });

// GET semua open fund
router.get("/api/openfund", getOpenFund);

// GET filter berdasarkan query param (misal ?tahun=2024&instansi=SMAN1)
router.get("/api/openfund/filter", filterFund);

// POST open fund baru (upload file)
router.post("/api/openfund", openFundUpload.single("file_laporan"), createOpenFund);

////////////////////////// FORUM ////////////////////////////////

router.post("/api/forum/thread", createThread);
router.get("/api/forum/threads", getAllThreads);
router.post("/api/forum/comment", addComment);
router.get("/api/forum/comment/:id", getCommentsByThread);
router.post("/api/forum/report", reportContent);

// Edit dan Hapus Thread
router.put("/api/forum/thread/:id", editThread);
router.delete("/api/forum/thread/:id", deleteThread);

// Edit dan Hapus Komentar
router.put("/api/forum/comment/:id", editComment);
router.delete("/api/forum/comment/:id", deleteComment);

// Storage khusus untuk file bukti aduan (dokumen, gambar, PDF)
const aduanStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.join(__dirname, "../uploads/bukti");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, "bukti-" + Date.now() + path.extname(file.originalname));
  }
});

const aduanUpload = multer({ storage: aduanStorage });
const { replyToAduan } = require("../controllers/aduanController.js");

// API Aduan
router.post("/api/aduan", aduanUpload.single("bukti_file"), createAduan);
router.get("/api/aduan", getAllAduan);
router.get("/api/aduan/:email", getAduanByEmail);
router.put("/api/aduan/:id", aduanUpload.single("bukti_file"), updateAduan);
router.delete("/api/aduan/:id", deleteAduan);
// Balas aduan
router.put("/api/aduan/:id/reply", replyToAduan);

// Export router
module.exports = router;
