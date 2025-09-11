// src/models/Payment.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerTable",
      required: false,
      index: true,
      default: null,
    },
    customer_email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    
    // Customer information for better tracking
    customer_name: {
      type: String,
      trim: true,
      default: null,
    },
    customer_phone: {
      type: String,
      trim: true,
      default: null,
    },
    
    // Meter information (required for token purchases)
    meter_id: {
      type: String,
      required: function() {
        return this.metadata?.purchase_type === 'electricity_token';
      },
      index: true,
      trim: true,
      default: null,
    },
    meter_number: {
      type: String,
      trim: true,
      default: null,
    },
    
    // Payment details
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be >= 0"],
    },
    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN", "USD", "EUR"],
    },
    channel: {
      type: String,
      default: "paystack",
      enum: ["paystack", "flutterwave", "stripe", "bank_transfer", "cash"],
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true,
    },
    
    // Token information (for electricity token purchases)
    token_amount: {
      type: Number,
      min: [0, "Token amount must be >= 0"],
      default: null,
    },
    token_code: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      // REMOVED: index: true - causes duplicate index warning
    },
    token_expiry: {
      type: Date,
      default: null,
    },
    
    // Electricity details
    units_purchased: {
      type: Number,
      min: [0, "Units must be >= 0"],
      default: null,
    },
    tariff_rate: {
      type: Number,
      min: [0, "Tariff rate must be >= 0"],
      default: null,
    },
    
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Payment processing dates
    initiated_at: {
      type: Date,
      default: Date.now,
    },
    paid_at: {
      type: Date,
      default: null,
    },
    verified_at: {
      type: Date,
      default: null,
    },
    
    // Additional fields for better tracking
    transaction_id: {
      type: String,
      unique: true,
      sparse: true, // FIX: Changed to sparse to allow null values
      default: null,
    },
    payment_method: {
      type: String,
      enum: ["card", "bank_transfer", "ussd", "mobile_money", "cash"],
      default: "card",
    },
    
    // Payment gateway response data
    gateway_response: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Refund information
    refund_amount: {
      type: Number,
      min: [0, "Refund amount must be >= 0"],
      default: null,
    },
    refund_reason: {
      type: String,
      trim: true,
      default: null,
    },
    refunded_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Virtual for purchase date (alias for created_at)
PaymentSchema.virtual('purchase_date').get(function() {
  return this.created_at;
});

// Virtual for formatted amount
PaymentSchema.virtual('formatted_amount').get(function() {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// Virtual for payment status display
PaymentSchema.virtual('status_display').get(function() {
  const statusMap = {
    pending: 'Pending',
    success: 'Successful',
    failed: 'Failed',
    refunded: 'Refunded',
    cancelled: 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Indexes for better query performance - REMOVED DUPLICATES
PaymentSchema.index({ customer_email: 1, created_at: -1 });
PaymentSchema.index({ status: 1, created_at: -1 });
PaymentSchema.index({ user_id: 1, status: 1 });
PaymentSchema.index({ reference: 1, customer_email: 1 });

// Pre-save middleware to handle transaction_id uniqueness
PaymentSchema.pre("save", function (next) {
  // Ensure transaction_id is not null if it's supposed to be unique
  if (this.isNew && (!this.transaction_id || this.transaction_id === 'null')) {
    this.transaction_id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  this.updated_at = new Date();
  
  // Auto-set token_amount if not provided for electricity token purchases
  if (this.metadata?.purchase_type === 'electricity_token' && 
      !this.token_amount && 
      this.amount) {
    this.token_amount = this.amount;
  }
  
  // Set paid_at timestamp when status changes to success
  if (this.isModified('status') && this.status === 'success' && !this.paid_at) {
    this.paid_at = new Date();
  }
  
  // Set verified_at timestamp when payment is verified
  if (this.isModified('status') && this.status === 'success' && !this.verified_at) {
    this.verified_at = new Date();
  }
  
  next();
});

// Method to check if payment is for electricity token
PaymentSchema.methods.isTokenPurchase = function() {
  return this.metadata?.purchase_type === 'electricity_token';
};

// Method to check if payment is successful
PaymentSchema.methods.isSuccessful = function() {
  return this.status === 'success';
};

// Method to check if payment can be refunded
PaymentSchema.methods.canRefund = function() {
  return this.status === 'success' && !this.refund_amount;
};

// Static method to find payments by email
PaymentSchema.statics.findByEmail = function(email, limit = 50) {
  return this.find({ customer_email: email.toLowerCase().trim() })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();
};

// Static method to find token history by meter ID
PaymentSchema.statics.findTokenHistoryByMeterId = function(meterId, limit = 50) {
  return this.find({ 
    meter_id: meterId,
    status: 'success',
    'metadata.purchase_type': 'electricity_token'
  })
  .select('token_amount token_code created_at meter_id customer_email amount status units_purchased tariff_rate')
  .sort({ created_at: -1 })
  .limit(limit)
  .lean();
};

// Static method to find payment by reference
PaymentSchema.statics.findByReference = function(reference) {
  return this.findOne({ reference })
    .populate('user_id', 'name email phone')
    .lean();
};

// Static method to get payment statistics
PaymentSchema.statics.getPaymentStats = function(email = null) {
  const matchStage = email ? { customer_email: email.toLowerCase().trim() } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
};

// Static method to update payment status
PaymentSchema.statics.updatePaymentStatus = function(reference, status, additionalData = {}) {
  const updateData = { 
    status,
    updated_at: new Date(),
    ...additionalData 
  };
  
  if (status === 'success') {
    updateData.paid_at = new Date();
    updateData.verified_at = new Date();
  }
  
  return this.findOneAndUpdate(
    { reference },
    updateData,
    { new: true }
  );
};

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;