const Object3D = require('../models/Object3D')
const path = require('path')

const uploadObject = async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ message: 'No file uploaded' })

    const localUrl = `http://localhost:5000/uploads/${file.filename}`

    const object = await Object3D.create({
      user: req.user._id,
      filename: file.filename,
      originalName: file.originalname,
      s3Url: localUrl
    })

    res.status(201).json(object)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: error.message })
  }
}

const getMyObjects = async (req, res) => {
  try {
    const objects = await Object3D.find({ user: req.user._id })
    res.json(objects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const saveCameraState = async (req, res) => {
  try {
    const object = await Object3D.findById(req.params.id)
    if (!object) return res.status(404).json({ message: 'Object not found' })
    if (object.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    object.cameraState = req.body
    await object.save()
    res.json(object)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { uploadObject, getMyObjects, saveCameraState }