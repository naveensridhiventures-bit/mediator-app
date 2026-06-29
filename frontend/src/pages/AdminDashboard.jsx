import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_SELLERS = [
  { id: 1, ownerName: 'Rajesh Kumar', phone: '9876543210', whatsapp: '9876543210', email: 'rajesh@gmail.com', propertyType: 'Apartment', locality: 'Anna Nagar', exactAddress: '12A, 3rd Main Rd, Anna Nagar West', price: '₹85 Lakhs', area: '1400', beds: '3 BHK', listingType: 'sale', status: 'active', photos: 3, createdAt: '2025-06-20', availability: 'Evening' },
  { id: 2, ownerName: 'Priya Suresh', phone: '9988776655', whatsapp: '9988776655', email: 'priya.s@yahoo.com', propertyType: 'House', locality: 'Velachery', exactAddress: '45, Lake View Street, Velachery', price: '₹1.2 Cr', area: '2100', beds: '4 BHK', listingType: 'sale', status: 'pending', photos: 5, createdAt: '2025-06-22', availability: 'Morning' },
  { id: 3, ownerName: 'Mohan Venkat', phone: '9123456789', whatsapp: null, email: null, propertyType: 'Shop', locality: 'T. Nagar', exactAddress: '78, Pondy Bazaar, T. Nagar', price: '₹45,000/mo', area: '600', beds: null, listingType: 'rent', status: 'active', photos: 2, createdAt: '2025-06-25', availability: 'Anytime' },
];

const MOCK_BUYERS = [
  { id: 1, name: 'Anand Krishnan', phone: '9871234567', whatsapp: '9871234567', email: 'anand@gmail.com', propertyType: 'Apartment', purposeType: 'buy', maxBudget: '90', bedrooms: '3 BHK', areas: ['Anna Nagar', 'Mogappair'], status: 'new', createdAt: '2025-06-28' },
  { id: 2, name: 'Meena Ravi', phone: '9900112233', whatsapp: '9900112233', email: 'meena.ravi@gmail.com', propertyType: 'House', purposeType: 'buy', maxBudget: '150', bedrooms: '4 BHK', areas: ['Adyar', 'Besant Nagar'], status: 'contacted', createdAt: '2025-06-27' },
  { id: 3, name: 'Suresh Babu', phone: '9765432100', whatsapp: null, email: null, propertyType: 'Shop', purposeType: 'rent', maxBudget: '50', bedrooms: null, areas: ['T. Nagar', 'Nungambakkam'], status: 'matched', createdAt: '2025-06-25' },
];

const STATUS_COLORS = { active: 'badge-green', pending: 'badge-gold', sold: 'badge-red', new: 'badge-blue', contacted: 'badge-gold', matched: 'badge-green', closed: 'badge-red' };

const ADMIN_PIN = '1234';

export default function AdminDashboard() {
  const nav = useNavigate();
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [pinError, setPinError] = useState('');
  const [tab, setTab] = useState('overview');
  const [sellers, setSellers] = useState(MOCK_SELLERS);
  const [buyers, setBuyers] = useState(MOCK_BUYERS);
  const [expandSeller, setExpandSeller] = useState(null);
  const [expandBuyer, setExpandBuyer] = useState(null);

  const handlePin = () => {
    if (pin === ADMIN_PIN) { setAuth(true); setPinError(''); }
    else { setPinError('Incorrect PIN. Try again.'); setPin(''); }
  };

  const updateSellerStatus = (id, status) => setSellers(s => s.map(x => x.id === id ? { ...x, status } : x));
  const updateBuyerStatus = (id, status) => setBuyers(b => b.map(x => x.id === id ? { ...x, status } : x));

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px 40px', maxWidth: 360, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Admin Access</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Enter your PIN to access the dashboard</p>
          <input type="password" placeholder="Enter PIN" maxLength={4} value={pin} onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePin()}
            style={{ textAlign: 'center', fontSize: 24, letterSpacing: 12, marginBottom: 16, padding: '14px' }} />
          {pinError && <div style={{ color: '#f85149', fontSize: 13, marginBottom: 12 }}>{pinError}</div>}
          <button className="btn-primary" onClick={handlePin} style={{ width: '100%', padding: '14px' }}>Unlock Dashboard</button>
          <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, marginTop: 16, cursor: 'pointer' }}>← Back to Home</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'sellers', label: `🏷️ Listings (${sellers.length})` },
    { id: 'buyers', label: `🔍 Buyers (${buyers.length})` },
    { id: 'images', label: '📸 Image Manager' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer' }}>←</button>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18, color: 'var(--accent2)' }}>MidiDater Admin</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Property Management Dashboard</div>
          </div>
        </div>
        <button onClick={() => setAuth(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🔒 Lock</button>
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '14px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--accent2)' : 'transparent'}`, color: tab === t.id ? 'var(--accent2)' : 'var(--muted)', fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', fontSize: 14, transition: 'color 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                ['🏷️', 'Total Listings', sellers.length, 'badge-green'],
                ['✅', 'Active', sellers.filter(s => s.status === 'active').length, 'badge-green'],
                ['⏳', 'Pending', sellers.filter(s => s.status === 'pending').length, 'badge-gold'],
                ['🔍', 'Total Buyers', buyers.length, 'badge-blue'],
                ['🤝', 'Matched', buyers.filter(b => b.status === 'matched').length, 'badge-green'],
              ].map(([icon, label, val, badge]) => (
                <div key={label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--accent2)' }}>{val}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Recent Sellers</h3>
                {sellers.map(s => (
                  <div key={s.id} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.ownerName}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{s.propertyType} · {s.locality}</div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Recent Buyers</h3>
                {buyers.map(b => (
                  <div key={b.id} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{b.propertyType} · {b.areas[0]}</div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SELLERS TAB */}
        {tab === 'sellers' && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Seller Listings</h2>
            {sellers.map(s => (
              <div key={s.id} className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setExpandSeller(expandSeller === s.id ? null : s.id)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{s.propertyType}</span>
                      <span className="badge badge-blue">{s.listingType === 'sale' ? 'For Sale' : 'For Rent'}</span>
                      <span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>📍 {s.locality} · {s.price} · {s.area} sqft{s.beds ? ` · ${s.beds}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <select value={s.status} onChange={e => { e.stopPropagation(); updateSellerStatus(s.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}>
                      {['active', 'pending', 'sold'].map(st => <option key={st}>{st}</option>)}
                    </select>
                    <span style={{ color: 'var(--muted)', fontSize: 18 }}>{expandSeller === s.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandSeller === s.id && (
                  <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    {/* Private Info */}
                    <div style={{ background: 'rgba(218,54,51,0.08)', border: '1px solid rgba(218,54,51,0.2)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                      <div style={{ fontSize: 13, color: '#f85149', fontWeight: 700, marginBottom: 8 }}>🔒 PRIVATE — Owner Contact (Never Shown Publicly)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                        <div><span style={{ color: 'var(--muted)' }}>Owner:</span> <strong>{s.ownerName}</strong></div>
                        <div><span style={{ color: 'var(--muted)' }}>Available:</span> <strong>{s.availability}</strong></div>
                        <div><span style={{ color: 'var(--muted)' }}>Phone:</span> <a href={`tel:${s.phone}`} style={{ color: 'var(--accent2)', fontWeight: 600 }}>📞 {s.phone}</a></div>
                        <div><span style={{ color: 'var(--muted)' }}>Email:</span> {s.email || '—'}</div>
                        <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--muted)' }}>WhatsApp:</span> {s.whatsapp ? <a href={`https://wa.me/91${s.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>💬 {s.whatsapp}</a> : '—'}</div>
                        <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--muted)' }}>Exact Address:</span> <strong>{s.exactAddress}</strong></div>
                      </div>
                    </div>

                    {/* Public Info */}
                    <div style={{ background: 'rgba(35,134,54,0.08)', border: '1px solid rgba(35,134,54,0.2)', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 13, color: '#3fb950', fontWeight: 700, marginBottom: 8 }}>✅ PUBLIC — What Buyers See</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {s.propertyType} in <strong style={{ color: 'var(--text)' }}>{s.locality}</strong> · {s.price} · {s.area} sqft{s.beds ? ` · ${s.beds}` : ''} · {s.photos} photos · Contact via MidiDater WhatsApp only
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <a href={`https://wa.me/91${s.whatsapp || s.phone}`} target="_blank" rel="noreferrer"
                        style={{ flex: 1, display: 'block', background: '#25D366', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                        WhatsApp Owner
                      </a>
                      <a href={`tel:${s.phone}`}
                        style={{ flex: 1, display: 'block', background: 'var(--bg3)', color: 'var(--text)', textAlign: 'center', padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', border: '1px solid var(--border)' }}>
                        📞 Call Owner
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* BUYERS TAB */}
        {tab === 'buyers' && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Buyer Inquiries</h2>
            {buyers.map(b => (
              <div key={b.id} className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setExpandBuyer(expandBuyer === b.id ? null : b.id)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</span>
                      <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                      Looking for: {b.propertyType} · {b.purposeType === 'buy' ? 'Purchase' : 'Rent'} · Budget: ₹{b.maxBudget}L · {b.areas.join(', ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <select value={b.status} onChange={e => { e.stopPropagation(); updateBuyerStatus(b.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}>
                      {['new', 'contacted', 'matched', 'closed'].map(st => <option key={st}>{st}</option>)}
                    </select>
                    <span style={{ color: 'var(--muted)', fontSize: 18 }}>{expandBuyer === b.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandBuyer === b.id && (
                  <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                      <div style={{ fontSize: 13, color: 'var(--accent2)', fontWeight: 700, marginBottom: 8 }}>📋 Buyer Details</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                        <div><span style={{ color: 'var(--muted)' }}>Phone:</span> <a href={`tel:${b.phone}`} style={{ color: 'var(--accent2)', fontWeight: 600 }}>📞 {b.phone}</a></div>
                        <div><span style={{ color: 'var(--muted)' }}>Email:</span> {b.email || '—'}</div>
                        <div><span style={{ color: 'var(--muted)' }}>Property:</span> <strong>{b.propertyType}</strong></div>
                        <div><span style={{ color: 'var(--muted)' }}>Max Budget:</span> <strong>₹{b.maxBudget} Lakhs</strong></div>
                        {b.bedrooms && <div><span style={{ color: 'var(--muted)' }}>Bedrooms:</span> <strong>{b.bedrooms}</strong></div>}
                        <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--muted)' }}>Areas:</span> <strong>{b.areas.join(', ')}</strong></div>
                        <div><span style={{ color: 'var(--muted)' }}>Submitted:</span> {b.createdAt}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <a href={`https://wa.me/91${b.whatsapp || b.phone}`} target="_blank" rel="noreferrer"
                        style={{ flex: 1, display: 'block', background: '#25D366', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                        WhatsApp Buyer
                      </a>
                      <a href={`tel:${b.phone}`}
                        style={{ flex: 1, display: 'block', background: 'var(--bg3)', color: 'var(--text)', textAlign: 'center', padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', border: '1px solid var(--border)' }}>
                        📞 Call Buyer
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* IMAGE MANAGER TAB */}
        {tab === 'images' && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Image Manager</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Manage photos for each listing. Add enhancement notes for our team.</p>
            {sellers.map(s => (
              <div key={s.id} className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{s.propertyType}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}> · {s.locality} · {s.ownerName}</span>
                  </div>
                  <span className="badge badge-blue">{s.photos} photos</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
                  {Array.from({ length: s.photos }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '4/3', background: 'var(--bg3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '1px solid var(--border)' }}>
                      📷
                    </div>
                  ))}
                  <div style={{ aspectRatio: '4/3', background: 'var(--bg3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '2px dashed var(--border)', cursor: 'pointer', color: 'var(--muted)' }}>
                    +
                  </div>
                </div>
                <textarea rows={2} placeholder="Enhancement notes, e.g. 'Brighten kitchen photo, remove clutter from bedroom'" style={{ width: '100%', fontSize: 13 }} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
