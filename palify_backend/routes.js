const router = require("express").Router();

// ✅ correct path
const signupRoute = require("./api/src/signup/signup_route")

router.use("/signup", signupRoute);

const loginRoute = require("./api/src/login/login_routes")
router.use ("/login", loginRoute)

const forgotPasswordRoute = require("./api/src/forgot_password/forgot_password_route");
router.use("/password", forgotPasswordRoute);

const homeRoute =require ("./api/src/home/home_routes")
router.use ("/home", homeRoute)

const businessRoute = require ("./api/src/business/business_route")
router.use ("/business", businessRoute)

const bookingRoutes = require("./api/src/booking/booking_routes");
router.use("/booking", bookingRoutes);

const chatRoutes = require("./api/src/chats/chats_routes")
router.use("/chats", chatRoutes)

const profileRoute = require("./api/src/profile/profile_route")
router.use("/profile", profileRoute)

const notificationRoute = require("./api/src/notification/notification_route")
router.use("/notification", notificationRoute)

const staffRoute = require("./api/src/staff/staff_route")
router.use("/staff", staffRoute)

const businessProfileRoute = require("./api/src/businessProfile/business_routes")
router.use("/businessProfile", businessProfileRoute)

const analyticsRoute = require("./api/src/analytics/analytics_routes")
router.use("/analytics", analyticsRoute)

const scheduleRoute = require("./api/src/schedule & availability/schedule_route")
router.use("/schedule", scheduleRoute)

const subscriptionRoute = require("./api/src/subscription/subscription_route")
router.use("/subscription", subscriptionRoute)

// ✅ Admin Panel Routes
const adminRoute = require("./api/src/admin/admin_routes")
router.use("/admin", adminRoute)

const adminPanelExtraRoute = require("./api/src/admin_panel_extra/admin_panel_extra_routes")
router.use("/admin_panel_extra", adminPanelExtraRoute)

module.exports = router;
