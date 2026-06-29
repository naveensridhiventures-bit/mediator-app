import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LISTINGS = [
  { id: 1, type: 'apartment', bhk: '3 BHK', area: 'Anna Nagar', price: '₹65 Lakh', sqft: '1,450 sq ft', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', amenities: ['Parking', 'Lift', 'Security'], age: '5 yrs', floor: '3rd Floor', facing: 'East', listing: 'sell', views: 142 },
  { id: 2, type: 'house', bhk: '4 BHK', area: 'Adyar', price: '₹1.2 Cr', sqft: '2,200 sq ft', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600', amenities: ['Parking', 'Garden', 'Generator'], age: '10 yrs', floor: 'Ground + 1', facing: 'North', listing: 'sell', views: 89 },
  { id: 3, type: 'plot', bhk: 'Open Plot', area: 'OMR', price: '₹45 Lakh', sqft: '1,800 sq ft', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', amenities: ['Near Metro', 'School Nearby'], age: 'NA', floor: 'NA', facing: 'West', listing: 'sell', views: 234 },
  { id: 4, type: 'apartment', bhk: '2 BHK', area: 'Velachery', price: '₹22,000/mo', sqft: '980 sq ft', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600', amenities: ['Parking', 'Lift', 'Near Metro'], age: '3 yrs', floor: '5th Floor', facing: 'South', listing: 'rent', views: 312 },
  { id: 5, type: 'commercial', bhk: 'Office Space', area: 'T.Nagar', price: '₹80 Lakh', sqft: '1,100 sq ft', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', amenities: ['Parking', 'Lift', 'Generator', 'Security'], age: '8 yrs', floor: '2nd Floor', facing: 'East', listing: 'sell', views: 56 },
  { id: 6, type: 'house', bhk: '3 BHK', area: 'Porur', price: '₹85 Lakh', sqft: '1,800 sq ft', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600', amenities: ['Parking', 'Garden', 'Security'], age: '7 yrs', floor: 'Ground', facing: 'North', listing: 'sell', views: 101 },
]

const TYPE_ICONS = { apartment: '🏢', house: '🏠', plot: '🌿', commercial: '🏪', warehouse: '🏭', hotel: '🏨', gym: '🏋️', salon: '💇' }
const AREAS = ['All', 'Anna Nagar', 'Adyar', 'T.Nagar', 'Velachery', 'OMR', 'ECR', 'Porur', 'Tambaram', 'Chromepet', 'Nungambakkam']
const TYPES = ['All', 'apartment', 'house', 'plot', 'commercial']

export default function Marketplace() {
  const navigate = useNavigate()
  const [area, setArea] = useState('All')
  const [type, setType] = useState('All')
  const [listing, setListing] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [contacted, setContacted] = useState(new Set())

  const filtered = LISTINGS.filter(l => {
    if (area !== 'All' && l.area !== area) return false
    if (type !== 'All' && l.type !== type) return false
    if (listing !== 'all' && l.listing !== listing) return false
    if (search && !`${l.bhk} ${l.area} ${l.type} ${l.price}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleContact = (id) => {
    setContacted(prev => new Set([...prev, id]))
    const msg = `Hi MidiDater! I'm interested in the property listed in ${selected?.area || ''}. Please share more details.`
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />

      {/* Header */}
      <header style={s.header}>
        <button style={s.back} onClick={() => navigate('/')}>← Home</button>
        <div style={s.logo}>
          <span>🏡</span>
          <span style={s.logoText}>MidiDater</span>
        </div>
        <button style={s.sellBtn} onClick={() => navigate('/sell')}>+ List Property</button>
      </header>

      <div style={s.heroMini}>
        <h1 style={s.title}>Browse Properties</h1>
        <p style={s.sub}>Chennai's best properties — contact MidiDater to get exact address & connect with owner</p>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <input style={s.search} placeholder="🔍 Search by area, type, BHK…"
          value={search} onChange={e => setSearch(e.target.value)} />

        <div style={s.filterRow}>
          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Listing</span>
            <div style={s.chipRow}>
              {[['all', 'All'], ['sell', 'For Sale'], ['rent', 'For Rent']].map(([v, l]) => (
                <button key={v} style={{ ...s.chip, background: listing === v ? 'var(--accent)' : 'var(--surface2)', color: listing === v ? '#fff' : 'var(--text2)', border: listing === v ? '1px solid var(--accent)' : '1px solid var(--border)' }} onClick={() => setListing(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div style={s.filterGroup}>
            <span style={s.filterLabel}>Type</span>
            <div style={s.chipRow}>
              {TYPES.map(t => (
                <button key={t} style={{ ...s.chip, background: type === t ? 'var(--accent)' : 'var(--surface2)', color: type === t ? '#fff' : 'var(--text2)', border: type === t ? '1px solid var(--accent)' : '1px solid var(--border)' }} onClick={() => setType(t)}>{t === 'All' ? 'All' : TYPE_ICONS[t] + ' ' + t}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={s.areaScroll}>
          {AREAS.map(a => (
            <button key={a} style={{ ...s.areaChip, background: area === a ? 'var(--surface2)' : 'transparent', color: area === a ? 'var(--text)' : 'var(--text3)', borderBottom: area === a ? '2px solid var(--accent)' : '2px solid transparent' }} onClick={() => setArea(a)}>{a}</button>
          ))}
        </div>
      </div>

      <div style={s.resultBar}>
        <span style={s.count}>{filtered.length} properties found</span>
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {filtered.map(p => (
          <div key={p.id} style={s.card} onClick={() => setSelected(p)}>
            <div style={{ ...s.cardImg, backgroundImage: `url(${p.img})` }}>
              <div style={s.cardImgOverlay}>
                <span style={s.typeBadge}>{TYPE_ICONS[p.type]} {p.type}</span>
                <span style={{ ...s.listingBadge, background: p.listing === 'sell' ? 'var(--accent)' : 'var(--green)' }}>
                  {p.listing === 'sell' ? 'For Sale' : 'For Rent'}
                </span>
              </div>
              <div style={s.viewCount}>👁 {p.views}</div>
            </div>
            <div style={s.cardBody}>
              <div style={s.cardPrice}>{p.price}</div>
              <div style={s.cardArea}>📍 {p.area}, Chennai</div>
              <div style={s.cardSpecs}>{p.bhk} · {p.sqft}</div>
              <div style={s.amenityRow}>
                {p.amenities.slice(0, 3).map(a => (
                  <span key={a} style={s.amenityTag}>{a}</span>
                ))}
              </div>
              <button style={s.contactBtn} onClick={e => { e.stopPropagation(); setSelected(p); }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize: 48 }}>🏘️</div>
          <p style={{ color: 'var(--text2)', marginTop: 12 }}>No properties match your filters</p>
          <button style={{ ...s.contactBtn, marginTop: 16 }} onClick={() => { setArea('All'); setType('All'); setListing('all'); setSearch('') }}>Clear Filters</button>
        </div>
      )}

      {/* Property Modal */}
      {selected && (
        <div style={s.modalOverlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.modalClose} onClick={() => setSelected(null)}>✕</button>
            <div style={{ ...s.modalImg, backgroundImage: `url(${selected.img})` }}>
              <div style={{ ...s.listingBadge, position: 'absolute', top: 12, left: 12, background: selected.listing === 'sell' ? 'var(--accent)' : 'var(--green)', fontSize: 12, padding: '5px 12px' }}>
                {selected.listing === 'sell' ? '🏷️ For Sale' : '🔑 For Rent'}
              </div>
            </div>
            <div style={s.modalBody}>
              <div style={s.modalPrice}>{selected.price}</div>
              <div style={s.modalArea}>📍 {selected.area}, Chennai <span style={s.privacyHint}>(Exact address shared after inquiry)</span></div>
              <div style={s.modalSpecs}>
                <span>{selected.bhk}</span>
                <span>·</span>
                <span>{selected.sqft}</span>
                <span>·</span>
                <span>{selected.age}</span>
                <span>·</span>
                <span>{selected.facing} Facing</span>
              </div>
              <div style={s.specGrid}>
                {[
                  { label: 'Floor', val: selected.floor },
                  { label: 'Facing', val: selected.facing },
                  { label: 'Age', val: selected.age },
                  { label: 'Area', val: selected.sqft },
                ].map(sp => (
                  <div key={sp.label} style={s.specItem}>
                    <div style={s.specLabel}>{sp.label}</div>
                    <div style={s.specVal}>{sp.val}</div>
                  </div>
                ))}
              </div>
              <div style={s.amenLabel}>Amenities</div>
              <div style={s.amenityRow}>
                {selected.amenities.map(a => <span key={a} style={s.amenityTag}>{a}</span>)}
              </div>
              <div style={s.privacyBanner}>
                🔒 <strong style={{ color: 'var(--text)' }}>Privacy Protected:</strong> The owner's contact and exact address are kept private. Contact MidiDater and we'll connect you with the owner personally after verifying your interest.
              </div>
              <button style={s.waBtn} onClick={() => handleContact(selected.id)}>
                <span>💬</span>
                <span>Contact MidiDater on WhatsApp</span>
              </button>
              {contacted.has(selected.id) && (
                <p style={s.contacted}>✓ Inquiry sent! Our team will reach out within 24 hours.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer style={s.footer}>© 2024 MidiDater · Chennai, Tamil Nadu</footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '0 0 60px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', top: -100, left: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', position: 'sticky', top: 0, background: 'rgba(7,13,26,0.9)', backdropFilter: 'blur(12px)', zIndex: 100, borderBottom: '1px solid var(--border)' },
  back: { padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sellBtn: { padding: '8px 16px', borderRadius: 10, border: 'none', background: 'var(--green)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  heroMini: { textAlign: 'center', padding: '28px 20px 16px', position: 'relative', zIndex: 2 },
  title: { fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--text)' },
  sub: { color: 'var(--text2)', fontSize: 13, marginTop: 6 },
  filters: { maxWidth: 1100, margin: '0 auto', padding: '0 20px 16px', position: 'relative', zIndex: 2 },
  search: { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', marginBottom: 14 },
  filterRow: { display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  filterLabel: { color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
  chipRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip: { padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  areaScroll: { display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 },
  areaChip: { padding: '8px 14px', whiteSpace: 'nowrap', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  resultBar: { maxWidth: 1100, margin: '0 auto 16px', padding: '0 20px', position: 'relative', zIndex: 2 },
  count: { color: 'var(--text3)', fontSize: 13 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardImg: { height: 180, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  cardImgOverlay: { position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10 },
  typeBadge: { padding: '4px 10px', background: 'rgba(10,15,30,0.75)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 20 },
  listingBadge: { padding: '4px 10px', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 20 },
  viewCount: { position: 'absolute', bottom: 8, right: 10, color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  cardBody: { padding: '14px 16px' },
  cardPrice: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 },
  cardArea: { color: 'var(--text2)', fontSize: 13, marginBottom: 4 },
  cardSpecs: { color: 'var(--text3)', fontSize: 12, marginBottom: 10 },
  amenityRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  amenityTag: { padding: '3px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11, color: 'var(--text2)' },
  contactBtn: { width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px 20px', position: 'relative', zIndex: 2 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  modal: { background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  modalClose: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', border: 'none', color: 'var(--text2)', fontSize: 16, cursor: 'pointer', zIndex: 10 },
  modalImg: { height: 220, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  modalBody: { padding: '20px' },
  modalPrice: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 6 },
  modalArea: { color: 'var(--text2)', fontSize: 14, marginBottom: 10 },
  privacyHint: { color: 'var(--text3)', fontSize: 11 },
  modalSpecs: { display: 'flex', gap: 8, flexWrap: 'wrap', color: 'var(--text2)', fontSize: 13, marginBottom: 16 },
  specGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 },
  specItem: { background: 'var(--surface2)', borderRadius: 10, padding: '10px', textAlign: 'center' },
  specLabel: { color: 'var(--text3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 },
  specVal: { color: 'var(--text)', fontSize: 13, fontWeight: 700 },
  amenLabel: { color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  privacyBanner: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16, marginTop: 16 },
  waBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  contacted: { textAlign: 'center', color: 'var(--green)', fontSize: 13, marginTop: 12, fontWeight: 600 },
  footer: { textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 40, position: 'relative', zIndex: 2 },
}
