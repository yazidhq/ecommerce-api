const {
  createData,
  getsData,
  truncateData,
  getData,
  updateData,
  deleteData,
} = require("../controllers/product.controller");

const router = require("./auth.route");

router.route("/").post(createData).get(getsData).delete(truncateData);
router.route("/:id").get(getData).patch(updateData).delete(deleteData);

module.exports = router;
