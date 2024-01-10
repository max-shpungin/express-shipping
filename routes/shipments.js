"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const jsonschema = require ("jsonschema")
const shipitSchema = require('../schema.json')

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * Validates and ships an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/ship", async function (req, res, next) {
  const result = jsonschema.validate(
    req.body, shipitSchema, {required: true});
    console.log("req.body=", req.body)

  if (!result.valid){
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }
  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


module.exports = router;