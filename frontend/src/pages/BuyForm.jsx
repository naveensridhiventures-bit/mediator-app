import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CHENNAI_AREAS = [
  'Anna Nagar', 'Adyar', 'Velachery', 'T. Nagar', 'Porur', 'Tambaram',
  'Chromepet', 'Perambur', 'Sholinganallur', 'Pallavaram', 'Madipakkam',
  'Kodambakkam', 'Nungambakkam', 'Guindy', 'Mylapore', 'Mogappair',
  'Ambattur', 'Avadi', 'Thiruvottiyur', 'Perungudi', 'OMR', 'ECR',
  'Besant Nagar', 'Kilpauk', 'Egmore', 'Royapettah', 'Thoraipakkam',
  'Medavakkam', 'Selaiyur', 'Pallikaranai', 'Poonamallee', 'Sriperumbudur'
];

const PROPERTY_TYPES = [
  { id: 'house', icon: '🏠', label: 'House', desc: 'Independent home' },
  { id: 'apartment', icon: '🏢', label: 'Apartment', desc: 'Flat / Condo' },
  { id: 'gym', icon: '🏋️', label: 'Gym', desc: 'Fitness center space' },
  { id: 'salon', icon: '💈', label: 'Salon', desc: 'Beauty & parlour' },
  { id: 'hotel', icon: '🏨', label: 'Hotel / PG', desc: 'Hotel or PG rooms' },
  { id: 'shop', icon: '🏪', label: 'Shop', desc: 'Retail / office' },
  { id: 'plot', icon: '🌿', label: 'Plot / Land', desc: 'Open land or site' },
  { id: 'warehouse', icon: '🏭', label: 'Warehouse', desc: 'Storage / godown' },
];

const STEPS = ['Property', 'Details', 'Location', 'Contact'];

export default function BuyForm() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    propertyType: '', purposeType: 'buy',
    minBudget: '', maxBudget: '', minSize: '', maxSize: '', bedrooms: '',
    areas: [], flexibility: 'specific',
    name: '', phone: '', whatsapp: '', email: '', notes: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleArea = (area) => {
    set('areas', form.areas.includes(area)
      ? form.areas.filter(a => a !== area)
      : [...form.areas, area]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'buyer', ...form }),
      });
    } catch (_) {}
    setLoading(false);
    nav('/thank-you?type=buy');
  };

  const canNext = [
    form.propertyType !== '',
    (form.maxBudget !== ''),
    form.areas.length > 0,
    form.name && form.phone,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18, color: 'var(--accent2)' }}>MidiDater</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Find Your Perfect Property Match</div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14,
                  background: i === step ? 'var(--accent2)' : i < step ? 'var(--green)' : 'var(--bg3)',
                  color: i <= step ? 'white' : 'var(--muted)',
                  border: i === step ? '2px solid var(--accent2)' : '2px solid var(--border)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 11, color: i === step ? 'var(--accent2)' : 'var(--muted)', marginTop: 4, fontWeight: i === step ? 600 : 400 }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--green)' : 'var(--border)', margin: '0 8px', marginBottom: 18 }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Property Type */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>What are you looking for?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Select the type of property you need</p>

            <div style={{ marginBottom: 20 }}>
              <label>Buy or Rent?</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                {['buy', 'rent'].map(t => (
                  <button key={t} onClick={() => set('purposeType', t)}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, border: `2px solid ${form.purposeType === t ? 'var(--accent2)' : 'var(--border)'}`, background: form.purposeType === t ? 'rgba(6,182,212,0.1)' : 'var(--bg3)', color: 'var(--text)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize' }}>
                    {t === 'buy' ? '🛒 Buy' : '🔑 Rent'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {PROPERTY_TYPES.map(pt => (
                <div key={pt.id} onClick={() => set('propertyType', pt.id)}
                  style={{ padding: '16px', borderRadius: 10, border: `2px solid ${form.propertyType === pt.id ? 'var(--accent2)' : 'var(--border)'}`, background: form.propertyType === pt.id ? 'rgba(6,182,212,0.08)' : 'var(--bg2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{pt.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{pt.label}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{pt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Budget & Size */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Budget & Size</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Tell us your budget and space requirements</p>

            <div className="form-group">
              <label>Budget Range</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <input type="number" placeholder="Min (₹ Lakhs)" value={form.minBudget} onChange={e => set('minBudget', e.target.value)} />
                </div>
                <div>
                  <input type="number" placeholder="Max (₹ Lakhs)" value={form.maxBudget} onChange={e => set('maxBudget', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Size Preference (sq ft)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input type="number" placeholder="Min sqft" value={form.minSize} onChange={e => set('minSize', e.target.value)} />
                <input type="number" placeholder="Max sqft" value={form.maxSize} onChange={e => set('maxSize', e.target.value)} />
              </div>
            </div>

            {['house', 'apartment'].includes(form.propertyType) && (
              <div className="form-group">
                <label>Bedrooms Required</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(b => (
                    <button key={b} onClick={() => set('bedrooms', b)}
                      style={{ flex: 1, padding: '10px 8px', borderRadius: 8, border: `2px solid ${form.bedrooms === b ? 'var(--accent)' : 'var(--border)'}`, background: form.bedrooms === b ? 'rgba(124,58,237,0.1)' : 'var(--bg3)', color: 'var(--text)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea rows={3} placeholder="Any specific requirements, amenities needed, etc." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Preferred Locations</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Select all areas you're open to</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <span className="badge badge-blue">{form.areas.length} selected</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CHENNAI_AREAS.map(area => (
                <button key={area} onClick={() => toggleArea(area)}
                  style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${form.areas.includes(area) ? 'var(--accent2)' : 'var(--border)'}`, background: form.areas.includes(area) ? 'rgba(6,182,212,0.12)' : 'var(--bg2)', color: form.areas.includes(area) ? 'var(--accent2)' : 'var(--text)', fontSize: 13, fontWeight: form.areas.includes(area) ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {form.areas.includes(area) ? '✓ ' : ''}{area}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Your Contact Details</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>We'll reach out with matching properties</p>

            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input type="tel" placeholder="If different from phone" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10, padding: 16, marginTop: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--accent2)', fontWeight: 600, marginBottom: 4 }}>🔒 Privacy Promise</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                Your details are shared only with our verified mediators. We never sell your information.
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button className="btn-outline" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← Back</button>
          )}
          {step < 3 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}
              style={{ flex: 2, opacity: canNext[step] ? 1 : 0.5 }}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !canNext[3]}
              style={{ flex: 2, opacity: canNext[3] ? 1 : 0.5 }}>
              {loading ? 'Submitting...' : '✅ Submit Requirement'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
