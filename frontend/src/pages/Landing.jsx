import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      {/* Ambient glow */}
      <div style={s.glow1} />
      <div style={s.glow2} />

      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>
          <span style={s.logoIcon}>🏡</span>
          <span style={s.logoText}>MidiDater</span>
        </div>
        <button style={s.viewListings} onClick={() => navigate('/listings')}>
          Browse Listings →
        </button>
      </header>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.badge}>✦ Chennai's Trusted Property Mediators</div>
        <h1 style={s.heroTitle}>
          Find. Sell. Mediate.<br />
          <span style={s.grad}>Your Property Journey Starts Here.</span>
        </h1>
        <p style={s.heroSub}>
          Connect with verified buyers and sellers across Chennai — 
          fast, private, and hassle-free.
        </p>
      </div>

      {/* Main CTA cards */}
      <div style={s.ctaRow}>
        {/* BUY */}
        <button style={{ ...s.ctaCard, ...s.ctaBuy }} onClick={() => navigate('/buy')}>
          <div style={s.ctaIconWrap}>
            <span style={s.ctaIcon}>🔍</span>
          </div>
          <div style={s.ctaLabel}>I Want to Buy</div>
          <div style={s.ctaSub}>Tell us what you need and we'll find the right property for you</div>
          <div style={{ ...s.ctaArrow, color: '#818cf8' }}>Get Started →</div>
        </button>

        {/* SELL */}
        <button style={{ ...s.ctaCard, ...s.ctaSell }} onClick={() => navigate('/sell')}>
          <div style={s.ctaIconWrap}>
            <span style={s.ctaIcon}>🏷️</span>
          </div>
          <div style={s.ctaLabel}>I Want to Sell</div>
          <div style={s.ctaSub}>List your property and reach thousands of verified buyers</div>
          <div style={{ ...s.ctaArrow, color: '#10b981' }}>List Now →</div>
        </button>
      </div>

      {/* Stats bar */}
      <div style={s.statsRow}>
        {[
          { num: '500+', label: 'Properties Listed' },
          { num: '1,200+', label: 'Happy Clients' },
          { num: '98%', label: 'Success Rate' },
          { num: '10+ yrs', label: 'In Chennai' },
        ].map(st => (
          <div key={st.label} style={s.stat}>
            <div style={s.statNum}>{st.num}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Recent listings preview */}
      <div style={s.previewSection}>
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>Recently Listed Properties</h2>
          <button style={s.viewAll} onClick={() => navigate('/listings')}>View All</button>
        </div>
        <div style={s.previewCards}>
          {PREVIEW_PROPS.map(p => (
            <div key={p.id} style={s.previewCard}>
              <div style={{ ...s.previewImg, backgroundImage: `url(${p.img})` }}>
                <span style={s.previewBadge}>{p.type}</span>
              </div>
              <div style={s.previewBody}>
                <div style={s.previewPrice}>{p.price}</div>
                <div style={s.previewArea}>📍 {p.area}, Chennai</div>
                <div style={s.previewDetails}>{p.bhk} · {p.sqft}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div style={s.whySection}>
        <h2 style={s.sectionTitle}>Why Choose MidiDater?</h2>
        <div style={s.whyGrid}>
          {WHY.map(w => (
            <div key={w.title} style={s.whyCard}>
              <span style={s.whyIcon}>{w.icon}</span>
              <div style={s.whyTitle}>{w.title}</div>
              <div style={s.whySub}>{w.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={s.footer}>
        <span>© 2024 MidiDater</span>
        <span>·</span>
        <span>Chennai, Tamil Nadu</span>
        <span>·</span>
        <span>Property Mediation Experts</span>
      </footer>
    </div>
  )
}

const PREVIEW_PROPS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', type: 'Apartment', price: '₹65 Lakh', area: 'Anna Nagar', bhk: '3 BHK', sqft: '1,450 sq ft' },
  { id: 2, img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400', type: 'House', price: '₹1.2 Cr', area: 'Adyar', bhk: '4 BHK', sqft: '2,200 sq ft' },
  { id: 3, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', type: 'Plot', price: '₹45 Lakh', area: 'OMR', bhk: 'Open Plot', sqft: '1,800 sq ft' },
]

const WHY = [
  { icon: '🔒', title: 'Your Privacy First', sub: 'Your exact address and contact are never shown publicly. Only our verified team can access them.' },
  { icon: '⚡', title: 'Fast Matchmaking', sub: 'Our mediators personally match buyers with sellers within 24 hours of listing.' },
  { icon: '📸', title: 'Professional Presentation', sub: 'We enhance your property photos and create stunning listings that attract serious buyers.' },
  { icon: '🤝', title: 'End-to-End Support', sub: 'From listing to deal closure — we handle negotiations, paperwork, and everything in between.' },
]

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'fixed', top: -200, left: -200, width: 600, height: 600,
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  glow2: {
    position: 'fixed', bottom: -100, right: -100, width: 500, height: 500,
    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', position: 'relative', zIndex: 2,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { fontSize: 26 },
  logoText: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
    background: 'linear-gradient(135deg, #818cf8, #6366f1)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  viewListings: {
    padding: '8px 18px', borderRadius: 20, border: '1px solid var(--border)',
    background: 'var(--surface)', color: 'var(--text2)', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
  },
  hero: {
    textAlign: 'center', padding: '40px 24px 32px',
    position: 'relative', zIndex: 2,
  },
  badge: {
    display: 'inline-block', padding: '6px 16px', borderRadius: 20,
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
    color: 'var(--accent2)', fontSize: 12, fontWeight: 700,
    letterSpacing: 0.5, marginBottom: 20,
  },
  heroTitle: {
    fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,6vw,48px)',
    fontWeight: 800, lineHeight: 1.15, color: 'var(--text)', marginBottom: 16,
  },
  grad: {
    background: 'linear-gradient(135deg, #818cf8, #34d399)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    color: 'var(--text2)', fontSize: 'clamp(14px,2vw,17px)',
    maxWidth: 520, margin: '0 auto',
  },
  ctaRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16, padding: '0 24px', maxWidth: 760, margin: '0 auto',
    position: 'relative', zIndex: 2,
  },
  ctaCard: {
    background: 'var(--surface)', border: '2px solid var(--border)',
    borderRadius: 20, padding: '28px 24px', cursor: 'pointer', textAlign: 'left',
    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
  },
  ctaBuy: { borderColor: 'rgba(99,102,241,0.3)' },
  ctaSell: { borderColor: 'rgba(16,185,129,0.3)' },
  ctaIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    background: 'var(--surface2)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  ctaIcon: { fontSize: 26 },
  ctaLabel: {
    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
    color: 'var(--text)', marginBottom: 8,
  },
  ctaSub: { color: 'var(--text2)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 },
  ctaArrow: { fontSize: 14, fontWeight: 700 },
  statsRow: {
    display: 'flex', flexWrap: 'wrap', gap: 0, justifyContent: 'center',
    maxWidth: 760, margin: '32px auto 0', padding: '0 24px',
    position: 'relative', zIndex: 2,
  },
  stat: {
    flex: '1 1 120px', textAlign: 'center', padding: '20px 16px',
    borderRight: '1px solid var(--border)',
  },
  statNum: {
    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
    background: 'linear-gradient(135deg, #818cf8, #34d399)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  statLabel: { color: 'var(--text3)', fontSize: 12, fontWeight: 600, marginTop: 4 },
  previewSection: {
    padding: '48px 24px 0', maxWidth: 1100, margin: '0 auto',
    position: 'relative', zIndex: 2,
  },
  sectionHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text)',
  },
  viewAll: {
    padding: '7px 16px', borderRadius: 20, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--accent2)', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
  },
  previewCards: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16,
  },
  previewCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, overflow: 'hidden',
  },
  previewImg: {
    height: 170, backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative',
  },
  previewBadge: {
    position: 'absolute', top: 10, left: 10, padding: '4px 10px',
    background: 'rgba(10,15,30,0.75)', backdropFilter: 'blur(8px)',
    color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 20,
  },
  previewBody: { padding: '14px 16px' },
  previewPrice: {
    fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
    color: 'var(--text)', marginBottom: 4,
  },
  previewArea: { color: 'var(--text2)', fontSize: 13, marginBottom: 4 },
  previewDetails: { color: 'var(--text3)', fontSize: 12 },
  whySection: {
    padding: '48px 24px', maxWidth: 1100, margin: '0 auto',
    position: 'relative', zIndex: 2,
  },
  whyGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16, marginTop: 24,
  },
  whyCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '20px',
  },
  whyIcon: { fontSize: 28, display: 'block', marginBottom: 10 },
  whyTitle: { fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 },
  whySub: { color: 'var(--text2)', fontSize: 13, lineHeight: 1.6 },
  footer: {
    textAlign: 'center', color: 'var(--text3)', fontSize: 12,
    padding: '40px 24px', display: 'flex', gap: 12, justifyContent: 'center',
    flexWrap: 'wrap', position: 'relative', zIndex: 2,
  },
}
