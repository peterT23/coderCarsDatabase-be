const express = require("express");
const validateSchema = require("../middleWare/validateSchema.js");
const {
  carQuerySchema,
  carIdParamsSchema,
  updateCarSchema,
} = require("../Schemas/schemas.js");
const {
  createCar,
  getCars,
  editCar,
  deleteCar,
} = require("../controllers/car.controller");
const router = express.Router();

// CREATE
router.post("/", createCar);

// READ
router.get("/", validateSchema(carQuerySchema, "query"), getCars);

// UPDATE
router.put(
  "/:id",
  validateSchema(carIdParamsSchema, "params"),
  validateSchema(updateCarSchema, "body"),
  editCar
);

// // DELETE
router.delete("/:id", validateSchema(carIdParamsSchema, "params"), deleteCar);

module.exports = router;
