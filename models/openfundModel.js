const db = require("../config/database");

exports.getAllFund = (result) => {
  db.query("SELECT * FROM open_fund ORDER BY tahun DESC", (err, res) => {
    result(err, res);
  });
};

exports.insertFund = (data, result) => {
  db.query("INSERT INTO open_fund SET ?", data, (err, res) => {
    result(err, res);
  });
};

exports.getFundByFilter = (tahun, instansi, result) => {
  db.query("SELECT * FROM open_fund WHERE tahun = ? AND instansi = ?", [tahun, instansi], (err, res) => {
    result(err, res);
  });
};
