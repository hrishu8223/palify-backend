const db = require("../config/db");

const staffService = {};


// ✅ Add Staff
staffService.addStaff = async (data) => {
  const { name, role, service_id, start_time, end_time, is_active } = data;

  const [result] = await db.query(
    `INSERT INTO staff (name, role, service_id, start_time, end_time, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, role, service_id, start_time, end_time, is_active]
  );

  const [[staff]] = await db.query(
    "SELECT * FROM staff WHERE id=?",
    [result.insertId]
  );

  return staff;
};



// ✅ Get Staff
staffService.getStaff = async () => {
  const [data] = await db.query("SELECT * FROM staff");
  return data;
};



// ✅ Update Staff
staffService.updateStaff = async (id, data) => {
  const { name, role, service_id, start_time, end_time, is_active } = data;

  await db.query(
    `UPDATE staff 
     SET name=?, role=?, service_id=?, start_time=?, end_time=?, is_active=? 
     WHERE id=?`,
    [name, role, service_id, start_time, end_time, is_active, id]
  );

  const [[updated]] = await db.query(
    "SELECT * FROM staff WHERE id=?",
    [id]
  );

  return updated;
};



// ✅ Delete Staff
staffService.deleteStaff = async (id) => {
  const [[staff]] = await db.query(
    "SELECT * FROM staff WHERE id=?",
    [id]
  );

  await db.query("DELETE FROM staff WHERE id=?", [id]);

  return staff;
};


module.exports = staffService;