import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = Stripe(STRIPE_SECRET_KEY); 

router.post("/create-checkout-session", async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Rent Payment",
              description: `Rent for user ${userId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;