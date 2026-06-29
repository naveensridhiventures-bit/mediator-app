import { useState, useEffect, useRef } from 'react'

const DEFAULT_CENTER = [12.9716, 77.5946] // Bengaluru default

export default function MapPicker({ onSelect }) {
  const [MapComponents, setMapComponents] = useState(null)
  const [position, setPosition] = useState(DEFAULT_CENTER)
  const [pinned, setPinned] = useState(null)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState('')
  const mapRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    // Lazy load react-leaflet to avoid SSR issues
    import('react-leaflet').then(rl => {
      import('leaflet').then(L => {
        // Fix default icon
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })
        setMapComponents({ ...rl, L })
      })
    })
  }, [])

  function placeMarker(lat, lng, { recenter = true } = {}) {
    setPinned([lat, lng])
    if (recenter) setPosition([lat, lng])
    onSelect(lat, lng)
    if (recenter && mapRef.current) {
      mapRef.current.setView([lat, lng], 15)
    }
  }

  // --- Address search (debounced, OpenStreetMap Nominatim — no API key needed) ---
  function handleQueryChange(value) {
    setQuery(value)
    setLocateError('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 3) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(() => searchAddress(value), 450)
  }

  async function searchAddress(value) {
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(value)}`,
        { headers: { Accept: 'application/json' } }
      )
      const data = await res.json()
      setSuggestions(data || [])
    } catch {
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }

  function pickSuggestion(s) {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    placeMarker(lat, lng)
    setQuery(s.display_name)
    setSuggestions([])
  }

  // --- Current location ---
  function useCurrentLocation() {
    setLocateError('')
    if (!navigator.geolocation) {
      setLocateError('Location not supported on this device')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        placeMarker(latitude, longitude)
        setQuery('📍 Current location')
        setSuggestions([])
        setLocating(false)
      },
      () => {
        setLocateError('Could not get your location — check permissions')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  if (!MapComponents) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        Loading map…
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = MapComponents

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        placeMarker(lat, lng, { recenter: false })
        setQuery('')
        setSuggestions([])
      }
    })
    return null
  }

  function MapRefSetter() {
    const map = useMap()
    useEffect(() => { mapRef.current = map }, [map])
    return null
  }

  return (
    <div style={styles.wrap}>
      {/* Address search */}
      <div style={styles.searchRow}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔎</span>
          <input
            style={styles.searchInput}
            placeholder="Search for an address, area, or landmark…"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
          />
          {searching && <div style={styles.miniSpinner} />}
        </div>
        <button
          type="button"
          style={styles.locateBtn}
          onClick={useCurrentLocation}
          disabled={locating}
        >
          {locating ? <div style={styles.miniSpinnerDark} /> : '📍'}
          <span style={styles.locateBtnText}>{locating ? 'Locating…' : 'Use my location'}</span>
        </button>
      </div>

      {suggestions.length > 0 && (
        <div style={styles.suggestions}>
          {suggestions.map((s, i) => (
            <div key={i} style={styles.suggestionItem} onClick={() => pickSuggestion(s)}>
              <span style={{ marginRight: 8 }}>📍</span>
              <span style={styles.suggestionText}>{s.display_name}</span>
            </div>
          ))}
        </div>
      )}

      {locateError && <p style={styles.errorText}>{locateError}</p>}

      <MapContainer
        center={position}
        zoom={pinned ? 15 : 12}
        style={{ height: 220, width: '100%', borderRadius: 12, zIndex: 0 }}
      >
        <MapRefSetter />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler />
        {pinned && <Marker position={pinned} />}
      </MapContainer>
      <p style={styles.hint}>👆 Tap the map, search an address, or use your current location to pin the spot</p>
    </div>
  )
}

const styles = {
  wrap: { marginTop: 4, marginBottom: 4 },
  searchRow: { display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  searchBox: {
    flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '9px 12px'
  },
  searchIcon: { fontSize: 14, opacity: 0.7 },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-body)'
  },
  locateBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
    borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface2)',
    color: 'var(--text2)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-body)', whiteSpace: 'nowrap'
  },
  locateBtnText: { display: 'inline' },
  suggestions: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 10, marginBottom: 8, overflow: 'hidden', maxHeight: 180, overflowY: 'auto'
  },
  suggestionItem: {
    display: 'flex', alignItems: 'flex-start', padding: '9px 12px', fontSize: 12.5,
    cursor: 'pointer', borderBottom: '1px solid var(--border)', color: 'var(--text2)'
  },
  suggestionText: { lineHeight: 1.4 },
  errorText: { fontSize: 12, color: 'var(--red)', marginBottom: 8 },
  loading: {
    height: 220, background: 'var(--surface2)', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, color: 'var(--text2)', fontSize: 14
  },
  spinner: {
    width: 20, height: 20, border: '2px solid var(--border)',
    borderTopColor: 'var(--accent)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  miniSpinner: {
    width: 14, height: 14, border: '2px solid var(--border)',
    borderTopColor: 'var(--accent2)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', flexShrink: 0
  },
  miniSpinnerDark: {
    width: 14, height: 14, border: '2px solid rgba(148,163,184,0.3)',
    borderTopColor: 'var(--text2)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', flexShrink: 0
  },
  hint: { fontSize: 12, color: 'var(--text3)', marginTop: 6, textAlign: 'center' }
}
