const usersModel = require("../models/usersmodel.js");
var jwt = require("jsonwebtoken");

// get all Users
exports.allUsers = (req, res) => {
  usersModel.getAllUser((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};


exports.allEmail = (req, res) => {
  try {
  usersModel.getEmail((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
} catch (error) {
  res.status(error).send(error);
}
};

exports.allInstansi = (req, res) => {
  try {
  usersModel.getInstansi((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
} catch (error) {
  res.status(error).send(error);
}
};

// get single user
exports.showAUser = (req, res) => {
  const email = req.params.email;

  usersModel.getUserByEmail(email, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Server error" });
    } else if (!results || results.length === 0) {
      res.status(404).json({ error: "User tidak ditemukan" });
    } else {
      res.status(200).json(results[0]); // kirim instansi, nama, email
    }
  });
};


exports.loginUser = (req, res) => {
  const { instansi, email, password } = req.body;

  usersModel.loginUserr(instansi, email, password, (err, user) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!user) return res.status(401).json({ error: "Email atau password salah" });

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      email: user.email,
      nama: user.nama,
      instansi: user.instansi
    });
  });
};

// create user
exports.createAccount = (req, res) => {
  const data = req.body;
  usersModel.insertUser(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

exports.getEmailDay = (req, res) => {
  usersModel.getUserCountByDate((err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ data: results });
    }
  });
};

// update user_email
exports.updateUser = (req, res) => {
  const data = req.body;
  const email = req.params.email;

  usersModel.updateUserByEmail(data, email, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

exports.getNamaUser = (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ error: "Email tidak boleh kosong" });
  }

  usersModel.getNamaByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal mengambil data nama" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Nama tidak ditemukan untuk email tersebut" });
    }

    res.status(200).json({ nama: results[0].nama });
  });
};

exports.getProfile = (req, res) => {
  const email = req.user.email; // Email dari token JWT yang valid

  usersModel.getUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(results[0]); // kirim data profil
  });
};

// controllers/users.js
exports.getNamaInstansiUser = (req, res) => {
  const email = req.params.email;

  usersModel.getNamaInstansiByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!result) return res.status(404).json({ error: "User tidak ditemukan" });

    res.status(200).json(result); // kirim nama dan instansi
  });
};

