import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth.jsx'
import { getLeads, getStats } from '../utils/api.js'

const STAGES = [
  { id: 'New', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', icon: '🆕' },
  { id: 'contacted', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '📞' },
  { id: 'interested', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '🔥' },
  { id: 'negotiation', color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: '🤝' },
  { id: 'closed', color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '✅' },
  { id: 'lost', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '❌' },
]

const PROPERTY_ICONS = {
  house: '🏠', apartment: '🏢', gym: '🏋️', salon: '💇',
  hotel: '🏨', commercial: '🏪', plot: '🌿', warehouse: '🏭'
}

function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < breakpoint) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

function StageTag({ stage }) {
  const s = STAGES.find(x => x.id === stage) || STAGES[0]
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.color}40`
    }}>{s.icon} {s.id.toUpperCase()}</span>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { authHeader, logout } = useAdminAuth()
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Close the mobile drawer automatically if the viewport grows back to desktop
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  async function loadData() {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        getLeads(authHeader), getStats(authHeader)
      ])
      setLeads(leadsRes.leads || [])
      setStats(statsRes)
    } catch { logout() }
    finally { setLoading(false) }
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search || [l.Name, l.Phone, l.Location, l['Property Type']]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchStage = filterStage === 'all' || l.Status === filterStage
    const matchType = filterType === 'all' || l['Property Type'] === filterType
    return matchSearch && matchStage && matchType
  })

  const uniqueTypes = [...new Set(leads.map(l => l['Property Type']).filter(Boolean))]

  return (
    <div style={styles.page}>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={styles.mobileTopBar}>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <div style={styles.mobileLogo}>
            <span>🏡</span>
            <span style={styles.sideLogoText}>MidiDater</span>
          </div>
          <button style={styles.menuBtn} onClick={loadData} aria-label="Refresh">🔄</button>
        </div>
      )}

      {/* Backdrop for mobile drawer */}
      {isMobile && menuOpen && (
        <div style={styles.backdrop} onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar (fixed on desktop, slide-in drawer on mobile) */}
      <div style={{
        ...styles.sidebar,
        ...(isMobile ? styles.sidebarMobile : {}),
        ...(isMobile && menuOpen ? styles.sidebarMobileOpen : {}),
      }}>
        <div style={styles.sideTop}>
          <div style={styles.sideLogo}>
            <span>🏡</span>
            <div>
              <div style={styles.sideLogoText}>MidiDater</div>
              <div style={styles.sideLogoBadge}>Admin CRM</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <div style={{ ...styles.navItem, ...styles.navItemActive }}>📊 Dashboard</div>
            <div style={styles.navItem} onClick={() => { navigate('/admin'); setMenuOpen(false) }}>🏠 All Leads</div>
            <div style={styles.navItem} onClick={() => window.open('/', '_blank')}>📝 Lead Form</div>
          </nav>
        </div>

        <button style={styles.logoutBtn} onClick={logout}>⬅️ Log Out</button>
      </div>

      {/* Main */}
      <div style={{ ...styles.main, ...(isMobile ? styles.mainMobile : {}) }}>
        {/* Header (desktop only — mobile uses the top bar above) */}
        {!isMobile && (
          <div style={styles.topBar}>
            <div>
              <h1 style={styles.pageTitle}>Lead Dashboard</h1>
              <p style={styles.pageSub}>{loading ? 'Loading…' : `${filtered.length} of ${leads.length} leads`}</p>
            </div>
            <div style={styles.topActions}>
              <button style={styles.refreshBtn} onClick={loadData}>🔄 Refresh</button>
              <button style={styles.newLeadBtn} onClick={() => window.open('/', '_blank')}>+ New Lead</button>
            </div>
          </div>
        )}
        {isMobile && (
          <div style={styles.mobilePageHeader}>
            <p style={styles.pageSub}>{loading ? 'Loading…' : `${filtered.length} of ${leads.length} leads`}</p>
            <button style={styles.newLeadBtnMobile} onClick={() => window.open('/', '_blank')}>+ New</button>
          </div>
        )}

        {/* Stats Row */}
        {stats && (
          <div style={styles.statsRow}>
            {[
              { label: 'Total Leads', value: stats.total, icon: '👥', color: '#818cf8' },
              { label: 'New', value: stats.new, icon: '🆕', color: '#818cf8' },
              { label: 'Interested', value: stats.interested || 0, icon: '🔥', color: '#10b981' },
              { label: 'Closed', value: stats.closed || 0, icon: '✅', color: '#10b981' },
            ].map(s => (
              <div key={s.label} style={styles.statCard}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={styles.filterBar}>
          <input style={styles.searchInput} placeholder="🔍 Search name, phone, location…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select style={styles.select} value={filterStage} onChange={e => setFilterStage(e.target.value)}>
            <option value="all">All Stages</option>
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.id}</option>)}
          </select>
          <select style={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{PROPERTY_ICONS[t] || '🏠'} {t}</option>)}
          </select>
        </div>

        {/* Lead Cards */}
        {loading ? (
          <div style={styles.loadWrap}>
            <div style={styles.spinner} />
            <p style={{ color: 'var(--text2)', marginTop: 12 }}>Loading leads…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 48 }}>📭</span>
            <p>No leads found</p>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {filtered.map(lead => (
              <LeadCard key={lead.ID} lead={lead} onClick={() => navigate(`/admin/lead/${lead.ID}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LeadCard({ lead, onClick }) {
  const ptIcon = PROPERTY_ICONS[lead['Property Type']] || '🏠'

  const handleCall = (e) => {
    e.stopPropagation()
    window.open(`tel:+91${lead.Phone}`)
  }

  const handleWhatsApp = (e) => {
    e.stopPropagation()
    const msg = encodeURIComponent(
      `Hi ${lead.Name}! 👋\n\nThank you for reaching out to *MidiDater* regarding a *${lead['Property Type']}* in *${lead.Location}*.\n\nWe've reviewed your requirement and would love to share some great options with you.\n\nCan we connect for a quick call?\n\n— MidiDater Team 🏡`
    )
    window.open(`https://wa.me/91${lead.Phone}?text=${msg}`)
  }

  return (
    <div style={styles.leadCard} onClick={onClick}>
      <div style={styles.lcHeader}>
        <div style={styles.lcAvatar}>{lead.Name?.[0]?.toUpperCase() || '?'}</div>
        <div style={{ flex: 1 }}>
          <div style={styles.lcName}>{lead.Name}</div>
          <div style={styles.lcPhone}>📞 +91 {lead.Phone}</div>
        </div>
        <StageTag stage={lead.Status || 'New'} />
      </div>

      <div style={styles.lcBody}>
        <div style={styles.lcType}>
          <span style={styles.lcTypeIcon}>{ptIcon}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{lead['Property Type']}</span>
          {lead.BHK && <span style={styles.lcBadge}>{lead.BHK}</span>}
        </div>
        {lead.Location && <div style={styles.lcDetail}>📍 {lead.Location}</div>}
        {lead.Budget && <div style={styles.lcDetail}>💰 {lead.Budget}</div>}
        {lead.Requirements && (
          <div style={styles.lcReq}>
            "{lead.Requirements.slice(0, 80)}{lead.Requirements.length > 80 ? '…' : ''}"
          </div>
        )}
      </div>

      <div style={styles.lcFooter}>
        <span style={styles.lcDate}>{lead['Created At']?.split(' ')[0]}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ ...styles.lcBtn, ...styles.lcBtnCall }} onClick={handleCall}>📞 Call</button>
          <button style={{ ...styles.lcBtn, ...styles.lcBtnWA }} onClick={handleWhatsApp}>💬 WA</button>
          <button style={{ ...styles.lcBtn, ...styles.lcBtnView }} onClick={onClick}>View →</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },

  // --- Mobile top bar ---
  mobileTopBar: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)'
  },
  mobileLogo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 18 },
  menuBtn: {
    width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
    background: 'var(--surface2)', color: 'var(--text)', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
  },
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 35
  },

  // --- Sidebar ---
  sidebar: {
    width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0
  },
  sidebarMobile: {
    position: 'fixed', top: 0, left: 0, height: '100vh', width: 240,
    zIndex: 40, transform: 'translateX(-100%)', transition: 'transform 0.25s ease',
    boxShadow: '8px 0 32px rgba(0,0,0,0.4)'
  },
  sidebarMobileOpen: { transform: 'translateX(0)' },

  sideTop: {},
  sideLogo: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '0 20px 28px', fontSize: 24
  },
  sideLogoText: {
    fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800,
    background: 'linear-gradient(135deg, #818cf8, #6366f1)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  sideLogoBadge: { fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  nav: { display: 'flex', flexDirection: 'column', gap: 2 },
  navItem: {
    padding: '11px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    color: 'var(--text2)', borderRadius: '0 12px 12px 0', margin: '0 10px 0 0',
    transition: 'all 0.15s'
  },
  navItemActive: {
    background: 'rgba(99,102,241,0.12)', color: '#818cf8',
    borderLeft: '3px solid #6366f1'
  },
  logoutBtn: {
    margin: '0 16px', padding: '10px', borderRadius: 10, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text3)', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'var(--font-body)'
  },

  // --- Main ---
  main: { flex: 1, padding: '28px 24px', overflowY: 'auto', minWidth: 0 },
  mainMobile: { padding: '70px 14px 24px', width: '100%' },

  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 },
  pageSub: { color: 'var(--text3)', fontSize: 13, marginTop: 2 },
  topActions: { display: 'flex', gap: 10 },
  refreshBtn: {
    padding: '9px 16px', borderRadius: 10, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
  },
  newLeadBtn: {
    padding: '9px 16px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)'
  },
  mobilePageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16
  },
  newLeadBtnMobile: {
    padding: '7px 14px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)'
  },

  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 14, marginBottom: 24
  },
  statCard: {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
    padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0
  },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 },
  statLabel: { fontSize: 12, color: 'var(--text3)', fontWeight: 600 },
  filterBar: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  searchInput: {
    flex: 1, minWidth: 200, background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14,
    outline: 'none', fontFamily: 'var(--font-body)'
  },
  select: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontSize: 13,
    outline: 'none', fontFamily: 'var(--font-body)', cursor: 'pointer'
  },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  loadWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80 },
  spinner: {
    width: 36, height: 36, border: '3px solid var(--border)',
    borderTopColor: 'var(--accent)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  empty: { textAlign: 'center', color: 'var(--text3)', paddingTop: 80, fontSize: 18 },

  // Lead card
  leadCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '16px', cursor: 'pointer',
    transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
  },
  lcHeader: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  lcAvatar: {
    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 800, color: '#fff'
  },
  lcName: { fontWeight: 700, fontSize: 15, color: 'var(--text)' },
  lcPhone: { fontSize: 12, color: 'var(--text2)', marginTop: 2 },
  lcBody: { borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 12 },
  lcType: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  lcTypeIcon: { fontSize: 18 },
  lcBadge: {
    background: 'rgba(99,102,241,0.15)', color: '#818cf8',
    padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700
  },
  lcDetail: { fontSize: 13, color: 'var(--text2)', marginBottom: 3 },
  lcReq: {
    fontSize: 12, color: 'var(--text3)', fontStyle: 'italic',
    background: 'var(--surface2)', borderRadius: 8, padding: '6px 10px', marginTop: 8
  },
  lcFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  lcDate: { fontSize: 11, color: 'var(--text3)' },
  lcBtn: {
    padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'var(--font-body)', border: 'none', transition: 'opacity 0.15s'
  },
  lcBtnCall: { background: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  lcBtnWA: { background: 'rgba(37,211,102,0.15)', color: '#4ade80' },
  lcBtnView: { background: 'rgba(255,255,255,0.06)', color: 'var(--text2)' },
}
