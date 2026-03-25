import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import ThreeCanvas from '../components/ThreeCanvas'
import { uploadObject, getMyObjects, saveCameraState } from '../services/api'

const Viewer = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [objects, setObjects] = useState([])
  const [selectedObject, setSelectedObject] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchObjects()
  }, [])

  const fetchObjects = async () => {
    try {
      const { data } = await getMyObjects()
      setObjects(data)
      if (data.length > 0) setSelectedObject(data[0])
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.endsWith('.glb')) {
      setMessage('Sirf .glb files allowed hain!')
      return
    }
    setUploading(true)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('model', file)
      const { data } = await uploadObject(formData)
      setObjects([...objects, data])
      setSelectedObject(data)
      setMessage('Upload successful!')
    } catch (err) {
      setMessage('Upload failed — AWS configure karo')
    } finally {
      setUploading(false)
    }
  }

  const handleCameraSave = async (id, cameraState) => {
    try {
      await saveCameraState(id, cameraState)
      setMessage('Camera state saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>3D Viewer</h2>
        <div style={styles.navRight}>
          <span style={styles.username}>Hi, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h3 style={styles.sideTitle}>My Models</h3>

          {/* Upload Button */}
          <label style={styles.uploadLabel}>
            {uploading ? 'Uploading...' : '+ Upload .glb File'}
            <input
              type="file"
              accept=".glb"
              onChange={handleUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>

          {message && (
            <p style={{
              color: message.includes('failed') || message.includes('Sirf')
                ? '#ff4d4d' : '#4dff91',
              fontSize: '0.8rem',
              margin: '0.5rem 0'
            }}>
              {message}
            </p>
          )}

          {/* Objects List */}
          <div style={styles.objectList}>
            {objects.length === 0 ? (
              <p style={styles.noObjects}>
                No models yet. Upload a .glb file to get started!
              </p>
            ) : (
              objects.map((obj) => (
                <div
                  key={obj._id}
                  style={{
                    ...styles.objectItem,
                    background: selectedObject?._id === obj._id
                      ? '#6c63ff' : '#2a2a2a'
                  }}
                  onClick={() => setSelectedObject(obj)}
                >
                  <p style={styles.objectName}>{obj.originalName}</p>
                  <p style={styles.objectDate}>
                    {new Date(obj.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Save Camera Button */}
          {selectedObject && (
            <button
              style={styles.saveBtn}
              onClick={() => handleCameraSave(
                selectedObject._id,
                selectedObject.cameraState
              )}
            >
              Save Camera State
            </button>
          )}
        </div>

        {/* 3D Canvas */}
        <div style={styles.canvasArea}>
          {selectedObject ? (
            <ThreeCanvas
              modelUrl={selectedObject.s3Url}
              cameraState={selectedObject.cameraState}
              onCameraChange={(state) =>
                setSelectedObject({ ...selectedObject, cameraState: state })
              }
            />
          ) : (
            <div style={styles.emptyCanvas}>
              <p style={{ color: '#666', fontSize: '1.2rem' }}>
                Select a model or upload a .glb file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column',
    height: '100vh', background: '#0d0d1a',
    overflow: 'hidden'
  },
  navbar: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0.8rem 1.5rem',
    background: '#111128',
    borderBottom: '1px solid #2a2a4a'
  },
  logo: {
    color: '#6c63ff', margin: 0,
    fontSize: '1.3rem', fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: {
    color: '#8888aa', fontSize: '0.85rem',
    background: '#1a1a2e', padding: '0.4rem 0.8rem',
    borderRadius: '20px', border: '1px solid #2a2a4a'
  },
  logoutBtn: {
    padding: '0.4rem 1rem',
    background: 'transparent',
    color: '#ff6b6b',
    border: '1px solid rgba(255,107,107,0.4)',
    borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.85rem', transition: 'all 0.2s'
  },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: {
    width: '270px',
    background: '#111128',
    padding: '1.2rem',
    borderRight: '1px solid #2a2a4a',
    display: 'flex', flexDirection: 'column',
    gap: '0.75rem', overflowY: 'auto'
  },
  sideTitle: {
    color: '#ffffff', margin: 0,
    fontSize: '0.95rem', fontWeight: '600',
    letterSpacing: '0.3px'
  },
  uploadLabel: {
    display: 'block', padding: '0.75rem',
    background: 'linear-gradient(135deg, #6c63ff, #a89cff)',
    color: '#fff', borderRadius: '10px',
    textAlign: 'center', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: '600',
    letterSpacing: '0.2px'
  },
  objectList: {
    display: 'flex', flexDirection: 'column', gap: '0.5rem'
  },
  objectItem: {
    padding: '0.75rem 1rem', borderRadius: '10px',
    cursor: 'pointer', transition: 'all 0.2s',
    border: '1px solid #2a2a4a'
  },
  objectName: {
    color: '#fff', margin: 0,
    fontSize: '0.82rem', wordBreak: 'break-all',
    fontWeight: '500'
  },
  objectDate: {
    color: '#666688', margin: '0.2rem 0 0',
    fontSize: '0.72rem'
  },
  noObjects: {
    color: '#666688', fontSize: '0.85rem',
    textAlign: 'center', padding: '1rem',
    background: '#1a1a2e', borderRadius: '10px',
    border: '1px solid #2a2a4a', lineHeight: '1.5'
  },
  saveBtn: {
    padding: '0.75rem',
    background: 'transparent',
    color: '#4dff91',
    border: '1px solid rgba(77,255,145,0.3)',
    borderRadius: '10px', cursor: 'pointer',
    marginTop: 'auto', fontSize: '0.85rem',
    fontWeight: '600'
  },
  canvasArea: { flex: 1, position: 'relative' },
  emptyCanvas: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    height: '100%', gap: '1rem'
  }
}

export default Viewer