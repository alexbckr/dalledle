import { prisma } from "../../../lib/prisma.js"

// PUT /api/increment_solves
export default async function handle(req, res) {
   const date = req.body.date

   const stat = await prisma.image.update({
      where: { date: date },
      data: {
         solves: { increment: 1 },
      },
   })

   const total_solves = await prisma.stat_book.update({
      where: { id: "stat_book" },
      data: {
         total_solves: { increment: 1 },
      },
   })
   res.json(stat)
}
