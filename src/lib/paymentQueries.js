// lib/paymentQueries.js
import connectDB from './mongodb';
import Payment from '@/lib/Payment'; // Adjust path based on your project structure

export const paymentQueries = {
  // Get payments by email
  async getPaymentsByEmail(email, limit = 50, skip = 0) {
    try {
      await connectDB();
      
      const payments = await Payment.find({ customerEmail: email })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      
      return payments;
    } catch (error) {
      console.error('Error fetching payments by email:', error);
      throw error;
    }
  },

  // Get token history by meter ID
  async getTokenHistoryByMeterId(meterId, limit = 50, skip = 0) {
    try {
      await connectDB();
      
      const tokens = await Payment.find({ 
        meterId: meterId,
        status: 'completed' // Only include successful payments
      })
      .select('tokenAmount tokenCode purchaseDate meterId customerEmail amount status')
      .sort({ purchaseDate: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
      
      return tokens;
    } catch (error) {
      console.error('Error fetching token history by meter ID:', error);
      throw error;
    }
  },

  // Get payment history for a specific user
  async getPaymentHistoryByUserId(userId, limit = 10, skip = 0) {
    try {
      await connectDB();
      
      const payments = await Payment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      
      return payments;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Get payment by ID
  async getPaymentById(paymentId) {
    try {
      await connectDB();
      
      const payment = await Payment.findById(paymentId).lean();
      
      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  // Get payments by status
  async getPaymentsByStatus(status, limit = 10, skip = 0) {
    try {
      await connectDB();
      
      const payments = await Payment.find({ status })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      
      return payments;
    } catch (error) {
      console.error('Error fetching payments by status:', error);
      throw error;
    }
  },

  // Get payments within a date range
  async getPaymentsByDateRange(startDate, endDate, limit = 10, skip = 0) {
    try {
      await connectDB();
      
      const payments = await Payment.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
      
      return payments;
    } catch (error) {
      console.error('Error fetching payments by date range:', error);
      throw error;
    }
  },

  // Get total revenue/sum of payments
  async getTotalRevenue(userId = null, status = 'completed') {
    try {
      await connectDB();
      
      const matchStage = { status };
      if (userId) {
        matchStage.userId = userId;
      }
      
      const result = await Payment.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      return result[0]?.total || 0;
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      throw error;
    }
  },

  // Get payment statistics
  async getPaymentStats(userId = null) {
    try {
      await connectDB();
      
      const matchStage = userId ? { userId } : {};
      
      const stats = await Payment.aggregate([
        { $match: matchStage },
        { $group: { 
          _id: '$status', 
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }},
        { $sort: { _id: 1 } }
      ]);
      
      return stats;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  },

  // Create a new payment
  async createPayment(paymentData) {
    try {
      await connectDB();
      
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      
      return savedPayment.toObject();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(paymentId, status, transactionId = null) {
    try {
      await connectDB();
      
      const updateData = { status };
      if (transactionId) {
        updateData.transactionId = transactionId;
      }
      
      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        updateData,
        { new: true, runValidators: true }
      ).lean();
      
      return updatedPayment;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Delete a payment (admin only)
  async deletePayment(paymentId) {
    try {
      await connectDB();
      
      const deletedPayment = await Payment.findByIdAndDelete(paymentId).lean();
      
      return deletedPayment;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  },

  // Search payments with multiple criteria
  async searchPayments(criteria, limit = 10, skip = 0) {
    try {
      await connectDB();
      
      const query = {};
      
      if (criteria.userId) query.userId = criteria.userId;
      if (criteria.customerEmail) query.customerEmail = criteria.customerEmail;
      if (criteria.meterId) query.meterId = criteria.meterId;
      if (criteria.status) query.status = criteria.status;
      if (criteria.paymentMethod) query.paymentMethod = criteria.paymentMethod;
      if (criteria.minAmount) query.amount = { ...query.amount, $gte: criteria.minAmount };
      if (criteria.maxAmount) query.amount = { ...query.amount, $lte: criteria.maxAmount };
      if (criteria.transactionId) query.transactionId = criteria.transactionId;
      
      if (criteria.startDate || criteria.endDate) {
        query.createdAt = {};
        if (criteria.startDate) query.createdAt.$gte = new Date(criteria.startDate);
        if (criteria.endDate) query.createdAt.$lte = new Date(criteria.endDate);
      }
      
      const payments = await Payment.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      
      const total = await Payment.countDocuments(query);
      
      return { payments, total };
    } catch (error) {
      console.error('Error searching payments:', error);
      throw error;
    }
  },

  // Get recent payments (for dashboard)
  async getRecentPayments(limit = 5) {
    try {
      await connectDB();
      
      const payments = await Payment.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email') // Adjust based on your User model
        .lean();
      
      return payments;
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      throw error;
    }
  }
};

export default paymentQueries;