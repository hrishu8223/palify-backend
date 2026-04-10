const { getDashboardService } = require("../admin/admin_service");

const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
