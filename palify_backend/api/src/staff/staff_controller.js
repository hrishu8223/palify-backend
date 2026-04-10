const staffService = require("../staff/staff_service");

const staffController = {};


// ✅ Add
staffController.addStaff = async (req, res) => {
  try {
    const data = await staffService.addStaff(req.body);

    res.json({
      success: true,
      message: "Staff added successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ Get
staffController.getStaff = async (req, res) => {
  try {
    const data = await staffService.getStaff();

    res.json({
      success: true,
      message: "Staff list fetched",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ Update
staffController.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await staffService.updateStaff(id, req.body);

    res.json({
      success: true,
      message: "Staff updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


// ✅ Delete
staffController.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await staffService.deleteStaff(id);

    res.json({
      success: true,
      message: "Staff deleted successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = staffController;