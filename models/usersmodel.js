const db = require("../config/database.js");

// get all user
module.exports.getAllUser = (result) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results); // <-- JANGAN results[0], kirim SEMUA
    }
  });
};

module.exports.getEmail = (result) => {
  db.query("SELECT email FROM users", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results); // <-- JANGAN results[0]
    }
  });
};

module.exports.getInstansi = (result) => {
  db.query("SELECT instansi FROM users", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results); // <-- JANGAN results[0]
    }
  });
};

// get single user
// models/usersmodel.js
module.exports.getUserByEmail = (email, result) => {
  db.query(
    "SELECT instansi, nama, email FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};



module.exports.getNamaByEmail = (email, result) => {
  db.query("SELECT nama FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results); // <-- kirim semua hasil
    }
  });
};

// get single user
module.exports.getUserByInstansi = (instansi, result) => {
  db.query("SELECT instansi, email, password FROM users WHERE instansi = ?", [instansi], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results); // <-- kirim semua hasil
    }
  });
};

// insert User
module.exports.insertUser = (data, result) => {
  db.query("INSERT INTO users SET ?", data, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

module.exports.getUserCountByDate = (result) => {
  db.query(
    "SELECT DATE(created_at) AS date, COUNT(*) AS total_users FROM users GROUP BY DATE(created_at) ORDER BY date DESC",
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

module.exports.updateUserByEmail = (data, email, result) => {
  db.query(
    "UPDATE users SET instansi = ?, nama = ?, password = ? WHERE email = ?",
    [data.instansi, data.nama, data.password, email],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};


module.exports.loginUserr = (instansi, email, password, result) => {
  db.query("SELECT instansi, nama, email, password FROM users WHERE instansi = ? AND email = ? AND password=?", [instansi, email, password], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
};

// models/usersmodel.js
module.exports.getNamaInstansiByEmail = (email, result) => {
  db.query(
    "SELECT nama, instansi, password FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results[0]); // hasil hanya satu user
      }
    }
  );
};


