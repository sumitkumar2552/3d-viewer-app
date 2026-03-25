import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await loginUser({ email, password })
      login(data)
      navigate('/viewer')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>⬡</div>
          <h1 style={styles.brand}>3D Viewer</h1>
          <p style={styles.tagline}>
            Upload, explore & manipulate 3D models in your browser.
            Powered by Three.js & React.
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>✦ Real-time 3D rendering</div>
            <div style={styles.feature}>✦ Rotate, zoom & pan</div>
            <div style={styles.feature}>✦ Save camera states</div>
            <div style={styles.feature}>✦ Secure authentication</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: '#0d0d1a'
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a1a3e 0%, #0d0d1a 50%, #1a0d2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    position: 'relative',
    borderRight: '1px solid #2a2a4a'
  },
  leftContent: {
    maxWidth: '420px'
  },
  logo: {
    fontSize: '3rem',
    color: '#6c63ff',
    marginBottom: '1rem',
    display: 'block'
  },
  brand: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1rem',
    letterSpacing: '-1px'
  },
  tagline: {
    color: '#8888aa',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '2rem'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  feature: {
    color: '#a89cff',
    fontSize: '0.95rem',
    padding: '0.6rem 1rem',
    background: 'rgba(108, 99, 255, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(108, 99, 255, 0.2)'
  },
  right: {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#0d0d1a'
  },
  card: {
    width: '100%',
    maxWidth: '380px'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.4rem'
  },
  subtitle: {
    color: '#666688',
    marginBottom: '2rem',
    fontSize: '0.95rem'
  },
  errorBox: {
    background: 'rgba(255, 77, 77, 0.1)',
    border: '1px solid rgba(255, 77, 77, 0.3)',
    color: '#ff6b6b',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  inputGroup: {
    marginBottom: '1.2rem'
  },
  label: {
    display: 'block',
    color: '#8888aa',
    fontSize: '0.85rem',
    marginBottom: '0.4rem',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.85rem 1rem',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s'
  },
  button: {
    width: '100%',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #6c63ff, #a89cff)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.3px'
  },
  switchText: {
    color: '#666688',
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem'
  }
}

export default Login