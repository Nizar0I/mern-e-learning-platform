// paymentController.js
/*
const Payment = require("../models/Payment"); // or your Payment schema

exports.checkout = async (req, res) => {
  try {
    const { userId, cart, currency } = req.body;
    console.log("Checkout called with:", userId, cart);

    // For each course in cart, create Payment doc
    for (const course of cart) {
      await Payment.create({
        userId,
        courseId: course._id,
        amount: course.price,
        currency,
        status: "paid",
      });
    }

    res.status(200).json({ message: "Paiement réussi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

import Payment from "../models/Payment.js";

export async function checkout(req, res) {
  try {
    const { userId, cart, currency } = req.body;
    console.log("Checkout called with:", userId, cart);

    // For each course in cart, create Payment doc
    for (const course of cart) {
      await Payment.create({
        userId,
        courseId: course._id,
        amount: course.price,
        currency,
        status: "paid",
      });
    }

    res.status(200).json({ message: "Paiement réussi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPurchaseStatus(req, res) {
  try {
    const { userId, courseId } = req.query;
    console.log("Checking purchase status for user:", userId, "course:", courseId);

    // Verify that userId and courseId are provided
    if (!userId || !courseId) {
      return res.status(400).json({ error: "Missing userId or courseId parameter." });
    }

    const purchase = await Payment.findOne({ userId, courseId });
    console.log("Purchase lookup result:", purchase);

    res.json({ purchased: !!purchase });
  } catch (error) {
    console.error("Error in getPurchaseStatus:", error);
    res.status(500).json({ error: error.message });
  }
}