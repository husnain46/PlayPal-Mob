const express = require('express');
const cors = require('cors');
const app = express();

const stripe = require('stripe')(
    'sk_test_51OLMpjA4Z4f7DIp7VZ9ax1jKXmzgdrMPuDmj4FskNCWFuR5DsLULPHdUVheFTxkJQ1XmUZfqJQG7WpU1rU0GtbJs002GAiWbKc',
);

const PORT = 3000;

app.use(express.json());
app.use(cors()); // Add this line to enable CORS

// POST route for creating payment intent
app.post('/payment-intent', async (req, res) => {
    try {
        const {amount} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'pkr',
            payment_method_types: ['card'],
        });

        res.json({clientSecret: paymentIntent.client_secret});
        return paymentIntent;
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
