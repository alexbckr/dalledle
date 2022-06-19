import { prisma } from "../../../lib/prisma.js"

// PUT /api/increment_unique_visits
export default async function handle(req, res) {
   const date = req.body.date

   const stat = await prisma.image.update({
      where: { date: date },
      data: {
         return_visits: { increment: 1 },
      },
   })

   const total_return_visits = await prisma.stat_book.update({
      where: { id: "stat_book" },
      data: {
         total_return_visits: { increment: 1 },
      },
   })

   res.json(stat)
}