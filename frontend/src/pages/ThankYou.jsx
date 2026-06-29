import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ThankYou() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const type = params.get('type') || 'buy';
  const isSell = type === 'sell';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '56px 40px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{isSell ? '🏷️' : '✅'}</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          {isSell ? 'Listing Submitted!' : 'Requirement Received!'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          {isSell
            ? 'Your property listing has been submitted successfully. Our team will review it, enhance your photos, and publish it within 24 hours. We\'ll contact you once it\'s live.'
            : 'Your property requirement has been recorded. Our team will match you with the best properties and reach out within 24 hours with options.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => nav('/listings')}>Browse All Listings</button>
          <button className="btn-outline" onClick={() => nav('/')}>Back to Home</button>
        </div>
        <div style={{ marginTop: 28, padding: '14px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--accent2)', fontWeight: 600, marginBottom: 4 }}>📱 Need immediate help?</div>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--muted)' }}>
            WhatsApp us at +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}
