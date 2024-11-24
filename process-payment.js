const express = require("express");
const bodyParser = require("body-parser");
const { Client, Environment } = require("square");

const app = express();
app.use(bodyParser.json());

const squareClient = new Client({
  environment: Environment.Sandbox, // Change to `Environment.Production` for live
  accessToken: "EAAAlvOy-9ravhzCLQcJEGAFH4iEI9znsrIAPL83KeAxbpZ3fq803VO3YpVltiZ4",
});

app.post("/process-payment", async (req, res) => {
  const { token, amount, product } = req.body;

  try {
    const paymentsApi = squareClient.paymentsApi;
    const response = await paymentsApi.createPayment({
      sourceId: token,
      amountMoney: {
        amount: amount, // Amount in cents
        currency: "EUR",
      },
      idempotencyKey: `${Date.now()}-${product}`, // Unique key for each request
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
