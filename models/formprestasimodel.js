const db = require("../config/database.js");
const fs = require("fs").promises;

// get all data
exports.getDataPrestasi = (result) => {
  db.query("SELECT * FROM `students` ORDER BY created_at DESC ", (err, results) => {
    if (err) {
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

exports.getDataFotoSiswa = (result) => {
  db.query("SELECT photo FROM students", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

exports.getDataRata = (result) => {
  db.query("SELECT rata FROM students", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// get single id data
exports.getDataIdPrestasi = (id, result) => {
  db.query("SELECT * FROM students WHERE data_id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
};

exports.getDataNisnPrestasi = (nisn, result) => {
  db.query("SELECT * FROM students WHERE nisn = ? ORDER BY data_id DESC LIMIT 1", [nisn], (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

// insert data prestasi
exports.insertDataPrestasi = (data, result) => {
  db.query("INSERT INTO students SET ?", data, (err, results) => {
    if (err) {
      result(err, null);
    } else {
      // setelah insert, ambil data yang baru
      const insertedId = results.insertId;
      db.query("SELECT * FROM students WHERE data_id = ?", [insertedId], (err2, insertedData) => {
        if (err2) {
          result(err2, null);
        } else {
          result(null, insertedData[0]); // ini yang dikirim ke frontend
        }
      });
    }
  });
};


// update form by email
module.exports.updateFormByNisn = (data, nisn, result) => {
  if (!data.decision || !nisn) {
    return result(new Error('Decision atau NISN tidak boleh kosong.'), null);
  }

  db.query(
    "UPDATE students SET decision = ? WHERE nisn = ?",
    [data.decision, nisn],
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


module.exports.deleteFormById = (id, result) => {
  try {
    db.query("SELECT * FROM students WHERE data_id = ?", [id], async (err, results) => {
      if (err) {
        result(err, null);
        return;
      }
      
      if (results.length === 0) {
        // Tidak ada data ditemukan
        result(new Error('Data tidak ditemukan.'), null);
        return;
      }

      const data = results[0];
      const filesToDelete = [data.photo];

      try {
        // Hapus file
        const deletePromises = filesToDelete.map((filePath) => fs.unlink("uploads" + filePath));
        await Promise.all(deletePromises);
        console.log("All files deleted successfully");
      } catch (fileErr) {
        console.error("Error deleting files:", fileErr);
      }

      // Hapus dari database
      db.query("DELETE FROM students WHERE data_id = ?", [id], (err, deleteResults) => {
        if (err) {
          console.log(err);
          result(err, null);
        } else {
          result(null, deleteResults);
        }
      });
    });
  } catch (err) {
    result(err, null);
  }
};

module.exports.updateStudentByNisn = (data, nisn, result) => {
  const { nama, wali, phone, rata } = data;

  db.query(
    `UPDATE students 
     SET nama = ?, wali = ?, phone = ?, rata = ? 
     WHERE nisn = ?`,
    [nama, wali, phone, rata, nisn],
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
