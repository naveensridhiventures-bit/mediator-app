import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth.jsx'
import { getLead, addPipelineEntry } from '../utils/api.js'

const STAGES = [
  { id: 'New', color: '#818cf8', icon: '🆕', desc: 'Just submitted' },
  { id: 'contacted', color: '#f59e0b', icon: '📞', desc: 'Called / messaged' },
  { id: 'interested', color: '#10b981', icon: '🔥', desc: 'Showing interest' },
  { id: 'negotiation', color: '#f97316', icon: '🤝', desc: 'In negotiation' },
  { id: 'closed', color: '#10b981', icon: '✅', desc: 'Deal done!' },
  { id: 'lost', color: '#ef4444', icon: '❌', desc: 'Not converted' },
]

function getWATemplates(lead) {
  const name = lead?.Name || 'there'
  const type = lead?.['Property Type'] || 'property'
  const loc = lead?.Location || 'your area'
  const budget = lead?.Budget || ''

  return [
    {
      label: '👋 First Contact',
      stage: 'contacted',
      msg: `Hi ${name}! 👋\n\nThank you for reaching out to *MidiDater* — we're excited to help you find the perfect *${type}* in *${loc}*.\n\nOur property expert will call you shortly. Let us know if you have any questions!\n\n🏡 *MidiDater – Property Mediation Experts*`
    },
    {
      label: '🏠 Property Options Ready',
      stage: 'interested',
      msg: `Hi ${name}! 🏡\n\nGreat news — we've shortlisted some excellent *${type}* options in *${loc}* that match your budget of *${budget}*.\n\nCould we arrange a site visit this week? Please reply with your convenient time!\n\n— MidiDater Team ✨`
    },
    {
      label: '🤝 Follow-up Reminder',
      stage: 'negotiation',
      msg: `Hi ${name}! 😊\n\nJust following up on the *${type}* options we discussed. Have you had a chance to think it over?\n\nWe're here to assist with any questions or to schedule another visit. Don't hesitate to reach out!\n\n🏡 *MidiDater*`
    },
    {
      label: '⭐ Deal Closed Congrats',
      stage: 'closed',
      msg: `Hi ${name}! 🎉\n\nCongratulations on securing your *${type}* — we're thrilled for you! 🏠\n\nThank you for trusting *MidiDater* for this important milestone. Please refer us to friends and family who need property help!\n\n⭐ *MidiDater – Property Mediation Experts*`
    },
    {
      label: '💬 Re-engage / Lost',
      stage: 'contacted',
      msg: `Hi ${name}! 👋\n\nWe understand that property decisions take time. Whenever you're ready to explore *${type}* options in *${loc}*, we're here to help.\n\nFeel free to reach out anytime — no pressure at all! 🙏\n\n— MidiDater Team`
    }
  ]
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { authHeader } = useAdminAuth()
  const [lead, setLead] = useState(null)
  const [pipeline, setPipeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [newStage, setNewStage] = useState('')
  const [remark, setRemark] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('info') // info | pipeline | whatsapp

  useEffect(() => { loadLead() }, [id])

  async function loadLead() {
    try {
      const data = await getLead(id, authHeader)
      setLead(data.lead)
      setPipeline(data.pipeline || [])
      setNewStage(data.lead?.Status || 'New')
    } catch { navigate('/admin') }
    finally { setLoading(false) }
  }

  async function handleAddPipeline() {
    if (!remark.trim()) return
    setSaving(true)
    try {
      await addPipelineEntry(id, { lead_id: id, stage: newStage, remark }, authHeader)
      setRemark('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      await loadLead()
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <p style={{ color: 'var(--text2)' }}>Loading lead…</p>
    </div>
  )

  if (!lead) return null

  const templates = getWATemplates(lead)
  const currentStageInfo = STAGES.find(s => s.id === lead.Status) || STAGES[0]

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Dashboard</button>
        <div style={styles.headerRight}>
          <a href={`tel:+91${lead.Phone}`} style={styles.callBtn}>📞 Call Now</a>
          <a href={`https://wa.me/91${lead.Phone}`} target="_blank" style={styles.waBtn}>💬 WhatsApp</a>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left: Lead Info */}
        <div style={styles.leftCol}>
          {/* Identity Card */}
          <div style={styles.idCard}>
            <div style={styles.idAvatar}>{lead.Name?.[0]?.toUpperCase()}</div>
            <div>
              <h2 style={styles.idName}>{lead.Name}</h2>
              <p style={styles.idPhone}>+91 {lead.Phone}</p>
              {lead.Email && <p style={styles.idEmail}>{lead.Email}</p>}
            </div>
            <div style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: currentStageInfo.color + '22', color: currentStageInfo.color,
              border: `1px solid ${currentStageInfo.color}44`, marginLeft: 'auto', alignSelf: 'flex-start'
            }}>
              {currentStageInfo.icon} {lead.Status}
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {['info', 'pipeline', 'whatsapp'].map(t => (
              <button key={t} style={{
                ...styles.tab,
                background: activeTab === t ? 'var(--accent)' : 'transparent',
                color: activeTab === t ? '#fff' : 'var(--text2)',
              }} onClick={() => setActiveTab(t)}>
                {t === 'info' ? '📋 Info' : t === 'pipeline' ? '🔄 Pipeline' : '💬 WhatsApp'}
              </button>
            ))}
          </div>

          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div style={styles.infoGrid}>
              {[
                { label: 'Property Type', value: lead['Property Type'], icon: '🏠' },
                { label: 'Budget', value: lead.Budget, icon: '💰' },
                { label: 'BHK', value: lead.BHK, icon: '🛏️' },
                { label: 'Area (sqft)', value: lead['Area SqFt'], icon: '📐' },
                { label: 'Location', value: lead.Location, icon: '📍' },
                { label: 'Submitted', value: lead['Created At'], icon: '🕐' },
              ].filter(i => i.value).map(item => (
                <div key={item.label} style={styles.infoRow}>
                  <span style={styles.infoIcon}>{item.icon}</span>
                  <div>
                    <div style={styles.infoLabel}>{item.label}</div>
                    <div style={styles.infoValue}>{item.value}</div>
                  </div>
                </div>
              ))}

              {lead.Requirements && (
                <div style={styles.reqBox}>
                  <div style={styles.reqLabel}>📝 Requirements</div>
                  <div style={styles.reqText}>{lead.Requirements}</div>
                </div>
              )}

              {lead.Latitude && lead.Longitude && (
                <a
                  href={`https://maps.google.com/?q=${lead.Latitude},${lead.Longitude}`}
                  target="_blank" style={styles.mapLink}
                >
                  🗺️ View on Google Maps →
                </a>
              )}
            </div>
          )}

          {/* PIPELINE TAB */}
          {activeTab === 'pipeline' && (
            <div>
              {/* Stage selector */}
              <div style={styles.stageRow}>
                {STAGES.map(s => (
                  <button key={s.id} style={{
                    ...styles.stageBtn,
                    border: newStage === s.id ? `2px solid ${s.color}` : '2px solid var(--border)',
                    background: newStage === s.id ? s.color + '22' : 'var(--surface2)',
                    color: newStage === s.id ? s.color : 'var(--text3)'
                  }} onClick={() => setNewStage(s.id)}>
                    {s.icon} {s.id}
                  </button>
                ))}
              </div>

              <textarea style={styles.remarkInput}
                placeholder="Add a remark or note about this update…"
                value={remark} onChange={e => setRemark(e.target.value)} rows={3} />

              <button style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
                onClick={handleAddPipeline} disabled={saving}>
                {saved ? '✅ Saved!' : saving ? '⏳ Saving…' : '💾 Save Pipeline Update'}
              </button>

              {/* Timeline */}
              <div style={styles.timelineWrap}>
                <h3 style={styles.timelineTitle}>📅 Activity Timeline</h3>
                {pipeline.length === 0 ? (
                  <p style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No activity yet</p>
                ) : [...pipeline].reverse().map((entry, i) => {
                  const s = STAGES.find(x => x.id === entry.Stage) || STAGES[0]
                  return (
                    <div key={i} style={styles.timelineItem}>
                      <div style={{ ...styles.tlDot, background: s.color }} />
                      <div style={styles.tlContent}>
                        <div style={styles.tlHeader}>
                          <span style={{ ...styles.tlStage, color: s.color }}>{s.icon} {entry.Stage}</span>
                          <span style={styles.tlDate}>{entry.DateTime}</span>
                        </div>
                        {entry.Remark && <p style={styles.tlRemark}>{entry.Remark}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* WHATSAPP TAB */}
          {activeTab === 'whatsapp' && (
            <div>
              <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16 }}>
                Click any template to open WhatsApp with the pre-filled message:
              </p>
              {templates.map((tmpl, i) => (
                <div key={i} style={styles.tmplCard}>
                  <div style={styles.tmplHeader}>
                    <span style={styles.tmplLabel}>{tmpl.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>→ {tmpl.stage}</span>
                  </div>
                  <pre style={styles.tmplMsg}>{tmpl.msg}</pre>
                  <a
                    href={`https://wa.me/91${lead.Phone}?text=${encodeURIComponent(tmpl.msg)}`}
                    target="_blank"
                    style={styles.tmplSendBtn}
                  >
                    💬 Send on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Actions */}
        <div style={styles.rightCol}>
          <div style={styles.quickCard}>
            <h3 style={styles.quickTitle}>⚡ Quick Actions</h3>
            <a href={`tel:+91${lead.Phone}`} style={styles.qBtn}>
              <span style={styles.qIcon}>📞</span>
              <div>
                <div style={styles.qLabel}>Call Client</div>
                <div style={styles.qSub}>+91 {lead.Phone}</div>
              </div>
            </a>
            <a href={`https://wa.me/91${lead.Phone}`} target="_blank" style={{ ...styles.qBtn, ...styles.qBtnWA }}>
              <span style={styles.qIcon}>💬</span>
              <div>
                <div style={styles.qLabel}>WhatsApp</div>
                <div style={styles.qSub}>Open chat</div>
              </div>
            </a>
            {lead.Latitude && (
              <a href={`https://maps.google.com/?q=${lead.Latitude},${lead.Longitude}`} target="_blank"
                style={{ ...styles.qBtn, ...styles.qBtnMap }}>
                <span style={styles.qIcon}>🗺️</span>
                <div>
                  <div style={styles.qLabel}>View Map</div>
                  <div style={styles.qSub}>Pinned location</div>
                </div>
              </a>
            )}
          </div>

          {/* Stage Pipeline Visual */}
          <div style={styles.pipelineVisual}>
            <h3 style={styles.quickTitle}>🔄 Pipeline Stage</h3>
            {STAGES.map((s, i) => (
              <div key={s.id} style={{
                ...styles.pvItem,
                opacity: lead.Status === s.id ? 1 : 0.4,
                borderLeft: `3px solid ${s.color}`
              }}>
                <span>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: lead.Status === s.id ? s.color : 'var(--text2)' }}>{s.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.desc}</div>
                </div>
                {lead.Status === s.id && <span style={{ marginLeft: 'auto', color: s.color }}>●</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { background: 'var(--bg)', minHeight: '100vh', padding: '20px 24px' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 },
  spinner: { width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backBtn: {
    padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)'
  },
  headerRight: { display: 'flex', gap: 10 },
  callBtn: {
    padding: '8px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.15)', color: '#818cf8',
    textDecoration: 'none', fontSize: 13, fontWeight: 700, border: '1px solid rgba(99,102,241,0.3)'
  },
  waBtn: {
    padding: '8px 16px', borderRadius: 10, background: 'rgba(37,211,102,0.15)', color: '#4ade80',
    textDecoration: 'none', fontSize: 13, fontWeight: 700, border: '1px solid rgba(37,211,102,0.3)'
  },
  layout: { display: 'flex', gap: 20, alignItems: 'flex-start' },
  leftCol: { flex: 1, minWidth: 0 },
  rightCol: { width: 260, flexShrink: 0 },

  idCard: {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
    padding: '20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16
  },
  idAvatar: {
    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 800, color: '#fff'
  },
  idName: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 },
  idPhone: { color: 'var(--text2)', fontSize: 14 },
  idEmail: { color: 'var(--text3)', fontSize: 12 },

  tabs: { display: 'flex', gap: 6, marginBottom: 16 },
  tab: { padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },

  infoGrid: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 2
  },
  infoRow: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' },
  infoIcon: { fontSize: 18, flexShrink: 0, width: 24 },
  infoLabel: { fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, color: 'var(--text)', fontWeight: 600, marginTop: 2 },
  reqBox: { padding: '12px 0', borderBottom: '1px solid var(--border)' },
  reqLabel: { fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 },
  reqText: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, background: 'var(--surface2)', padding: '10px 12px', borderRadius: 10 },
  mapLink: {
    display: 'block', padding: '10px', borderRadius: 10, textAlign: 'center', marginTop: 8,
    background: 'rgba(99,102,241,0.1)', color: '#818cf8', textDecoration: 'none',
    fontSize: 13, fontWeight: 700, border: '1px solid rgba(99,102,241,0.2)'
  },

  stageRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  stageBtn: {
    padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s'
  },
  remarkInput: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '12px 14px', color: 'var(--text)', fontSize: 14,
    outline: 'none', fontFamily: 'var(--font-body)', resize: 'vertical', marginBottom: 10
  },
  saveBtn: {
    width: '100%', padding: '12px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)'
  },
  timelineWrap: { marginTop: 24 },
  timelineTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text2)', marginBottom: 14 },
  timelineItem: { display: 'flex', gap: 14, marginBottom: 14, position: 'relative' },
  tlDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  tlContent: { flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' },
  tlHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tlStage: { fontSize: 12, fontWeight: 700 },
  tlDate: { fontSize: 11, color: 'var(--text3)' },
  tlRemark: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 },

  tmplCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '14px', marginBottom: 14
  },
  tmplHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  tmplLabel: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  tmplMsg: {
    fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text2)',
    background: 'var(--surface2)', borderRadius: 10, padding: '10px 12px',
    whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: 10
  },
  tmplSendBtn: {
    display: 'inline-block', padding: '8px 14px', borderRadius: 10,
    background: 'rgba(37,211,102,0.15)', color: '#4ade80',
    textDecoration: 'none', fontSize: 13, fontWeight: 700,
    border: '1px solid rgba(37,211,102,0.3)'
  },

  quickCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '16px', marginBottom: 14
  },
  quickTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  qBtn: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px',
    borderRadius: 10, background: 'var(--surface2)', marginBottom: 8,
    textDecoration: 'none', border: '1px solid var(--border)', transition: 'all 0.15s'
  },
  qBtnWA: { background: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.2)' },
  qBtnMap: { background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' },
  qIcon: { fontSize: 20 },
  qLabel: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  qSub: { fontSize: 11, color: 'var(--text3)' },

  pipelineVisual: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '16px'
  },
  pvItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
    borderRadius: 8, marginBottom: 4, transition: 'opacity 0.2s'
  }
}
