// Vercel Serverless Function for Stripe Webhooks
// This automatically grants access when payments succeed

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Course ID to Firestore field mapping
const PRODUCT_MAP = {
  // Replace these with your actual Stripe Price IDs
  'price_COURSE101_ID': { type: 'course', field: 'courses.course101' },
  'price_COURSE102_ID': { type: 'course', field: 'courses.course102' },
  'price_COURSE103_ID': { type: 'course', field: 'courses.course103' },
  'price_PREMIUM_ID': { type: 'premium', field: 'isPremium' },
};

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'invoice.paid':
        // Handle subscription renewals
        await handleInvoicePaid(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        // Handle subscription cancellations
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  const customerEmail = session.customer_email || session.customer_details?.email;
  if (!customerEmail) {
    console.error('No customer email found in session');
    return;
  }

  // Get line items to determine what was purchased
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  
  for (const item of lineItems.data) {
    const priceId = item.price.id;
    const productInfo = PRODUCT_MAP[priceId];

    if (!productInfo) {
      console.log(`Unknown product purchased: ${priceId}`);
      continue;
    }

    // Find user by email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', customerEmail)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found with email: ${customerEmail}`);
      continue;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Grant access based on product type
    if (productInfo.type === 'course') {
      await db.collection('users').doc(userId).update({
        [productInfo.field]: true,
      });
      console.log(`Granted ${productInfo.field} to ${customerEmail}`);
    } else if (productInfo.type === 'premium') {
      await db.collection('users').doc(userId).update({
        isPremium: true,
        hasCommunityAccess: true,
        questionsThisMonth: 0,
      });
      console.log(`Granted premium access to ${customerEmail}`);
    }
  }
}

async function handleInvoicePaid(invoice) {
  // Handle recurring subscription payments
  const customerEmail = invoice.customer_email;
  if (!customerEmail) return;

  const priceId = invoice.lines.data[0]?.price?.id;
  if (priceId === PRODUCT_MAP.price_PREMIUM_ID) {
    const usersSnapshot = await db.collection('users')
      .where('email', '==', customerEmail)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      await usersSnapshot.docs[0].ref.update({
        isPremium: true,
        hasCommunityAccess: true,
      });
      console.log(`Renewed premium for ${customerEmail}`);
    }
  }
}

async function handleSubscriptionDeleted(subscription) {
  // Handle subscription cancellation
  const customer = await stripe.customers.retrieve(subscription.customer);
  const customerEmail = customer.email;

  if (!customerEmail) return;

  const usersSnapshot = await db.collection('users')
    .where('email', '==', customerEmail)
    .limit(1)
    .get();

  if (!usersSnapshot.empty) {
    await usersSnapshot.docs[0].ref.update({
      isPremium: false,
    });
    console.log(`Cancelled premium for ${customerEmail}`);
  }
}
