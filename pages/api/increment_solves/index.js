// PUT /api/increment_solves
export default async function handle(req, res) {
  res.status(200).json({ ok: true, readOnly: true })
}
