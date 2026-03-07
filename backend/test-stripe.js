const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Test Course',
                            images: ['https://example.com/image.jpg'],
                        },
                        unit_amount: 1500, // $15.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/course/123?payment_success=true`,
            cancel_url: `http://localhost:5173/dashboard?payment_canceled=true`,
            client_reference_id: "test_user_id",
            metadata: {
                courseId: "test_course_id",
                userId: "test_user_id",
            },
        });
        console.log("SUCCESS! Session URL:", session.url);
    } catch (error) {
        console.error("STRIPE ERROR:", error);
    }
}

testStripe();
