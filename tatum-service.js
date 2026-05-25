import axios from 'axios';

const TATUM_API_KEY = process.env.TATUM_API_KEY || 'demo_key';
const TATUM_API = 'https://api.tatum.io/v3';

export class TatumPaymentService {
  constructor() {
    this.client = axios.create({
      baseURL: TATUM_API,
      headers: {
        'x-api-key': TATUM_API_KEY,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create payment for premium storage
   */
  async createPayment(walletAddress, storageGB, pricePerGB = 0.01) {
    try {
      const amount = (storageGB * pricePerGB).toFixed(2);
      
      const response = await this.client.post('/payment', {
        senderAccountId: walletAddress,
        amount: amount,
        currency: 'USD',
        description: `Walrus Vault Premium Storage - ${storageGB}GB`,
        recipientAccountId: process.env.TATUM_RECIPIENT_ACCOUNT || 'vault_account',
        compliant: false
      });

      return {
        success: true,
        paymentId: response.data.id,
        amount,
        storageGB,
        status: 'pending'
      };
    } catch (error) {
      console.error('Tatum payment error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await this.client.get(`/payment/${paymentId}`);
      return {
        paymentId,
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency
      };
    } catch (error) {
      console.error('Tatum status error:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Create subscription for recurring storage
   */
  async createSubscription(walletAddress, storageGB, billingCycle = 'monthly') {
    try {
      const monthlyPrice = (storageGB * 0.01 * 30).toFixed(2);
      
      const response = await this.client.post('/subscription', {
        accountId: walletAddress,
        amount: monthlyPrice,
        currency: 'USD',
        interval: billingCycle,
        description: `Walrus Vault - ${storageGB}GB ${billingCycle}`,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      return {
        success: true,
        subscriptionId: response.data.id,
        storageGB,
        monthlyPrice,
        status: 'active'
      };
    } catch (error) {
      console.error('Tatum subscription error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get account balance
   */
  async getBalance(accountId) {
    try {
      const response = await this.client.get(`/ledger/account/${accountId}/balance`);
      return {
        accountId,
        balance: response.data.availableBalance,
        currency: response.data.currency
      };
    } catch (error) {
      console.error('Tatum balance error:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Process refund
   */
  async processRefund(paymentId, amount) {
    try {
      const response = await this.client.post(`/payment/${paymentId}/refund`, {
        amount: amount
      });

      return {
        success: true,
        refundId: response.data.id,
        amount,
        status: 'processed'
      };
    } catch (error) {
      console.error('Tatum refund error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new TatumPaymentService();
