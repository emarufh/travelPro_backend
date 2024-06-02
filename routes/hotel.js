const router = require("express").Router();
const hotelController = require("../controllers/hotelController");
const { verifyToken } = require("../middleware/jwt_token");

router.post("/", verifyToken, hotelController.addHotel);
router.get("/:id", hotelController.getHotelById);
router.get("/byCountry/:id", hotelController.getHotelsByCountry);

module.exports = router;
