import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth.jsx'

const TABS = ['Overview', 'Seller Listings', 'Buyer Inquiries', 'Image Editor']

// Sample data — in production these come from the backend API
const SELLERS = [
  { id: 1, name: 'Ravi Kumar', phone: '9876543210', whatsapp: '9876543210', email: 'ravi@gmail.com', type: 'apartment', bhk: '3 BHK', price: '₹65 Lakh', area: 'Anna Nagar', exact_address: '42, 3rd Cross St, Anna Nagar West', sqft: '1450', description: 'Well-maintained flat, 3rd floor, East facing, near bus stop.', amenities: ['Parking', 'Lift', 'Security'], listing: 'sell', status: 'active', photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'], submitted: '2024-01-15', views: 142 },
  { id: 2, name: 'Priya Subramanian', phone: '9845612378', whatsapp: '9845612378', email: 'priya@gmail.com', type: 'house', bhk: '4 BHK', price: '₹1.2 Cr', area: 'Adyar', exact_address: '7, Lattice Bridge Rd, Adyar', sqft: '2200', description: 'Spacious independent house with garden and car park.', amenities: ['Parking', 'Garden', 'Generator'], listing: 'sell', status: 'active', photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'], submitted: '2024-01-18', views: 89 },
  { id: 3, name: 'Karthik Raj', phone: '9988776655', whatsapp: '9988776655', email: '', type: 'plot', bhk: 'Open Plot', price: '₹45 Lakh', area: 'OMR', exact_address: 'Survey No. 124, Sholinganallur Village, OMR', sqft: '1800', description: 'DTCP approved plot, near IT corridor, all utilities available.', amenities: ['Near Metro', 'School Nearby'], listing: 'sell', status: 'pending', photos: [], submitted: '2024-01-20', views: 0 },
]

const BUYERS = [
  { id: 1, name: 'Anand Krishnan', phone: '9123456789', email: 'anand@gmail.com', type: 'apartment', bhk: '2 BHK', budget: '₹40–60 Lakh', location: 'Anna Nagar or Kilpauk', requirements: 'Ground or 1st floor preferred, parking must, near school', submitted: '2024-01-19', status: 'New' },
  { id: 2, name: 'Meena Devi', phone: '9234567890', email: '', type: 'house', bhk: '3 BHK', budget: '₹80L–1 Cr', location: 'Adyar, Mylapore', requirements: 'Quiet street, not main road, min 1500 sqft', submitted: '2024-01-20', status: 'contacted' },
  { id: 3, name: 'Sundar Rajan', phone: '9345678901', email: 'sundar@gmail.com', type: 'plot', bhk: 'NA', budget: '₹25–50 Lakh', location: 'OMR, ECR', requirements: 'Min 1200 sqft, DTCP approved, near highway', submitted: '2024-01-21', status: 'New' },
]

const STATUS_COLORS = {
  active: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  sold: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  New: { bg: 'rgba(129,140,248,0.12)', color: '#818cf8' },
  contacted: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  interested: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  closed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
}

const TYPE_ICONS = { apartment: '🏢', house: '🏠', plot: '🌿', commercial: '🏪', warehouse: '🏭', hotel: '🏨', gym: '🏋️', salon: '💇' }

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: 'var(--surface2)', color: 'var(--text3)' }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>{status?.toUpperCase()}</span>
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAdminAuth()
  const [tab, setTab] = useState(0)
  const [sellers, setSellers] = useState(SELLERS)
  const [buyers, setBuyers] = useState(BUYERS)
  const [editSeller, setEditSeller] = useState(null)
  const [editImage, setEditImage] = useState(null) // { sellerId, photoIdx }
  const [imagePrompt, setImagePrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [buyerStatus, setBuyerStatus] = useState({})
  const [search, setSearch] = useState('')

  const updateSeller = (id, changes) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))
    if (editSeller?.id === id) setEditSeller(prev => ({ ...prev, ...changes }))
  }

  const updateBuyerStatus = (id, status) => {
    setBuyers(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const handleAiEnhance = async () => {
    setAiLoading(true)
    setAiResult(null)
    setTimeout(() => {
      setAiResult('✨ Image enhanced! Brightness +15%, Contrast adjusted, Background cleaned. Ready to publish.')
      setAiLoading(false)
    }, 2000)
  }

  const filteredSellers = sellers.filter(s =>
    !search || `${s.name} ${s.area} ${s.type} ${s.phone}`.toLowerCase().includes(search.toLowerCase())
  )
  const filteredBuyers = buyers.filter(b =>
    !search || `${b.name} ${b.area} ${b.type} ${b.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total Listings', val: sellers.length, icon: '🏠', color: '#818cf8' },
    { label: 'Active Listings', val: sellers.filter(s => s.status === 'active').length, icon: '✅', color: '#10b981' },
    { label: 'Buyer Inquiries', val: buyers.length, icon: '🔍', color: '#f59e0b' },
    { label: 'Pending Review', val: sellers.filter(s => s.status === 'pending').length, icon: '⏳', color: '#f97316' },
  ]

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sideLogo}>
            <span>🏡</span>
            <span style={s.sideLogoText}>MidiDater</span>
          </div>
          <div style={s.sideTag}>Admin Panel</div>
        </div>

        <nav style={s.nav}>
          {TABS.map((t, i) => (
            <button key={t} style={{ ...s.navBtn, background: tab === i ? 'var(--accent)' : 'transparent', color: tab === i ? '#fff' : 'var(--text2)' }} onClick={() => setTab(i)}>
              <span>{['📊', '🏠', '🔍', '🖼️'][i]}</span>
              <span>{t}</span>
            </button>
          ))}
        </nav>

        <div style={s.sideBottom}>
          <button style={s.viewSite} onClick={() => navigate('/listings')}>View Site →</button>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Search */}
        <div style={s.topBar}>
          <input style={s.search} placeholder="🔍 Search by name, phone, area…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* OVERVIEW */}
        {tab === 0 && (
          <div>
            <h2 style={s.pageTitle}>Overview</h2>
            <div style={s.statsGrid}>
              {stats.map(st => (
                <div key={st.label} style={s.statCard}>
                  <div style={{ fontSize: 28 }}>{st.icon}</div>
                  <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>

            <h3 style={s.sectionTitle}>Recent Seller Submissions</h3>
            <div style={s.table}>
              <div style={s.tableHead}>
                <span>Seller</span><span>Property</span><span>Area</span><span>Price</span><span>Status</span><span>Action</span>
              </div>
              {sellers.slice(0, 5).map(s2 => (
                <div key={s2.id} style={s.tableRow}>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{s2.name}</span>
                  <span style={{ color: 'var(--text2)' }}>{TYPE_ICONS[s2.type]} {s2.bhk}</span>
                  <span style={{ color: 'var(--text2)' }}>{s2.area}</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{s2.price}</span>
                  <StatusBadge status={s2.status} />
                  <button style={s.rowBtn} onClick={() => { setEditSeller(s2); setTab(1) }}>Edit</button>
                </div>
              ))}
            </div>

            <h3 style={{ ...s.sectionTitle, marginTop: 32 }}>Recent Buyer Inquiries</h3>
            <div style={s.table}>
              <div style={s.tableHead}>
                <span>Buyer</span><span>Looking For</span><span>Budget</span><span>Location</span><span>Status</span><span>Contact</span>
              </div>
              {buyers.map(b => (
                <div key={b.id} style={s.tableRow}>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.name}</span>
                  <span style={{ color: 'var(--text2)' }}>{TYPE_ICONS[b.type]} {b.bhk}</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{b.budget}</span>
                  <span style={{ color: 'var(--text2)' }}>{b.location}</span>
                  <StatusBadge status={b.status} />
                  <a href={`https://wa.me/91${b.phone}`} target="_blank" rel="noreferrer" style={s.waLink}>WhatsApp</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SELLER LISTINGS */}
        {tab === 1 && (
          <div>
            <h2 style={s.pageTitle}>Seller Listings <span style={s.countBadge}>{filteredSellers.length}</span></h2>
            <div style={s.listingsGrid}>
              {filteredSellers.map(sl => (
                <div key={sl.id} style={s.listingCard}>
                  {/* Photo */}
                  <div style={{ ...s.listingImg, backgroundImage: sl.photos?.[0] ? `url(${sl.photos[0]})` : 'none', background: sl.photos?.[0] ? undefined : 'var(--surface2)' }}>
                    {!sl.photos?.[0] && <span style={s.noPhoto}>📷 No Photos</span>}
                    <div style={s.listingImgActions}>
                      <button style={s.imgBtn} onClick={() => { setEditImage({ sellerId: sl.id, photoIdx: 0 }); setTab(3) }}>✏️ Edit Photo</button>
                    </div>
                    <StatusBadge status={sl.status} />
                  </div>
                  {/* Info */}
                  <div style={s.listingInfo}>
                    <div style={s.listingTop}>
                      <div>
                        <div style={s.listingPrice}>{sl.price}</div>
                        <div style={s.listingMeta}>{TYPE_ICONS[sl.type]} {sl.bhk} · {sl.sqft} sqft</div>
                      </div>
                      <div style={s.viewsTag}>👁 {sl.views}</div>
                    </div>

                    {/* Full private info — only admin sees */}
                    <div style={s.privateBox}>
                      <div style={s.privateLabel}>🔒 Private (not shown to public)</div>
                      <div style={s.privateRow}><span style={s.pLabel}>Owner:</span><span style={s.pVal}>{sl.name}</span></div>
                      <div style={s.privateRow}><span style={s.pLabel}>Phone:</span><a href={`tel:+91${sl.phone}`} style={s.pLink}>{sl.phone}</a></div>
                      <div style={s.privateRow}><span style={s.pLabel}>WhatsApp:</span><a href={`https://wa.me/91${sl.whatsapp}`} target="_blank" rel="noreferrer" style={{ ...s.pLink, color: 'var(--wa)' }}>{sl.whatsapp}</a></div>
                      {sl.email && <div style={s.privateRow}><span style={s.pLabel}>Email:</span><span style={s.pVal}>{sl.email}</span></div>}
                      <div style={s.privateRow}><span style={s.pLabel}>Address:</span><span style={s.pVal}>{sl.exact_address || 'Not provided'}</span></div>
                    </div>

                    {/* Public info */}
                    <div style={s.publicBox}>
                      <div style={s.publicLabel}>🌐 Public view</div>
                      <div style={s.pVal}>📍 {sl.area}, Chennai · {sl.bhk} · {sl.price}</div>
                    </div>

                    <div style={s.desc}>{sl.description}</div>
                    <div style={s.amenityRow}>
                      {sl.amenities.map(a => <span key={a} style={s.amenTag}>{a}</span>)}
                    </div>

                    {/* Actions */}
                    <div style={s.actionsRow}>
                      <select style={s.statusSelect} value={sl.status} onChange={e => updateSeller(sl.id, { status: e.target.value })}>
                        <option value="pending">⏳ Pending</option>
                        <option value="active">✅ Active</option>
                        <option value="sold">🏷️ Sold</option>
                        <option value="paused">⏸ Paused</option>
                      </select>
                      <button style={s.actionBtn} onClick={() => { setEditImage({ sellerId: sl.id, photoIdx: 0 }); setTab(3) }}>🖼 Photos</button>
                      <a href={`https://wa.me/91${sl.whatsapp || sl.phone}`} target="_blank" rel="noreferrer" style={s.waActionBtn}>💬 WhatsApp</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUYER INQUIRIES */}
        {tab === 2 && (
          <div>
            <h2 style={s.pageTitle}>Buyer Inquiries <span style={s.countBadge}>{filteredBuyers.length}</span></h2>
            <div style={s.buyerGrid}>
              {filteredBuyers.map(b => (
                <div key={b.id} style={s.buyerCard}>
                  <div style={s.buyerHead}>
                    <div>
                      <div style={s.buyerName}>{b.name}</div>
                      <div style={s.buyerMeta}>{TYPE_ICONS[b.type]} Looking for {b.bhk} {b.type}</div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div style={s.buyerInfo}>
                    <div style={s.infoRow}><span style={s.infoLabel}>Budget</span><span style={{ ...s.infoVal, color: 'var(--gold)', fontWeight: 700 }}>{b.budget}</span></div>
                    <div style={s.infoRow}><span style={s.infoLabel}>Preferred Area</span><span style={s.infoVal}>{b.location}</span></div>
                    <div style={s.infoRow}><span style={s.infoLabel}>Submitted</span><span style={s.infoVal}>{b.submitted}</span></div>
                  </div>

                  <div style={s.reqBox}>
                    <div style={s.reqLabel}>Requirements</div>
                    <div style={s.reqText}>{b.requirements}</div>
                  </div>

                  {/* Full private contact — admin only */}
                  <div style={s.privateBox}>
                    <div style={s.privateLabel}>🔒 Contact (private)</div>
                    <div style={s.privateRow}><span style={s.pLabel}>Phone:</span><a href={`tel:+91${b.phone}`} style={s.pLink}>{b.phone}</a></div>
                    {b.email && <div style={s.privateRow}><span style={s.pLabel}>Email:</span><span style={s.pVal}>{b.email}</span></div>}
                  </div>

                  <div style={s.buyerActions}>
                    <select style={s.statusSelect} value={b.status} onChange={e => updateBuyerStatus(b.id, e.target.value)}>
                      <option value="New">🆕 New</option>
                      <option value="contacted">📞 Contacted</option>
                      <option value="interested">🔥 Interested</option>
                      <option value="negotiation">🤝 Negotiation</option>
                      <option value="closed">✅ Closed</option>
                      <option value="lost">❌ Lost</option>
                    </select>
                    <a href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(`Hi ${b.name}, this is MidiDater. We found a matching property for you in ${b.location}. Are you still looking?`)}`} target="_blank" rel="noreferrer" style={s.waActionBtn}>💬 WhatsApp</a>
                    <a href={`tel:+91${b.phone}`} style={s.callBtn}>📞 Call</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMAGE EDITOR */}
        {tab === 3 && (
          <div>
            <h2 style={s.pageTitle}>Image Editor</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14 }}>
              Select a property and enhance photos. Our admin team can also use AI prompts to describe enhancements before manually editing.
            </p>
            <div style={s.imgEditorGrid}>
              {sellers.map(sl => (
                <div key={sl.id} style={s.imgEditorCard}>
                  <div style={s.imgEditorHeader}>
                    <span style={{ color: 'var(--text)', fontWeight: 700 }}>{sl.name}</span>
                    <span style={{ color: 'var(--text2)', fontSize: 12 }}>{sl.area} · {sl.bhk}</span>
                  </div>
                  <div style={s.photoStrip}>
                    {sl.photos && sl.photos.length > 0 ? sl.photos.map((ph, idx) => (
                      <div key={idx} style={s.photoItem}>
                        <img src={ph} alt="" style={s.photoImg} />
                        <div style={s.photoActions}>
                          <button style={s.enhanceBtn} onClick={() => {
                            setEditImage({ sellerId: sl.id, photoIdx: idx, url: ph })
                            setAiResult(null)
                            setImagePrompt('')
                          }}>✨ Enhance</button>
                        </div>
                      </div>
                    )) : (
                      <div style={s.noPhotoBox}>
                        <span style={{ color: 'var(--text3)', fontSize: 13 }}>No photos uploaded yet</span>
                      </div>
                    )}
                    {/* Upload more */}
                    <label style={s.addPhotoBtn}>
                      <span>+</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={ev => {
                        const file = ev.target.files[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          updateSeller(sl.id, { photos: [...(sl.photos || []), e.target.result] })
                        }
                        reader.readAsDataURL(file)
                      }} />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhancement panel */}
            {editImage && (
              <div style={s.enhancePanel}>
                <h3 style={s.enhancePanelTitle}>✨ Enhance Photo</h3>
                {editImage.url && <img src={editImage.url} alt="" style={s.enhancePreview} />}
                <label style={s.enhanceLabel}>Describe the enhancement (note for your editor or AI)</label>
                <textarea style={s.enhanceInput} placeholder="e.g. Brighten the image, remove the background clutter, make it look more professional…"
                  value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} rows={3} />
                <button style={{ ...s.enhanceSubmit, opacity: aiLoading ? 0.7 : 1 }}
                  onClick={handleAiEnhance} disabled={aiLoading}>
                  {aiLoading ? '⏳ Processing…' : '🚀 Apply Enhancement'}
                </button>
                {aiResult && (
                  <div style={s.aiResult}>{aiResult}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  sidebar: { width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 },
  sideTop: { padding: '20px 16px 16px' },
  sideLogo: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  sideLogoText: { fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sideTag: { fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
  nav: { flex: 1, padding: '8px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s' },
  sideBottom: { padding: '12px' },
  viewSite: { width: '100%', padding: '9px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--accent2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 },
  logoutBtn: { width: '100%', padding: '9px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text3)', fontSize: 13, cursor: 'pointer' },
  main: { flex: 1, padding: '24px', overflowY: 'auto' },
  topBar: { marginBottom: 24 },
  search: { width: '100%', maxWidth: 420, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 16px', color: 'var(--text)', fontSize: 14, outline: 'none' },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 },
  countBadge: { fontSize: 14, padding: '4px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text2)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 32 },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px', textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginTop: 4 },
  statLabel: { color: 'var(--text3)', fontSize: 12, fontWeight: 600, marginTop: 4 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 12 },
  table: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 8 },
  tableHead: { display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr 1fr 0.7fr', padding: '10px 16px', background: 'var(--surface2)', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, gap: 8 },
  tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr 1fr 0.7fr', padding: '12px 16px', borderTop: '1px solid var(--border)', gap: 8, alignItems: 'center', fontSize: 13 },
  rowBtn: { padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 12, cursor: 'pointer' },
  waLink: { color: 'var(--wa)', fontWeight: 600, fontSize: 12, textDecoration: 'none' },
  listingsGrid: { display: 'flex', flexDirection: 'column', gap: 16 },
  listingCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', gap: 0 },
  listingImg: { width: 220, flexShrink: 0, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 10, minHeight: 180 },
  noPhoto: { fontSize: 24, textAlign: 'center', marginTop: 'auto', color: 'var(--text3)' },
  listingImgActions: { display: 'flex', gap: 6 },
  imgBtn: { padding: '4px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11, border: 'none', cursor: 'pointer' },
  listingInfo: { flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 },
  listingTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  listingPrice: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text)' },
  listingMeta: { color: 'var(--text2)', fontSize: 13 },
  viewsTag: { color: 'var(--text3)', fontSize: 12 },
  privateBox: { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 12px' },
  privateLabel: { color: '#f87171', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  privateRow: { display: 'flex', gap: 8, marginBottom: 4, fontSize: 13 },
  pLabel: { color: 'var(--text3)', fontWeight: 600, minWidth: 60 },
  pVal: { color: 'var(--text)', fontWeight: 500 },
  pLink: { color: 'var(--accent2)', fontWeight: 600 },
  publicBox: { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '8px 12px' },
  publicLabel: { color: 'var(--green)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  desc: { color: 'var(--text2)', fontSize: 13, lineHeight: 1.5 },
  amenityRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  amenTag: { padding: '3px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11, color: 'var(--text2)' },
  actionsRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  statusSelect: { padding: '7px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 13, cursor: 'pointer', outline: 'none' },
  actionBtn: { padding: '7px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' },
  waActionBtn: { padding: '7px 14px', borderRadius: 10, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  callBtn: { padding: '7px 14px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  buyerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 },
  buyerCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 },
  buyerHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  buyerName: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  buyerMeta: { color: 'var(--text2)', fontSize: 13, marginTop: 2 },
  buyerInfo: { display: 'flex', flexDirection: 'column', gap: 6 },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13 },
  infoLabel: { color: 'var(--text3)', fontWeight: 600 },
  infoVal: { color: 'var(--text2)' },
  reqBox: { background: 'var(--surface2)', borderRadius: 10, padding: '10px 12px' },
  reqLabel: { color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  reqText: { color: 'var(--text)', fontSize: 13, lineHeight: 1.5 },
  buyerActions: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  imgEditorGrid: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 },
  imgEditorCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px' },
  imgEditorHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  photoStrip: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  photoItem: { position: 'relative', width: 120, height: 80, borderRadius: 10, overflow: 'hidden' },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  photoActions: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 },
  enhanceBtn: { padding: '4px 8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' },
  noPhotoBox: { padding: '16px', background: 'var(--surface2)', borderRadius: 10, textAlign: 'center' },
  addPhotoBtn: { width: 80, height: 80, borderRadius: 10, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--text3)', cursor: 'pointer' },
  enhancePanel: { background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 16, padding: '20px', maxWidth: 560 },
  enhancePanelTitle: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 12 },
  enhancePreview: { width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 14 },
  enhanceLabel: { display: 'block', color: 'var(--text2)', fontSize: 13, fontWeight: 600, marginBottom: 8 },
  enhanceInput: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', marginBottom: 12 },
  enhanceSubmit: { width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  aiResult: { marginTop: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '10px 12px', color: 'var(--green)', fontSize: 13, fontWeight: 500 },
}
