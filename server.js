const express = require("express");
const app = express();
const { resolve } = require("path");

// Load environment variables
require("dotenv").config();

const port = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${port}`;

// Stripe setup
const stripe = require("stripe")(process.env.SECRET_KEY);

// ----------------------
// Static file setup
// ----------------------
const STATIC_DIR = process.env.STATIC_DIR || "public";
const STATIC_PATH = resolve(__dirname, STATIC_DIR);

app.use(express.static(STATIC_PATH));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ----------------------
// Page routes
// ----------------------
app.get("/", (req, res) => {
  res.sendFile(resolve(STATIC_PATH, "index.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(resolve(STATIC_PATH, "success.html"));
});

app.get("/cancel", (req, res) => {
  res.sendFile(resolve(STATIC_PATH, "cancel.html"));
});

app.get("/workshop1", (req, res) => {
  res.sendFile(resolve(STATIC_PATH, "workshops", "workshop1.html"));
});

app.get("/workshop2", (req, res) => {
  res.sendFile(resolve(STATIC_PATH, "workshops", "workshop2.html"));
});

app.get("/workshop3", (req, res) => {
  res.sendFile(resolve(STATIC_PATH, "workshops", "workshop3.html"));
});

// ----------------------
// Stripe Checkout
// ----------------------
app.post("/create-checkout-session/:pid", async (req, res) => {
  try {
    const priceId = req.params.pid;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${DOMAIN}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel`,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Payment session creation failed" });
  }
});

// ----------------------
// Start server
// ---------------------

app.listen(port, '0.0.0.0', () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 Server actually listening on port ${port}`);
  console.log(`🔗 Access it at: http://15.207.112.152:${port}`);
  console.log(`-----------------------------------------`);
});
