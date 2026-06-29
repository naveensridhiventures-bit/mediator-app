import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ThankYou() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isSell = params.get('type') === 'sell'

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        <div style={s.iconWrap}>
          <span style={s.icon}>{isSell ? '🏷️' : '🎉'}</span>
        </div>
        <h1 style={s.title}>{isSell ? 'Listing Submitted!' : 'Request Received!'}</h1>
        <p style={s.sub}>
          {isSell
            ? 'Our team will review your listing and enhance your photos. We\'ll contact you within 24 hours to confirm it\'s live.'
            : 'Our mediators are reviewing your requirement. Expect a personal call from our team within 24 hours with matching properties.'}
        </p>
        <div style={s.steps}>
          {(isSell ? SELL_STEPS : BUY_STEPS).map((st, i) => (
            <div key={i} style={s.step}>
              <div style={s.stepNum}>{i + 1}</div>
              <div>
                <div style={s.stepTitle}>{st.title}</div>
                <div style={s.stepSub}>{st.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button style={s.homeBtn} onClick={() => navigate('/')}>← Back to Home</button>
        <button style={s.browseBtn} onClick={() => navigate('/listings')}>Browse Properties</button>
      </div>
      <footer style={s.footer}>© 2024 MidiDater · Chennai</footer>
    </div>
  )
}

const SELL_STEPS = [
  { title: 'Review', sub: 'Our team reviews your listing details and photos' },
  { title: 'Enhance', sub: 'We professionally edit your property photos' },
  { title: 'Publish', sub: 'Your listing goes live on MidiDater marketplace' },
  { title: 'Connect', sub: 'We screen inquiries and connect you with serious buyers only' },
]

const BUY_STEPS = [
  { title: 'Review', sub: 'Our mediators review your requirements' },
  { title: 'Match', sub: 'We search our database for the best matching properties' },
  { title: 'Connect', sub: 'We personally call you with curated options' },
  { title: 'Visit', sub: 'We arrange site visits and handle negotiations' },
]

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '36px 28px', maxWidth: 480, width: '100%', textAlign: 'center', position: 'relative', zIndex: 2, boxShadow: 'var(--shadow-lg)' },
  iconWrap: { width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  icon: { fontSize: 36 },
  title: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 12 },
  sub: { color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 },
  steps: { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28, textAlign: 'left' },
  step: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  stepNum: { width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepTitle: { color: 'var(--text)', fontWeight: 700, fontSize: 14 },
  stepSub: { color: 'var(--text2)', fontSize: 13 },
  homeBtn: { width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10 },
  browseBtn: { width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  footer: { color: 'var(--text3)', fontSize: 12, marginTop: 32, position: 'relative', zIndex: 2 },
}
