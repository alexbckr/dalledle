import { prisma } from '../../../lib/prisma.js';

// PUT /api/increment_solves
export default async function handle(req, res) {
  const date = req.body.date;

  const stat = await prisma.stat.update({
    where: { date: date },
    data: {
        solves: {increment: 1}
    },
  });
  res.json(stat);
}