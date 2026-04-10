const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/auth");
const controller = require("./admin_panel_extra_controller");

// Apply auth middleware to all routes
router.use(verifyAdmin);

router.get("/businesses",                                 controller.getBusinesses);
router.get("/businesses/:id",                            controller.getBusinessDetails);
router.patch("/businesses/:id/approve",                  controller.approveBusiness);
router.patch("/businesses/:id/reject",                   controller.rejectBusiness);
router.patch("/businesses/:id/status",                   controller.updateBusinessStatus);
router.patch("/businesses/:id/block",                    controller.toggleBusinessBlock);

router.get("/subscriptions",                             controller.getSubscriptions);
router.get("/subscriptions/plans",                       controller.getSubscriptionPlans);
router.post("/subscriptions/:businessId/free-months",    controller.grantFreeMonths);
router.post("/subscriptions/:businessId/lifetime",       controller.grantLifetimeAccess);
router.post("/subscriptions/:businessId/override",       controller.overrideSubscription);

router.get("/revenue/report",                            controller.getRevenueReport);

module.exports = router;
