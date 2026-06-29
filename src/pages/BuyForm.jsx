import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitLead } from '../utils/api.js'
import MapPicker from '../components/MapPicker.jsx'

const PROPERTY_TYPES = [
  { id: 'house', icon: '🏠', label: 'House', desc: 'Independent home' },
  { id: 'apartment', icon: '🏢', label: 'Apartment', desc: 'Flat / Condo' },
  { id: 'gym', icon: '🏋️', label: 'Gym', desc: 'Fitness center space' },
  { id: 'salon', icon: '💇', label: 'Salon', desc: 'Beauty & parlour' },
  { id: 'hotel', icon: '🏨', label: 'Hotel / PG', desc: 'Hotel or PG rooms' },
  { id: 'commercial', icon: '🏪', label: 'Shop', desc: 'Retail / office' },
  { id: 'plot', icon: '🌿', label: 'Plot / Land', desc: 'Open land or site' },
  { id: 'warehouse', icon: '🏭', label: 'Warehouse', desc: 'Storage / godown' },
]

const BUDGETS = [
  'Under ₹10 Lakh', '₹10–25 Lakh', '₹25–50 Lakh', '₹50L–1 Cr',
  '₹1–2 Cr', '₹2–5 Cr', 'Above ₹5 Cr', 'Rental / Monthly'
]

const BHK = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Studio', 'N/A']

const STEPS = ['Property', 'Details', 'Location', 'Contact']

export default function UserForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    property_type: '',
    budget: '',
    bhk: '',
    area_sqft: '',
    requirements: '',
    location: '',
    latitude: null,
    longitude: null,
    name: '',
    phone: '',
    email: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validateStep = () => {
    const e = {}
    if (step === 0 && !form.property_type) e.property_type = 'Please select a property type'
    if (step === 1) {
      if (!form.budget) e.budget = 'Select your budget range'
      if (!form.requirements.trim()) e.requirements = 'Tell us what you need'
    }
    if (step === 2 && !form.location.trim()) e.location = 'Enter your preferred area'
    if (step === 3) {
      if (!form.name.trim()) e.name = 'Your name is required'
      if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const back = () => { setStep(s => s - 1); setErrors({}) }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    try {
      await submitLead(form)
      navigate('/thank-you')
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏡</span>
          <span style={styles.logoText}>MidiDater</span>
        </div>
        <p style={styles.tagline}>Property Mediation Experts</p>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Find Your <span style={styles.highlight}>Perfect</span><br />Property Match
        </h1>
        <p style={styles.heroSub}>Tell us what you're looking for — we'll handle the rest.</p>
      </div>

      {/* Step indicator */}
      <div style={styles.stepWrap}>
        {STEPS.map((s, i) => (
          <div key={s} style={styles.stepItem}>
            <div style={{
              ...styles.stepDot,
              background: i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--surface2)',
              boxShadow: i === step ? '0 0 0 4px rgba(99,102,241,0.25)' : 'none'
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, color: i === step ? 'var(--text)' : 'var(--text3)' }}>{s}</span>
            {i < STEPS.length - 1 && <div style={{ ...styles.stepLine, background: i < step ? 'var(--green)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div style={styles.card}>

        {/* STEP 0: Property Type */}
        {step === 0 && (
          <div>
            <h2 style={styles.cardTitle}>What are you looking for?</h2>
            <p style={styles.cardSub}>Select the type of property you need</p>
            <div style={styles.typeGrid}>
              {PROPERTY_TYPES.map(pt => (
                <button key={pt.id} style={{
                  ...styles.typeCard,
                  border: form.property_type === pt.id
                    ? '2px solid var(--accent)' : '2px solid var(--border)',
                  background: form.property_type === pt.id
                    ? 'rgba(99,102,241,0.12)' : 'var(--surface)',
                  transform: form.property_type === pt.id ? 'scale(1.03)' : 'scale(1)'
                }} onClick={() => { set('property_type', pt.id); setErrors({}) }}>
                  <span style={styles.typeIcon}>{pt.icon}</span>
                  <span style={styles.typeLabel}>{pt.label}</span>
                  <span style={styles.typeDesc}>{pt.desc}</span>
                </button>
              ))}
            </div>
            {errors.property_type && <p style={styles.error}>{errors.property_type}</p>}
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <div>
            <h2 style={styles.cardTitle}>Property Details</h2>
            <p style={styles.cardSub}>Help us find the perfect match for you</p>

            <label style={styles.label}>Budget Range *</label>
            <div style={styles.chipGrid}>
              {BUDGETS.map(b => (
                <button key={b} style={{
                  ...styles.chip,
                  background: form.budget === b ? 'var(--accent)' : 'var(--surface2)',
                  color: form.budget === b ? '#fff' : 'var(--text2)',
                  border: form.budget === b ? '1px solid var(--accent)' : '1px solid var(--border)'
                }} onClick={() => set('budget', b)}>{b}</button>
              ))}
            </div>
            {errors.budget && <p style={styles.error}>{errors.budget}</p>}

            {['house', 'apartment'].includes(form.property_type) && (
              <>
                <label style={styles.label}>BHK Configuration</label>
                <div style={styles.chipGrid}>
                  {BHK.map(b => (
                    <button key={b} style={{
                      ...styles.chip,
                      background: form.bhk === b ? 'var(--accent)' : 'var(--surface2)',
                      color: form.bhk === b ? '#fff' : 'var(--text2)',
                      border: form.bhk === b ? '1px solid var(--accent)' : '1px solid var(--border)'
                    }} onClick={() => set('bhk', b)}>{b}</button>
                  ))}
                </div>
              </>
            )}

            <label style={styles.label}>Area Required (sq ft)</label>
            <input style={styles.input} type="number" placeholder="e.g. 1200"
              value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} />

            <label style={styles.label}>Your Requirements *</label>
            <textarea style={{ ...styles.input, height: 100, resize: 'vertical' }}
              placeholder="Describe what you're looking for — amenities, ground floor preference, parking, etc."
              value={form.requirements} onChange={e => set('requirements', e.target.value)} />
            {errors.requirements && <p style={styles.error}>{errors.requirements}</p>}
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div>
            <h2 style={styles.cardTitle}>Preferred Location</h2>
            <p style={styles.cardSub}>Pin the area you're interested in</p>

            <label style={styles.label}>Area / Locality *</label>
            <input style={styles.input} type="text"
              placeholder="e.g. Anna Nagar, Adyar, OMR, T.Nagar, Velachery…"
              value={form.location} onChange={e => set('location', e.target.value)} />
            {errors.location && <p style={styles.error}>{errors.location}</p>}

            <label style={styles.label}>Pin on Map <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span></label>
            <MapPicker onSelect={(lat, lng) => { set('latitude', lat); set('longitude', lng) }} />
            {form.latitude && (
              <p style={styles.mapInfo}>📍 Pinned: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
            )}
          </div>
        )}

        {/* STEP 3: Contact */}
        {step === 3 && (
          <div>
            <h2 style={styles.cardTitle}>Your Contact Details</h2>
            <p style={styles.cardSub}>We'll reach out to you personally — no spam, ever.</p>

            <label style={styles.label}>Full Name *</label>
            <input style={styles.input} type="text" placeholder="Your name"
              value={form.name} onChange={e => set('name', e.target.value)} />
            {errors.name && <p style={styles.error}>{errors.name}</p>}

            <label style={styles.label}>Mobile Number *</label>
            <div style={{ position: 'relative' }}>
              <span style={styles.phonePrefix}>+91</span>
              <input style={{ ...styles.input, paddingLeft: 52 }} type="tel"
                placeholder="10-digit mobile" maxLength={10}
                value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
            </div>
            {errors.phone && <p style={styles.error}>{errors.phone}</p>}

            <label style={styles.label}>Email <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span></label>
            <input style={styles.input} type="email" placeholder="your@email.com"
              value={form.email} onChange={e => set('email', e.target.value)} />

            <div style={styles.privacyNote}>
              🔒 Your details are <strong>100% private</strong>. Only our team can access your information. It will never be shared or listed publicly.
            </div>
          </div>
        )}

        {errors.submit && <p style={{ ...styles.error, marginTop: 12 }}>{errors.submit}</p>}

        {/* Navigation */}
        <div style={styles.navRow}>
          {step > 0 && (
            <button style={styles.btnBack} onClick={back}>← Back</button>
          )}
          {step < 3 ? (
            <button style={{ ...styles.btnNext, marginLeft: step === 0 ? 'auto' : 0 }} onClick={next}>
              Continue →
            </button>
          ) : (
            <button style={{ ...styles.btnSubmit, opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Submitting…' : '🚀 Submit My Requirement'}
            </button>
          )}
        </div>
      </div>

      <p style={styles.footer}>© 2024 MidiDater · Property Mediation Experts · Chennai</p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a1628 100%)',
    padding: '0 0 60px',
  },
  header: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '28px 20px 0',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { fontSize: 28 },
  logoText: {
    fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
    background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  tagline: { color: 'var(--text3)', fontSize: 12, marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' },
  hero: { textAlign: 'center', padding: '32px 20px 20px' },
  heroTitle: {
    fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,5vw,38px)',
    fontWeight: 800, lineHeight: 1.2, color: 'var(--text)'
  },
  highlight: {
    background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  heroSub: { color: 'var(--text2)', marginTop: 12, fontSize: 15 },
  stepWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 0, padding: '0 20px 24px', maxWidth: 420, margin: '0 auto'
  },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 },
  stepDot: {
    width: 32, height: 32, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 13,
    fontWeight: 700, color: '#fff', transition: 'all 0.3s', zIndex: 1,
    position: 'relative'
  },
  stepLabel: { fontSize: 11, marginTop: 6, fontWeight: 600, textAlign: 'center' },
  stepLine: {
    position: 'absolute', top: 16, left: 'calc(50% + 16px)',
    width: 'calc(100% - 32px)', height: 2, transition: 'background 0.3s'
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '28px 24px',
    maxWidth: 520, margin: '0 auto', boxShadow: 'var(--shadow-lg)'
  },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 },
  cardSub: { color: 'var(--text2)', fontSize: 14, marginBottom: 24 },
  typeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16
  },
  typeCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: 2, padding: '14px 14px', borderRadius: 14, cursor: 'pointer',
    transition: 'all 0.2s', textAlign: 'left', width: '100%'
  },
  typeIcon: { fontSize: 24, marginBottom: 4 },
  typeLabel: { fontWeight: 700, fontSize: 14, color: 'var(--text)' },
  typeDesc: { fontSize: 12, color: 'var(--text3)' },
  label: { display: 'block', color: 'var(--text2)', fontSize: 13, fontWeight: 600, marginBottom: 8, marginTop: 18 },
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    padding: '7px 14px', borderRadius: 20, fontSize: 13,
    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)'
  },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '12px 14px', color: 'var(--text)', fontSize: 15,
    outline: 'none', fontFamily: 'var(--font-body)', transition: 'border 0.2s',
    marginBottom: 4
  },
  phonePrefix: {
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--text2)', fontSize: 14, fontWeight: 600, pointerEvents: 'none'
  },
  mapInfo: {
    marginTop: 8, fontSize: 13, color: 'var(--green)',
    background: 'rgba(16,185,129,0.1)', padding: '8px 12px', borderRadius: 8
  },
  privacyNote: {
    marginTop: 20, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text2)',
    lineHeight: 1.5
  },
  error: { color: '#f87171', fontSize: 12, marginTop: 4, fontWeight: 500 },
  navRow: { display: 'flex', gap: 12, marginTop: 28, justifyContent: 'space-between' },
  btnBack: {
    padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text2)', fontSize: 14,
    fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
  },
  btnNext: {
    padding: '12px 28px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-body)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
  },
  btnSubmit: {
    flex: 1, padding: '14px 20px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-body)', boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
    transition: 'opacity 0.2s'
  },
  footer: { textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 40 }
}
