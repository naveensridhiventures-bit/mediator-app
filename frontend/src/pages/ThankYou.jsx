import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ThankYou() {
  const navigate = useNavigate()
  const [count, setCount] = useState(5)

  useEffect(() => {
    const t = setInterval(() => setCount(c => c - 1), 1000)
    const r = setTimeout(() => navigate('/'), 5000)
    return () => { clearInterval(t); clearTimeout(r) }
  }, [])

  return (
    <div style={styles.page}>
      {/* Animated circles */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />
      <div style={styles.circle3} />

      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <div style={styles.iconRing}>
            <span style={styles.icon}>✅</span>
          </div>
        </div>

        <h1 style={styles.title}>You're All Set!</h1>
        <p style={styles.badge}>🎉 Requirement Received</p>

        <div style={styles.msgBox}>
          <p style={styles.msgMain}>
            Thank you for reaching out to <strong>MidiDater</strong>!
          </p>
          <p style={styles.msgSub}>
            Our expert property mediator will personally review your requirement and <strong>call you within 24 hours</strong> to discuss the best options available.
          </p>
        </div>

        <div style={styles.featureRow}>
          {[
            { icon: '📞', text: 'Personal call from our expert' },
            { icon: '🏡', text: 'Curated property matches' },
            { icon: '🤝', text: 'Zero brokerage surprise' },
          ].map(f => (
            <div key={f.text} style={styles.feature}>
              <span style={styles.featIcon}>{f.icon}</span>
              <span style={styles.featText}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={styles.whatsappNote}>
          <span>💬</span>
          <span>You can also reach us anytime on WhatsApp — our team is happy to help!</span>
        </div>

        <button style={styles.btn} onClick={() => navigate('/')}>
          Submit Another Requirement
        </button>

        <p style={styles.countdown}>Returning to home in {count}s…</p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)',
    padding: '20px', position: 'relative', overflow: 'hidden'
  },
  circle1: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    top: -100, right: -100, pointerEvents: 'none'
  },
  circle2: {
    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
    bottom: -50, left: -50, pointerEvents: 'none'
  },
  circle3: {
    position: 'absolute', width: 200, height: 200, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
    top: '40%', left: '10%', pointerEvents: 'none'
  },
  card: {
    background: 'rgba(26,34,53,0.95)', border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: 24, padding: '40px 28px', maxWidth: 480, width: '100%',
    textAlign: 'center', position: 'relative', zIndex: 1,
    boxShadow: '0 8px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)'
  },
  iconWrap: { display: 'flex', justifyContent: 'center', marginBottom: 20 },
  iconRing: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid rgba(99,102,241,0.4)'
  },
  icon: { fontSize: 36 },
  title: {
    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
    background: 'linear-gradient(135deg, #f1f5f9, #818cf8)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10
  },
  badge: {
    display: 'inline-block', background: 'rgba(16,185,129,0.15)',
    color: '#10b981', border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, marginBottom: 24
  },
  msgBox: {
    background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 14, padding: '18px 16px', marginBottom: 24
  },
  msgMain: { fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 },
  msgSub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
  featureRow: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
  feature: {
    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
    background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px'
  },
  featIcon: { fontSize: 20, flexShrink: 0 },
  featText: { fontSize: 13, color: 'var(--text2)', fontWeight: 500 },
  whatsappNote: {
    display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)',
    borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#4ade80', marginBottom: 24
  },
  btn: {
    width: '100%', padding: '14px', borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)', marginBottom: 16
  },
  countdown: { color: 'var(--text3)', fontSize: 12 }
}
