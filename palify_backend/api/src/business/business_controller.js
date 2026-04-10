// const businessService = require("../business/business_service");

// const getBusinessDetails = async (req, res) => {
//   try {
//     const { business_id, user_id } = req.body;

//     if (!business_id) {
//       return res.status(400).json({
//         status: "error",
//         msg: "business_id required",
//       });
//     }

//     const data = await businessService({ business_id, user_id });

//     return res.status(200).json({
//       status: "success",
//       data,
//     });

//   } catch (error) {
//     return res.status(400).json({
//       status: "error",
//       msg: error.message,
//     });
//   }
// };
// // ✅ Get Profile
// businessController.getProfile = async (req, res) => {
//   try {
//     const data = await businessService.getProfile();

//     res.json({
//       success: true,
//       message: "Business profile fetched",
//       data,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };



// // ✅ Update Profile
// businessController.updateProfile = async (req, res) => {
//   try {
//     const data = await businessService.updateProfile(req.body);

//     res.json({
//       success: true,
//       message: "Profile updated",
//       data,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };



// // ✅ Add Gallery
// businessController.addGallery = async (req, res) => {
//   try {
//     const { business_id, image } = req.body;

//     const data = await businessService.addGallery(business_id, image);

//     res.json({ success: true, message: "Image added", data });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };



// // ✅ Delete Image
// businessController.deleteImage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const data = await businessService.deleteImage(id);

//     res.json({ success: true, message: "Image deleted", data });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };



// // ✅ Update Social
// businessController.updateSocial = async (req, res) => {
//   try {
//     const { business_id } = req.params;

//     const data = await businessService.updateSocial(
//       business_id,
//       req.body
//     );

//     res.json({
//       success: true,
//       message: "Social updated",
//       data,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };
// module.exports = { getBusinessDetails };
const businessService = require("../business/business_service");

const businessController = {}; // ✅ ADD THIS


// ✅ Get Business Details (Public Page)
businessController.getBusinessDetails = async (req, res) => {
  try {
    const { business_id, user_id } = req.body;

    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: "business_id required",
      });
    }

    const data = await businessService({ business_id, user_id });

    res.json({
      success: true,
      message: "Business details fetched",
      data,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Get Profile
businessController.getProfile = async (req, res) => {
  try {
    const data = await businessService.getProfile();

    res.json({
      success: true,
      message: "Business profile fetched",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ✅ Update Profile
businessController.updateProfile = async (req, res) => {
  try {
    const data = await businessService.updateProfile(req.body);

    res.json({
      success: true,
      message: "Profile updated",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ✅ Add Gallery
businessController.addGallery = async (req, res) => {
  try {
    const { business_id, image } = req.body;

    const data = await businessService.addGallery(business_id, image);

    res.json({ success: true, message: "Image added", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ✅ Delete Image
businessController.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await businessService.deleteImage(id);

    res.json({ success: true, message: "Image deleted", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ✅ Update Social
businessController.updateSocial = async (req, res) => {
  try {
    const { business_id } = req.params;

    const data = await businessService.updateSocial(
      business_id,
      req.body
    );

    res.json({
      success: true,
      message: "Social updated",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


module.exports = businessController; // ✅ EXPORT FULL OBJECT