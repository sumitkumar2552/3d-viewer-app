const mongoose = require('mongoose');

const object3DSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  s3Url: {
    type: String,
    required: true
  },
  cameraState: {
    positionX: { type: Number, default: 0 },
    positionY: { type: Number, default: 0 },
    positionZ: { type: Number, default: 5 },
    targetX:   { type: Number, default: 0 },
    targetY:   { type: Number, default: 0 },
    targetZ:   { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Object3D', object3DSchema);