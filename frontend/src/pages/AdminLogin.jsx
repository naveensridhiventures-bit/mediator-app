import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth.jsx'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, isAuth } = useAdminAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuth) { navigate('/admin'); return null }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: 'Basic ' + btoa(`${form.username}:${form.password}`) }
      })
      if (res.ok) {
        login(form.username, form.password)
        navigate('/admin')
      } else {
        setError('Invalid username or password')
      }
    } catch {
      setError('Connection failed. Check your network.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bg1} />
      <div style={styles.bg2} />
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <span style={{ fontSize: 36 }}>🏡</span>
          <div>
            <h1 style={styles.brand}>MidiDater</h1>
            <p style={styles.brandSub}>Admin Portal</p>
          </div>
        </div>

        <div style={styles.secBadge}>🔐 Restricted Access</div>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Username</label>
          <input style={styles.input} type="text" autoComplete="username"
            placeholder="Enter username"
            value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" autoComplete="current-password"
            placeholder="Enter password"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />

          {error && <div style={styles.error}>{error}</div>}

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? '🔄 Signing in…' : '🚀 Sign In to Dashboard'}
          </button>
        </form>

        <a href="/" style={styles.backLink}>← Back to Property Form</a>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)',
    padding: 20, position: 'relative', overflow: 'hidden'
  },
  bg1: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
    top: -150, right: -100
  },
  bg2: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
    bottom: -100, left: -100
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 420,
    position: 'relative', zIndex: 1, boxShadow: '0 8px 60px rgba(0,0,0,0.5)'
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28
  },
  brand: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
    background: 'linear-gradient(135deg, #818cf8, #6366f1)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  brandSub: { color: 'var(--text3)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  secBadge: {
    display: 'inline-block', background: 'rgba(245,158,11,0.1)',
    color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700,
    marginBottom: 24, letterSpacing: 0.5
  },
  label: { display: 'block', color: 'var(--text2)', fontSize: 13, fontWeight: 600, marginBottom: 8, marginTop: 16 },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '13px 16px', color: 'var(--text)', fontSize: 15,
    outline: 'none', fontFamily: 'var(--font-body)', marginBottom: 4
  },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
    color: '#f87171', borderRadius: 10, padding: '10px 14px',
    fontSize: 13, marginTop: 12, fontWeight: 500
  },
  btn: {
    width: '100%', padding: '14px', marginTop: 24, borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
  },
  backLink: {
    display: 'block', textAlign: 'center', marginTop: 20,
    color: 'var(--text3)', fontSize: 13, textDecoration: 'none', fontWeight: 500
  }
}
