const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { v4: uuidv4 } = require('uuid');

const messageSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      index: true 
    },
    sessionId: {
      type: String,
      required: true,
      default: () => uuidv4(), 
      index: true
    },
    text: { 
      type: String, 
      required: true, 
      trim: true 
    },
    sender: { 
      type: String, 
      required: true, 
      enum: ['user', 'ai'] 
    },
    // Additional useful fields
    isNewSession: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Index for faster querying by session and user
messageSchema.index({ user: 1, sessionId: 1 });

// Virtual for conversation tracking
messageSchema.virtual('conversation').get(function() {
  return {
    sessionId: this.sessionId,
    startedAt: this.createdAt
  };
});

module.exports = model('Message', messageSchema);