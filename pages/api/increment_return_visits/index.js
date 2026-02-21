// PUT /api/increment_return_visits
export default async function handle(req, res) {
  res.status(200).json({ ok: true, readOnly: true })
}
