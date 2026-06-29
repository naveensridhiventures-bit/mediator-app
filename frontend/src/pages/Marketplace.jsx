import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_LISTINGS = [
  { id: 1, type: 'Apartment', area: 'Anna Nagar', price: '₹85 Lakhs', beds: '3 BHK', sqft: 1400, facing: 'East', floor: '3rd / 8', tag: 'For Sale', amenities: ['Lift', 'Parking', 'Security'], icon: '🏢', age: '5 yrs' },
  { id: 2, type: 'House', area: 'Velachery', price: '₹1.2 Cr', beds: '4 BHK', sqft: 2100, facing: 'North', floor: 'G+2', tag: 'For Sale', amenities: ['Car Parking', 'Garden', 'Bore Well'], icon: '🏠', age: '10 yrs' },
  { id: 3, type: 'Shop', area: 'T. Nagar', price: '₹45,000/mo', beds: null, sqft: 600, facing: 'South', floor: 'Ground', tag: 'For Rent', amenities: ['CCTV', 'Power Backup'], icon: '🏪', age: '2 yrs' },
  { id: 4, type: 'Apartment', area: 'Adyar', price: '₹72 Lakhs', beds: '2 BHK', sqft: 1050, facing: 'NE', floor: '5th / 10', tag: 'For Sale', amenities: ['Lift', 'Swimming Pool', 'Gym'], icon: '🏢', age: '3 yrs' },
  { id: 5, type: 'Plot', area: 'OMR', price: '₹55 Lakhs', beds: null, sqft: 2400, facing: 'East', floor: null, tag: 'For Sale', amenities: ['Corner Plot', 'DTCP Approved'], icon: '🌿', age: null },
  { id: 6, type: 'Warehouse', area: 'Ambattur', price: '₹80,000/mo', beds: null, sqft: 5000, facing: null, floor: 'G', tag: 'For Rent', amenities: ['Loading Dock', 'Power Backup', 'CCTV'], icon: '🏭', age: '8 yrs' },
];

const WA_NUMBER = '919876543210'; // replace with real WhatsApp number

export default function Marketplace() {
  const nav = useNavigate();
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = MOCK_LISTINGS.filter(l => {
    const matchTag = filter === 'All' || l.tag === filter;
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    const matchSearch = search === '' || l.area.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchType && matchSearch;
  });

  const types = ['All', ...new Set(MOCK_LISTINGS.map(l => l.type))];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18, color: 'var(--accent2)' }}>MidiDater</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Browse All Listings</div>
        </div>
        <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => nav('/sell')}>+ List Property</button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Search & Filters */}
        <div style={{ marginBottom: 24 }}>
          <input type="text" placeholder="🔍  Search by area or type..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: '12px 16px', fontSize: 15 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'For Sale', 'For Rent'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '7px 18px', borderRadius: 20, border: `1.5px solid ${filter === f ? 'var(--accent2)' : 'var(--border)'}`, background: filter === f ? 'rgba(6,182,212,0.12)' : 'var(--bg2)', color: filter === f ? 'var(--accent2)' : 'var(--text)', fontSize: 13, fontWeight: filter === f ? 600 : 400, cursor: 'pointer' }}>
                {f}
              </button>
            ))}
            <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ padding: '7px 18px', borderRadius: 20, border: `1.5px solid ${typeFilter === t ? 'var(--accent)' : 'var(--border)'}`, background: typeFilter === t ? 'rgba(124,58,237,0.12)' : 'var(--bg2)', color: typeFilter === t ? '#a78bfa' : 'var(--text)', fontSize: 13, fontWeight: typeFilter === t ? 600 : 400, cursor: 'pointer' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>{filtered.length} properties found</div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(l => (
            <div key={l.id} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
              onClick={() => setSelected(l)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ height: 140, background: 'var(--bg3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, marginBottom: 16, position: 'relative' }}>
                {l.icon}
                <span className={`badge ${l.tag === 'For Sale' ? 'badge-green' : 'badge-blue'}`} style={{ position: 'absolute', top: 10, right: 10 }}>{l.tag}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{l.type}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>📍 {l.area}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent2)' }}>{l.price}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>📐 {l.sqft} sqft</span>
                {l.beds && <span style={{ fontSize: 12, color: 'var(--muted)' }}>🛏 {l.beds}</span>}
                {l.floor && <span style={{ fontSize: 12, color: 'var(--muted)' }}>🏗 {l.floor}</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {l.amenities.slice(0, 3).map(a => (
                  <span key={a} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg3)', borderRadius: 10, color: 'var(--muted)' }}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No listings match your filters</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>Try removing some filters or search differently</div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, maxWidth: 520, width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ height: 180, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, position: 'relative' }}>
              {selected.icon}
              <span className={`badge ${selected.tag === 'For Sale' ? 'badge-green' : 'badge-blue'}`} style={{ position: 'absolute', top: 16, left: 16, fontSize: 13 }}>{selected.tag}</span>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700 }}>{selected.type}</h2>
                  <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>📍 {selected.area} area, Chennai</div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>🔒 Exact address shared after verification</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent2)', textAlign: 'right' }}>{selected.price}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  ['📐', 'Area', `${selected.sqft} sqft`],
                  ...(selected.beds ? [['🛏', 'Bedrooms', selected.beds]] : []),
                  ...(selected.floor ? [['🏗', 'Floor', selected.floor]] : []),
                  ...(selected.facing ? [['🧭', 'Facing', selected.facing]] : []),
                  ...(selected.age ? [['📅', 'Age', selected.age]] : []),
                ].map(([icon, label, val]) => (
                  <div key={label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{icon} {label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>Amenities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selected.amenities.map(a => (
                    <span key={a} className="badge badge-blue">{a}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(35,134,54,0.08)', border: '1px solid rgba(35,134,54,0.2)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#3fb950', fontWeight: 600, marginBottom: 4 }}>Interested in this property?</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Contact MidiDater on WhatsApp. We'll verify and connect you with the owner, share the exact address and arrange a site visit.</div>
              </div>

              <a href={`https://wa.me/${WA_NUMBER}?text=Hi! I'm interested in the ${selected.type} in ${selected.area} listed on MidiDater (${selected.price}).`}
                target="_blank" rel="noreferrer"
                style={{ display: 'block', background: '#25D366', color: 'white', textAlign: 'center', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                📱 Contact MidiDater on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
