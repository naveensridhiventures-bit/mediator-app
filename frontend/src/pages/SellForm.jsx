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
  { id: 'house', icon: '🏠', label: 'House' },
  { id: 'apartment', icon: '🏢', label: 'Apartment' },
  { id: 'gym', icon: '🏋️', label: 'Gym' },
  { id: 'salon', icon: '💈', label: 'Salon' },
  { id: 'hotel', icon: '🏨', label: 'Hotel / PG' },
  { id: 'shop', icon: '🏪', label: 'Shop' },
  { id: 'plot', icon: '🌿', label: 'Plot / Land' },
  { id: 'warehouse', icon: '🏭', label: 'Warehouse' },
];

const AMENITIES = ['Car Parking', 'Lift', 'Security', 'Power Backup', 'Garden', 'Swimming Pool', 'Gym', 'CCTV', 'Water 24/7', 'Covered Parking'];

const STEPS = ['Property Type', 'Details', 'Photos', 'Contact'];

export default function SellForm() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    propertyType: '', listingType: 'sale',
    price: '', area: '', bedrooms: '', floor: '', totalFloors: '', facing: '',
    exactAddress: '', locality: '', description: '', amenities: [],
    photos: [], photoNote: '',
    ownerName: '', phone: '', whatsapp: '', email: '', availability: 'anytime',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleAmenity = a => set('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
    set('photos', [...form.photos, ...previews].slice(0, 10));
  };

  const removePhoto = (i) => set('photos', form.photos.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'photos') v.forEach(p => fd.append('photos', p.file));
        else if (Array.isArray(v)) fd.append(k, v.join(','));
        else fd.append(k, v);
      });
      fd.append('type', 'seller');
      await fetch('/api/leads/submit', { method: 'POST', body: fd });
    } catch (_) {}
    setLoading(false);
    nav('/thank-you?type=sell');
  };

  const canNext = [
    form.propertyType !== '',
    form.price !== '' && form.area !== '' && form.locality !== '',
    true,
    form.ownerName && form.phone,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18, color: '#a78bfa' }}>MidiDater</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>List Your Property</div>
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
                  background: i === step ? 'var(--accent)' : i < step ? 'var(--green)' : 'var(--bg3)',
                  color: i <= step ? 'white' : 'var(--muted)',
                  border: i === step ? '2px solid var(--accent)' : '2px solid var(--border)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 11, color: i === step ? '#a78bfa' : 'var(--muted)', marginTop: 4, fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--green)' : 'var(--border)', margin: '0 6px', marginBottom: 18 }} />}
            </div>
          ))}
        </div>

        {/* Step 0: Property Type */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>What are you selling?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Select the property type</p>

            <div style={{ marginBottom: 20 }}>
              <label>Sale or Rent?</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                {['sale', 'rent'].map(t => (
                  <button key={t} onClick={() => set('listingType', t)}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, border: `2px solid ${form.listingType === t ? 'var(--accent)' : 'var(--border)'}`, background: form.listingType === t ? 'rgba(124,58,237,0.1)' : 'var(--bg3)', color: 'var(--text)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize' }}>
                    {t === 'sale' ? '💰 For Sale' : '🔑 For Rent'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {PROPERTY_TYPES.map(pt => (
                <div key={pt.id} onClick={() => set('propertyType', pt.id)}
                  style={{ padding: '16px', borderRadius: 10, border: `2px solid ${form.propertyType === pt.id ? 'var(--accent)' : 'var(--border)'}`, background: form.propertyType === pt.id ? 'rgba(124,58,237,0.08)' : 'var(--bg2)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{pt.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{pt.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Property Details */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Property Details</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Tell buyers about your property</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Asking Price *</label>
                <input type="text" placeholder={form.listingType === 'sale' ? "e.g. 85 Lakhs" : "e.g. 20,000/month"} value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Built-up Area (sqft) *</label>
                <input type="number" placeholder="e.g. 1200" value={form.area} onChange={e => set('area', e.target.value)} />
              </div>
            </div>

            {['house', 'apartment'].includes(form.propertyType) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Bedrooms</label>
                  <select value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
                    <option value="">Select</option>
                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Floor</label>
                  <input type="text" placeholder="e.g. 3" value={form.floor} onChange={e => set('floor', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Facing</label>
                  <select value={form.facing} onChange={e => set('facing', e.target.value)}>
                    <option value="">Select</option>
                    {['East', 'West', 'North', 'South', 'NE', 'NW', 'SE', 'SW'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Area / Locality *</label>
              <select value={form.locality} onChange={e => set('locality', e.target.value)}>
                <option value="">Select area in Chennai</option>
                {CHENNAI_AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Exact Address <span style={{ color: 'var(--accent)', fontSize: 11 }}>(🔒 Private — never shown publicly)</span></label>
              <textarea rows={2} placeholder="Full address with door number, street name" value={form.exactAddress} onChange={e => set('exactAddress', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} placeholder="Describe your property — age, condition, highlights..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {AMENITIES.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${form.amenities.includes(a) ? 'var(--accent)' : 'var(--border)'}`, background: form.amenities.includes(a) ? 'rgba(124,58,237,0.12)' : 'var(--bg2)', color: form.amenities.includes(a) ? '#a78bfa' : 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                    {form.amenities.includes(a) ? '✓ ' : ''}{a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Property Photos</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Upload up to 10 photos. We'll enhance them for best presentation.</p>

            <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '32px', textAlign: 'center', marginBottom: 20, cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onClick={() => document.getElementById('photoInput').click()}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Click to upload photos</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>JPG, PNG up to 10MB each · Max 10 photos</div>
              <input id="photoInput" type="file" accept="image/*" multiple onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>

            {form.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                {form.photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removePhoto(i)}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-group">
              <label>Notes for our team (optional)</label>
              <textarea rows={2} placeholder="e.g. Main gate photo pending, will send tomorrow" value={form.photoNote} onChange={e => set('photoNote', e.target.value)} />
            </div>

            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>✨ Photo Enhancement</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                Our team reviews every uploaded photo and optimizes brightness, contrast, and framing before publishing your listing. Better photos = faster sale.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Owner Contact Details</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Only shared with our mediators — never published publicly</p>

            <div className="form-group">
              <label>Owner Name *</label>
              <input type="text" placeholder="Your full name" value={form.ownerName} onChange={e => set('ownerName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" placeholder="10-digit mobile" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input type="tel" placeholder="If different from phone" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Best time to reach you</label>
              <select value={form.availability} onChange={e => set('availability', e.target.value)}>
                <option value="anytime">Anytime</option>
                <option value="morning">Morning (9am – 12pm)</option>
                <option value="afternoon">Afternoon (12pm – 4pm)</option>
                <option value="evening">Evening (4pm – 8pm)</option>
                <option value="weekend">Weekends only</option>
              </select>
            </div>

            <div style={{ background: 'rgba(35,134,54,0.08)', border: '1px solid rgba(35,134,54,0.2)', borderRadius: 10, padding: 16, marginTop: 8 }}>
              <div style={{ fontSize: 13, color: '#3fb950', fontWeight: 600, marginBottom: 4 }}>🔒 100% Private</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                Your phone, email, and exact address are NEVER shown on our public listings. Only our verified mediators can see this information.
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
              style={{ flex: 2, opacity: canNext[step] ? 1 : 0.5, background: 'var(--accent)' }}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !canNext[3]}
              style={{ flex: 2, opacity: canNext[3] ? 1 : 0.5, background: 'var(--accent)' }}>
              {loading ? 'Submitting...' : '🏷️ Submit Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
