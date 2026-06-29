import { useNavigate } from 'react-router-dom';

const recentListings = [
  { id: 1, type: 'Apartment', area: 'Anna Nagar', price: '₹85L', beds: 3, sqft: 1400, tag: 'For Sale', img: '🏢' },
  { id: 2, type: 'House', area: 'Velachery', price: '₹1.2Cr', beds: 4, sqft: 2100, tag: 'For Sale', img: '🏠' },
  { id: 3, type: 'Shop', area: 'T. Nagar', price: '₹45K/mo', beds: null, sqft: 600, tag: 'For Rent', img: '🏪' },
];

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🏡</span>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: 'var(--accent2)' }}>MidiDater</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 2 }}>PROPERTY MEDIATION EXPERTS</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-outline" style={{ padding: '8px 20px', fontSize: 14 }} onClick={() => nav('/listings')}>Browse Listings</button>
          <button className="btn-outline" style={{ padding: '8px 20px', fontSize: 14 }} onClick={() => nav('/admin')}>Admin</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 40px 60px', background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '5px 16px', fontSize: 13, color: '#a78bfa', marginBottom: 20 }}>
          Chennai's Most Trusted Property Mediator
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Find, List & Sell<br />
          <span style={{ color: 'var(--accent2)' }}>Properties in Chennai</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 520, margin: '0 auto 50px' }}>
          Whether you're buying your dream home or selling a property — we connect the right people, fast.
        </p>

        {/* CTA Cards */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 700, margin: '0 auto' }}>
          <div
            onClick={() => nav('/buy')}
            style={{ flex: '1 1 280px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 28px', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', textAlign: 'left' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>I Want to Buy</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Tell us what you're looking for — location, budget, type. We'll find the perfect match.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent2)', fontWeight: 600, fontSize: 14 }}>
              Submit Requirement →
            </div>
          </div>

          <div
            onClick={() => nav('/sell')}
            style={{ flex: '1 1 280px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 28px', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', textAlign: 'left' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏷️</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>I Want to Sell</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              List your property with photos. We'll handle marketing and connect serious buyers to you.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#a78bfa', fontWeight: 600, fontSize: 14 }}>
              List My Property →
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        {[['500+', 'Properties Listed'], ['1,200+', 'Happy Clients'], ['50+', 'Areas Covered'], ['98%', 'Success Rate']].map(([num, label], i) => (
          <div key={i} style={{ flex: 1, maxWidth: 200, padding: '28px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent2)' }}>{num}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div style={{ padding: '60px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700 }}>Recent Listings</h2>
          <button className="btn-outline" style={{ padding: '8px 20px', fontSize: 13 }} onClick={() => nav('/listings')}>View All →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
          {recentListings.map(p => (
            <div key={p.id} className="card" style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ height: 120, background: 'var(--bg3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 16 }}>{p.img}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.type} · {p.area}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>{p.sqft} sqft{p.beds ? ` · ${p.beds} BHK` : ''}</div>
                </div>
                <span className={`badge ${p.tag === 'For Sale' ? 'badge-green' : 'badge-blue'}`}>{p.tag}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent2)', marginTop: 10 }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Why Choose MidiDater?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {[
            ['🔒', 'Privacy Protected', 'Your contact & address are never shown publicly — only shared with verified buyers.'],
            ['📸', 'Photo Marketing', 'We enhance your property photos for maximum buyer attraction.'],
            ['⚡', 'Fast Matching', 'Our network connects buyers and sellers within 48 hours on average.'],
            ['🤝', 'Local Experts', 'Deep knowledge of all Chennai areas — from Anna Nagar to Tambaram.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ padding: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: 13 }}>
        © 2025 MidiDater Property Mediation · Chennai, Tamil Nadu
      </div>
    </div>
  );
}
