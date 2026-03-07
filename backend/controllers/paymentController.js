const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
    });

    if (alreadyEnrolled) {
        res.status(400);
        throw new Error('Already enrolled in this course');
    }

    if (!course.isPremium) {
        res.status(400);
        throw new Error('This course is not premium. You can enroll directly.');
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                            images: [course.coverImage],
                        },
                        unit_amount: course.price * 100, // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Need absolute URL for redirect, we can pass it from the frontend or use environment variables
            success_url: `http://localhost:5173/course/${course._id}?payment_success=true`,
            cancel_url: `http://localhost:5173/dashboard?payment_canceled=true`,
            client_reference_id: req.user._id.toString(), // To identify user in webhook
            metadata: {
                courseId: course._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500);
        throw new Error('Failed to create payment session');
    }
});

// @desc    Stripe Webhook to fulfill enrollment
// @route   POST /api/payments/webhook
// @access  Public
const stripeWebhook = asyncHandler(async (req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Express raw body is needed to verify webhook signatures
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.metadata.userId;
        const courseId = session.metadata.courseId;

        console.log(`Fulfilling premium course enrollment for User: ${userId}, Course: ${courseId}`);

        try {
            // Check if already enrolled to prevent duplicates
            const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });

            if (!existingEnrollment) {
                // Fulfill the enrollment automatically
                await Enrollment.create({
                    user: userId,
                    course: courseId,
                });
                console.log(`Enrollment successful for premium course via webhook`);
            }
        } catch (error) {
            console.error('Error fulfilling enrollment in webhook:', error);
            // Don't fail the webhook processing immediately, but log the error
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});

module.exports = {
    createCheckoutSession,
    stripeWebhook,
};
