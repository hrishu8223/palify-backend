const {
  getBusinessesService,
  getBusinessDetailsService,
  setBusinessStatusService,
  toggleBusinessBlockService,
  getSubscriptionPlansService,
  getBusinessSubscriptionsService,
  grantFreeMonthsService,
  grantLifetimeService,
  overrideSubscriptionService,
  getRevenueReportService,
} = require("./admin_panel_extra_service");

const getBusinesses = async (req, res) => {
  try {
    const data = await getBusinessesService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBusinessDetails = async (req, res) => {
  try {
    const data = await getBusinessDetailsService(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveBusiness = async (req, res) => {
  try {
    const data = await setBusinessStatusService(req.params.id, "approved", req.body?.notes || null);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectBusiness = async (req, res) => {
  try {
    const data = await setBusinessStatusService(req.params.id, "rejected", req.body?.notes || null);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBusinessStatus = async (req, res) => {
  try {
    const data = await setBusinessStatusService(req.params.id, req.body?.status, req.body?.notes || null);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBusinessBlock = async (req, res) => {
  try {
    const data = await toggleBusinessBlockService(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const data = await getBusinessSubscriptionsService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptionPlans = async (req, res) => {
  try {
    const data = await getSubscriptionPlansService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const grantFreeMonths = async (req, res) => {
  try {
    const months = Number(req.body?.months);
    if (!months || months < 1) {
      return res.status(400).json({ message: "Valid months value is required" });
    }

    const data = await grantFreeMonthsService(req.params.businessId, months);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const grantLifetimeAccess = async (req, res) => {
  try {
    const data = await grantLifetimeService(req.params.businessId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const overrideSubscription = async (req, res) => {
  try {
    const planId = Number(req.body?.planId);
    if (!planId) {
      return res.status(400).json({ message: "planId is required" });
    }

    const data = await overrideSubscriptionService(req.params.businessId, planId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRevenueReport = async (req, res) => {
  try {
    const data = await getRevenueReportService(req.query.period);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBusinesses,
  getBusinessDetails,
  approveBusiness,
  rejectBusiness,
  updateBusinessStatus,
  toggleBusinessBlock,
  getSubscriptions,
  getSubscriptionPlans,
  grantFreeMonths,
  grantLifetimeAccess,
  overrideSubscription,
  getRevenueReport,
};
