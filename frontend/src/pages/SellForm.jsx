import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const PROPERTY_TYPES = [
  { id: 'apartment', icon: '🏢', label: 'Apartment', desc: 'Flat / Condo' },
  { id: 'house', icon: '🏠', label: 'House', desc: 'Independent home' },
  { id: 'plot', icon: '🌿', label: 'Plot / Land', desc: 'Open land or site' },
  { id: 'commercial', icon: '🏪', label: 'Shop / Office', desc: 'Commercial space' },
  { id: 'warehouse', icon: '🏭', label: 'Warehouse', desc: 'Storage / godown' },
  { id: 'hotel', icon: '🏨', label: 'Hotel / PG', desc: 'Hotel or PG rooms' },
  { id: 'gym', icon: '🏋️', label: 'Gym', desc: 'Fitness center space' },
  { id: 'salon', icon: '💇', label: 'Salon', desc: 'Beauty & parlour' },
]

const CHENNAI_AREAS = [
  'Anna Nagar', 'Adyar', 'T.Nagar', 'Velachery', 'OMR', 'ECR',
  'Porur', 'Tambaram', 'Chromepet', 'Perambur', 'Kilpauk',
  'Nungambakkam', 'Mylapore', 'Poonamallee', 'Guindy', 'Other'
]

const PRICE_RANGES = [
  'Under ₹10 Lakh', '₹10–25 Lakh', '₹25–50 Lakh', '₹50L–1 Cr',
  '₹1–2 Cr', '₹2–5 Cr', 'Above ₹5 Cr', 'Negotiable'
]

const BHK = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Studio', 'N/A']

const STEPS = ['Property', 'Details', 'Photos', 'Contact']

export default function SellForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [photos, setPhotos] = useState([])
  const fileRef = useRef()

  const [form, setForm] = useState({
    property_type: '',
    price: '',
    bhk: '',
    area_sqft: '',
    area_locality: '',
    custom_area: '',
    description: '',
    amenities: [],
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    listing_type: 'sell',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validateStep = () => {
    const e = {}
    if (step === 0 && !form.property_type) e.property_type = 'Select a property type'
    if (step === 1) {
      if (!form.price) e.price = 'Select a price range'
      if (!form.area_locality) e.area_locality = 'Select your area'
      if (!form.description.trim()) e.description = 'Add a brief description'
    }
    if (step === 3) {
      if (!form.name.trim()) e.name = 'Your name is required'
      if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const back = () => { setStep(s => s - 1); setErrors({}) }

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, { url: ev.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (idx) => setPhotos(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      navigate('/thank-you?type=sell')
    }, 1500)
  }

  const toggleAmenity = (a) => {
    set('amenities', form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a])
  }

  const AMENITIES = ['Parking', 'Lift', 'Generator', 'Security', 'Garden', 'Swimming Pool', 'Gym', 'Near Metro', 'School Nearby', 'Hospital Nearby']

  return (
    <div style={s.page}>
      <div style={s.glow} />

      {/* Header */}
      <header style={s.header}>
        <button style={s.back} onClick={() => navigate('/')}>← Back</button>
        <div style={s.logo}>
          <span>🏡</span>
          <span style={s.logoText}>MidiDater</span>
        </div>
        <span style={s.headerTag}>Sell Property</span>
      </header>

      <div style={s.heroMini}>
        <h1 style={s.title}>List Your Property</h1>
        <p style={s.sub}>Our team will personally handle inquiries — your contact stays private.</p>
      </div>

      {/* Step indicator */}
      <div style={s.steps}>
        {STEPS.map((st, i) => (
          <div key={st} style={s.stepItem}>
            <div style={{
              ...s.dot,
              background: i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--surface2)',
              boxShadow: i === step ? '0 0 0 4px rgba(99,102,241,0.25)' : 'none'
            }}>{i < step ? '✓' : i + 1}</div>
            <span style={{ ...s.stepLabel, color: i === step ? 'var(--text)' : 'var(--text3)' }}>{st}</span>
            {i < STEPS.length - 1 && <div style={{ ...s.stepLine, background: i < step ? 'var(--green)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={s.card}>

        {/* STEP 0: Type */}
        {step === 0 && (
          <div>
            <h2 style={s.cardTitle}>What are you selling?</h2>
            <p style={s.cardSub}>Select the type of property</p>
            <div style={s.typeGrid}>
              {PROPERTY_TYPES.map(pt => (
                <button key={pt.id} style={{
                  ...s.typeCard,
                  border: form.property_type === pt.id ? '2px solid var(--green)' : '2px solid var(--border)',
                  background: form.property_type === pt.id ? 'rgba(16,185,129,0.1)' : 'var(--surface2)',
                }} onClick={() => { set('property_type', pt.id); setErrors({}) }}>
                  <span style={s.typeIcon}>{pt.icon}</span>
                  <span style={s.typeLabel}>{pt.label}</span>
                  <span style={s.typeDesc}>{pt.desc}</span>
                </button>
              ))}
            </div>
            {errors.property_type && <p style={s.err}>{errors.property_type}</p>}

            <label style={s.label}>Listing Type</label>
            <div style={s.chipGrid}>
              {[{ id: 'sell', label: '🏷️ For Sale' }, { id: 'rent', label: '🔑 For Rent' }].map(lt => (
                <button key={lt.id} style={{
                  ...s.chip,
                  background: form.listing_type === lt.id ? 'var(--accent)' : 'var(--surface2)',
                  color: form.listing_type === lt.id ? '#fff' : 'var(--text2)',
                  border: form.listing_type === lt.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                }} onClick={() => set('listing_type', lt.id)}>{lt.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <div>
            <h2 style={s.cardTitle}>Property Details</h2>
            <p style={s.cardSub}>The more detail, the more serious buyers you attract</p>

            <label style={s.label}>Price / Ask *</label>
            <div style={s.chipGrid}>
              {PRICE_RANGES.map(p => (
                <button key={p} style={{
                  ...s.chip,
                  background: form.price === p ? 'var(--green)' : 'var(--surface2)',
                  color: form.price === p ? '#fff' : 'var(--text2)',
                  border: form.price === p ? '1px solid var(--green)' : '1px solid var(--border)',
                }} onClick={() => set('price', p)}>{p}</button>
              ))}
            </div>
            {errors.price && <p style={s.err}>{errors.price}</p>}

            <label style={s.label}>Exact Price (optional)</label>
            <input style={s.input} type="text" placeholder="e.g. ₹72,00,000"
              value={form.exact_price || ''} onChange={e => set('exact_price', e.target.value)} />

            {['house', 'apartment'].includes(form.property_type) && (
              <>
                <label style={s.label}>BHK Configuration</label>
                <div style={s.chipGrid}>
                  {BHK.map(b => (
                    <button key={b} style={{
                      ...s.chip,
                      background: form.bhk === b ? 'var(--accent)' : 'var(--surface2)',
                      color: form.bhk === b ? '#fff' : 'var(--text2)',
                      border: form.bhk === b ? '1px solid var(--accent)' : '1px solid var(--border)',
                    }} onClick={() => set('bhk', b)}>{b}</button>
                  ))}
                </div>
              </>
            )}

            <label style={s.label}>Area (sq ft)</label>
            <input style={s.input} type="number" placeholder="e.g. 1200"
              value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} />

            <label style={s.label}>Locality / Area * <span style={{ color: 'var(--text3)', fontSize: 12 }}>(shown to buyers)</span></label>
            <div style={s.chipGrid}>
              {CHENNAI_AREAS.map(a => (
                <button key={a} style={{
                  ...s.chip,
                  background: form.area_locality === a ? 'var(--accent)' : 'var(--surface2)',
                  color: form.area_locality === a ? '#fff' : 'var(--text2)',
                  border: form.area_locality === a ? '1px solid var(--accent)' : '1px solid var(--border)',
                }} onClick={() => set('area_locality', a)}>{a}</button>
              ))}
            </div>
            {form.area_locality === 'Other' && (
              <input style={{ ...s.input, marginTop: 10 }} type="text" placeholder="Enter area name"
                value={form.custom_area} onChange={e => set('custom_area', e.target.value)} />
            )}
            {errors.area_locality && <p style={s.err}>{errors.area_locality}</p>}

            <label style={s.label}>Exact Address <span style={{ color: 'var(--text3)', fontSize: 12 }}>(private — only admin sees this)</span></label>
            <textarea style={{ ...s.input, height: 70 }} placeholder="Door no., Street, Landmark…"
              value={form.exact_address || ''} onChange={e => set('exact_address', e.target.value)} />

            <label style={s.label}>Description *</label>
            <textarea style={{ ...s.input, height: 100, resize: 'vertical' }}
              placeholder="Describe the property — age, floor, facing, special features, nearby landmarks…"
              value={form.description} onChange={e => set('description', e.target.value)} />
            {errors.description && <p style={s.err}>{errors.description}</p>}

            <label style={s.label}>Amenities</label>
            <div style={s.chipGrid}>
              {AMENITIES.map(a => (
                <button key={a} style={{
                  ...s.chip,
                  background: form.amenities.includes(a) ? 'rgba(99,102,241,0.2)' : 'var(--surface2)',
                  color: form.amenities.includes(a) ? 'var(--accent2)' : 'var(--text2)',
                  border: form.amenities.includes(a) ? '1px solid var(--accent)' : '1px solid var(--border)',
                }} onClick={() => toggleAmenity(a)}>{a}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Photos */}
        {step === 2 && (
          <div>
            <h2 style={s.cardTitle}>Upload Property Photos</h2>
            <p style={s.cardSub}>Our admin will enhance your photos for maximum appeal. Add as many as you want.</p>

            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhoto} />
            <button style={s.uploadBtn} onClick={() => fileRef.current.click()}>
              📷 Add Photos
            </button>

            {photos.length > 0 && (
              <div style={s.photoGrid}>
                {photos.map((p, i) => (
                  <div key={i} style={s.photoWrap}>
                    <img src={p.url} alt="" style={s.photoThumb} />
                    {i === 0 && <span style={s.mainBadge}>Cover</span>}
                    <button style={s.photoRemove} onClick={() => removePhoto(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <div style={s.photoEmpty} onClick={() => fileRef.current.click()}>
                <div style={{ fontSize: 40 }}>📸</div>
                <p style={{ color: 'var(--text2)', marginTop: 8 }}>Tap to upload photos</p>
                <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 4 }}>JPG, PNG · Multiple allowed</p>
              </div>
            )}

            <div style={s.photoNote}>
              ✨ <strong style={{ color: 'var(--text)' }}>Admin Enhancement:</strong> Our team will professionally edit your photos before publishing — brightening, cropping, and improving clarity so your listing stands out.
            </div>
          </div>
        )}

        {/* STEP 3: Contact */}
        {step === 3 && (
          <div>
            <h2 style={s.cardTitle}>Your Contact Details</h2>
            <p style={s.cardSub}>Buyers will never see this — they contact us and we forward serious inquiries to you.</p>

            <label style={s.label}>Full Name *</label>
            <input style={s.input} type="text" placeholder="Your name"
              value={form.name} onChange={e => set('name', e.target.value)} />
            {errors.name && <p style={s.err}>{errors.name}</p>}

            <label style={s.label}>Mobile Number *</label>
            <div style={{ position: 'relative' }}>
              <span style={s.prefix}>+91</span>
              <input style={{ ...s.input, paddingLeft: 52 }} type="tel"
                placeholder="10-digit mobile" maxLength={10}
                value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
            </div>
            {errors.phone && <p style={s.err}>{errors.phone}</p>}

            <label style={s.label}>WhatsApp Number <span style={{ color: 'var(--text3)', fontSize: 12 }}>(if different)</span></label>
            <div style={{ position: 'relative' }}>
              <span style={s.prefix}>+91</span>
              <input style={{ ...s.input, paddingLeft: 52 }} type="tel"
                placeholder="WhatsApp number" maxLength={10}
                value={form.whatsapp} onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))} />
            </div>

            <label style={s.label}>Email <span style={{ color: 'var(--text3)', fontSize: 12 }}>(optional)</span></label>
            <input style={s.input} type="email" placeholder="your@email.com"
              value={form.email} onChange={e => set('email', e.target.value)} />

            <div style={s.privacyBox}>
              🔒 <strong style={{ color: 'var(--text)' }}>Your contact is 100% private.</strong> It will never be shown on the public listing. Buyers contact MidiDater and we personally screen and connect you with serious buyers only.
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={s.nav}>
          {step > 0 && <button style={s.btnBack} onClick={back}>← Back</button>}
          {step < 3 ? (
            <button style={{ ...s.btnNext, marginLeft: step === 0 ? 'auto' : 0 }} onClick={next}>
              Continue →
            </button>
          ) : (
            <button style={{ ...s.btnSubmit, opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Submitting…' : '🚀 Submit Listing'}
            </button>
          )}
        </div>
      </div>

      {/* Previous listings preview */}
      {step === 0 && (
        <div style={s.prevSection}>
          <h3 style={s.prevTitle}>Recent Successful Sales by MidiDater</h3>
          <div style={s.prevGrid}>
            {PREV_SALES.map(p => (
              <div key={p.id} style={s.prevCard}>
                <div style={{ ...s.prevImg, backgroundImage: `url(${p.img})` }}>
                  <span style={s.soldBadge}>SOLD ✓</span>
                </div>
                <div style={s.prevBody}>
                  <div style={s.prevPrice}>{p.price}</div>
                  <div style={s.prevArea}>📍 {p.area}, Chennai</div>
                  <div style={s.prevDays}>⚡ Sold in {p.days} days</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer style={s.footer}>© 2024 MidiDater · Chennai, Tamil Nadu</footer>
    </div>
  )
}

const PREV_SALES = [
  { id: 1, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', price: '₹78 Lakh', area: 'Anna Nagar', days: 12 },
  { id: 2, img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400', price: '₹1.4 Cr', area: 'Adyar', days: 8 },
  { id: 3, img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400', price: '₹55 Lakh', area: 'Velachery', days: 18 },
]

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '0 0 60px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', top: -150, right: -150, width: 500, height: 500, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', position: 'relative', zIndex: 2 },
  back: { padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  headerTag: { padding: '5px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--green)', fontSize: 12, fontWeight: 700 },
  heroMini: { textAlign: 'center', padding: '24px 20px 12px', position: 'relative', zIndex: 2 },
  title: { fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--text)' },
  sub: { color: 'var(--text2)', fontSize: 14, marginTop: 6 },
  steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px 20px', maxWidth: 420, margin: '0 auto', position: 'relative', zIndex: 2 },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 },
  dot: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', transition: 'all 0.3s', zIndex: 1 },
  stepLabel: { fontSize: 10, marginTop: 5, fontWeight: 600 },
  stepLine: { position: 'absolute', top: 16, left: 'calc(50% + 16px)', width: 'calc(100% - 32px)', height: 2, transition: 'background 0.3s' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 20px', maxWidth: 520, margin: '0 auto', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 2 },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 4 },
  cardSub: { color: 'var(--text2)', fontSize: 13, marginBottom: 20 },
  typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 },
  typeCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '14px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' },
  typeIcon: { fontSize: 22, marginBottom: 4 },
  typeLabel: { fontWeight: 700, fontSize: 13, color: 'var(--text)' },
  typeDesc: { fontSize: 11, color: 'var(--text3)' },
  label: { display: 'block', color: 'var(--text2)', fontSize: 13, fontWeight: 600, marginBottom: 8, marginTop: 18 },
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { padding: '7px 13px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border 0.2s', marginBottom: 4 },
  prefix: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)', fontSize: 14, fontWeight: 600, pointerEvents: 'none' },
  uploadBtn: { width: '100%', padding: '14px', borderRadius: 14, border: '2px dashed var(--border)', background: 'var(--surface2)', color: 'var(--text2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 16 },
  photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 },
  photoWrap: { position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1' },
  photoThumb: { width: '100%', height: '100%', objectFit: 'cover' },
  mainBadge: { position: 'absolute', top: 6, left: 6, padding: '2px 8px', background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10 },
  photoRemove: { position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  photoEmpty: { border: '2px dashed var(--border)', borderRadius: 16, padding: '48px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 },
  photoNote: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 },
  privacyBox: { marginTop: 20, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 },
  err: { color: '#f87171', fontSize: 12, marginTop: 4, fontWeight: 500 },
  nav: { display: 'flex', gap: 12, marginTop: 28, justifyContent: 'space-between' },
  btnBack: { padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnNext: { padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' },
  btnSubmit: { flex: 1, padding: '14px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(16,185,129,0.4)', transition: 'opacity 0.2s' },
  prevSection: { maxWidth: 520, margin: '36px auto 0', padding: '0 20px', position: 'relative', zIndex: 2 },
  prevTitle: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 },
  prevGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  prevCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' },
  prevImg: { height: 100, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  soldBadge: { position: 'absolute', top: 6, left: 6, padding: '2px 8px', background: 'var(--green)', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 10 },
  prevBody: { padding: '10px' },
  prevPrice: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: 'var(--text)' },
  prevArea: { color: 'var(--text2)', fontSize: 11, marginTop: 2 },
  prevDays: { color: 'var(--gold)', fontSize: 11, marginTop: 2, fontWeight: 600 },
  footer: { textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 40, position: 'relative', zIndex: 2 },
}
