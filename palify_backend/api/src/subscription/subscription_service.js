const db = require("../config/db");

const subscriptionService = {};


// ✅ Get Plans
subscriptionService.getPlans = async () => {
  const [data] = await db.query("SELECT * FROM subscriptions");
  return data;
};


// ✅ Subscribe
subscriptionService.subscribe = async (data) => {
  const { user_id, plan_id } = data;

  await db.query(
    "INSERT INTO user_subscriptions (user_id, plan_id) VALUES (?, ?)",
    [user_id, plan_id]
  );

  return { message: "Subscribed successfully" };
};

module.exports = subscriptionService;