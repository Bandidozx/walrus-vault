import tatumService from './tatum-service.js';

// Payment endpoints for Tatum integration

/**
 * Create payment for premium storage
 * POST /api/payment/create
 * Body: { walletAddress, storageGB }
 */
export async function createPayment(req, res) {
  try {
    const { walletAddress, storageGB } = req.body;
    
    if (!walletAddress || !storageGB) {
      return res.status(400).json({ error: 'Missing walletAddress or storageGB' });
    }

    const result = await tatumService.createPayment(walletAddress, storageGB);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get payment status
 * GET /api/payment/:paymentId
 */
export async function getPaymentStatus(req, res) {
  try {
    const { paymentId } = req.params;
    const result = await tatumService.getPaymentStatus(paymentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Create subscription
 * POST /api/subscription/create
 * Body: { walletAddress, storageGB, billingCycle }
 */
export async function createSubscription(req, res) {
  try {
    const { walletAddress, storageGB, billingCycle } = req.body;
    
    if (!walletAddress || !storageGB) {
      return res.status(400).json({ error: 'Missing walletAddress or storageGB' });
    }

    const result = await tatumService.createSubscription(
      walletAddress, 
      storageGB, 
      billingCycle || 'monthly'
    );
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get pricing tiers
 * GET /api/pricing
 */
export function getPricing(req, res) {
  res.json({
    tiers: [
      {
        name: 'Free',
        storageGB: 1,
        pricePerMonth: 0,
        features: ['1GB storage', 'Basic support', 'NFT access control']
      },
      {
        name: 'Basic',
        storageGB: 10,
        pricePerMonth: 2.99,
        features: ['10GB storage', 'Email support', 'NFT access control', 'File sharing']
      },
      {
        name: 'Pro',
        storageGB: 100,
        pricePerMonth: 9.99,
        features: ['100GB storage', 'Priority support', 'NFT access control', 'File sharing', 'Encryption']
      },
      {
        name: 'Enterprise',
        storageGB: 1000,
        pricePerMonth: 49.99,
        features: ['1TB storage', '24/7 support', 'NFT access control', 'File sharing', 'Encryption', 'Custom domain']
      }
    ],
    currency: 'USD',
    billingCycles: ['monthly', 'yearly']
  });
}
