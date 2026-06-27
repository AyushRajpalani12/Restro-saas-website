const Restaurant = require("../models/Restaurant");

const checkFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      // Super admins bypass all feature checks
      if (req.user && req.user.role === "SUPER_ADMIN") {
        return next();
      }

      const { restaurantId } = req.user;
      if (!restaurantId) {
        return res.status(400).json({ error: "Missing restaurant bound" });
      }

      // Fetch restaurant with populated subscription plan
      const restaurant = await Restaurant.findById(restaurantId).populate("subscriptionPlan");
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      if (!restaurant.isActive || restaurant.isSuspended) {
        return res.status(403).json({ error: "Access denied. Restaurant account is inactive or suspended." });
      }

      const plan = restaurant.subscriptionPlan;
      if (!plan) {
        return res.status(403).json({ error: "No active subscription plan found." });
      }

      // Verify feature exists in subscription plan
      const hasFeature = plan.features && plan.features.includes(featureName);
      if (!hasFeature) {
        return res.status(403).json({
          error: `Feature lock: '${featureName}' is not included in your active plan (${plan.name}).`
        });
      }

      next();
    } catch (error) {
      console.error("Subscription check error:", error);
      return res.status(500).json({ error: "Subscription check error" });
    }
  };
};

module.exports = checkFeature;
