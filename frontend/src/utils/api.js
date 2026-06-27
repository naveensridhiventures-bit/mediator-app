const BASE = import.meta.env.VITE_API_URL || '/api'

export async function submitLead(data) {
  const res = await fetch(`${BASE}/leads/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getLeads(authHeader) {
  const res = await fetch(`${BASE}/admin/leads`, {
    headers: { Authorization: authHeader }
  })
  if (!res.ok) throw new Error('Auth failed')
  return res.json()
}

export async function getLead(id, authHeader) {
  const res = await fetch(`${BASE}/admin/leads/${id}`, {
    headers: { Authorization: authHeader }
  })
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export async function addPipelineEntry(leadId, data, authHeader) {
  const res = await fetch(`${BASE}/admin/leads/${leadId}/pipeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function getStats(authHeader) {
  const res = await fetch(`${BASE}/admin/stats`, {
    headers: { Authorization: authHeader }
  })
  return res.json()
}
