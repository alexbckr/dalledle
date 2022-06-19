import { prisma } from "../../../lib/prisma.js"

// PUT /api/increment_solves
export default async function handle(req, res) {
   const date = req.body.date
   const unique = req.body.unique

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

   // if the play is a unique user (never played a game before)
   if (unique) {
      // increment unique plays in the image and in the stat book
      const unique_solves = await prisma.image.update({
         where: { date: date },
         data: {
            unique_solves: { increment: 1 },
         },
      })

      const total_unique_solves = await prisma.stat_book.update({
         where: { id: "stat_book" },
         data: {
            total_unique_solves: { increment: 1 },
         },
      })
   }
   // if the user has already played before
   else {
      // increment return plays
      const return_solves = await prisma.image.update({
         where: { date: date },
         data: {
            return_solves: { increment: 1 },
         },
      })

      const total_return_solves = await prisma.stat_book.update({
         where: { id: "stat_book" },
         data: {
            total_return_solves: { increment: 1 },
         },
      })
   }



   res.json(stat)
}
