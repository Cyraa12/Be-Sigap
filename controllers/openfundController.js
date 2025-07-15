const openfundModel = require("../models/openfundModel");

exports.getOpenFund = (req, res) => {
  openfundModel.getAllFund((err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(results);
  });
};

exports.createOpenFund = (req, res) => {
  const { instansi, tahun, jenis_anggaran, jumlah, realisasi } = req.body;
  const file_laporan = req.file ? `/uploads/laporan/${req.file.filename}` : null;

  const newData = { instansi, tahun, jenis_anggaran, jumlah, realisasi, file_laporan };
  openfundModel.insertFund(newData, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(201).json({ message: "Data berhasil disimpan" });
  });
};

exports.filterFund = (req, res) => {
  const { tahun, instansi } = req.query;
  openfundModel.getFundByFilter(tahun, instansi, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(result);
  });
};
