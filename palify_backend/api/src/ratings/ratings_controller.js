const ratingService = require("../ratings/ratings_service");

const submitRating = async (req, res) => {
  try {
    const rating = await ratingService.submitRating(req.user.id, req.body);
    res.status(201).json({ success: true, message: "Rating submitted", data: rating });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBusinessRatings = async (req, res) => {
  try {
    const ratings = await ratingService.getBusinessRatings(req.params.businessId);
    res.json({ success: true, data: ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { submitRating, getBusinessRatings };