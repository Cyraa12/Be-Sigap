const formPrestasiModel = require("../models/formprestasimodel.js");

// get all data prestasi
exports.showDataPrestasi = (req, res) => {
  try {
    formPrestasiModel.getDataPrestasi((err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showDataFotoSiswa = (req, res) => {
  try {
    formPrestasiModel.getDataFotoSiswa((err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(error).send(error);
  }
};

exports.showDataRata = (req, res) => {
  try {
    formPrestasiModel.getDataRata((err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(error).send(error);
  }
};

// get single data id
exports.showIdPrestasi = (req, res) => {
  try {
    formPrestasiModel.getDataIdPrestasi(req.params.id, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showNisnPrestasi = (req, res) => {
  try {
    formPrestasiModel.getDataNisnPrestasi(req.users.nisn, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const filePath = (obj) => {
  return `/${obj.fieldname}/${obj.filename}`;
};

exports.createDataPrestasi = (req, res) => {
  try {
    const formValue = req.body;
    const filesValue = req.files;
    const photo = filePath(filesValue["photo"][0]); // dapetin path foto

    const dataPrestasi = { ...formValue, photo };
    formPrestasiModel.insertDataPrestasi(dataPrestasi, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(201).json(results); // balikin data yang sudah di-insert
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.updateForm = (req, res) => {
  try {
    const data = req.body;
    const nisn = req.params.nisn;

    if (!data.decision) {
      return res.status(400).json({ message: "Decision harus diisi." });
    }

    formPrestasiModel.updateFormByNisn(data, nisn, (err, results) => {
      if (err) {
        console.error('Error updating form:', err);
        res.status(400).json({ message: "Gagal update form.", error: err });
      } else {
        res.status(200).json({
          message: "Form berhasil diupdate.",
          updated: results
        });
      }
    });
  } catch (error) {
    console.error('Unexpected server error:', error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};


exports.deleteForm = (req, res) => {
  const id = req.params.data_id;
  formPrestasiModel.deleteFormById(id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ ...results });
    }
  });
};

exports.updateStudent = (req, res) => {
  try {
    const data = req.body;
    const nisn = req.params.nisn;

    formPrestasiModel.updateStudentByNisn(data, nisn, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
