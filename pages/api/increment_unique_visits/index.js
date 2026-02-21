// PUT /api/increment_unique_visits
export default async function handle(req, res) {
  res.status(200).json({ ok: true, readOnly: true })
}
