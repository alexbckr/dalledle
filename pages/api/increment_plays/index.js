import { prisma } from "../../../lib/prisma.js"

// PUT /api/increment_plays
export default async function handle(req, res) {
   const date = req.body.date
   const unique = req.body.unique

   // increment plays for the day
   const stat = await prisma.image.update({
      where: { date: date },
      data: {
         plays: { increment: 1 },
      },
   })

   // increment total plays in statbook
   const total_plays = await prisma.stat_book.update({
      where: { id: "stat_book" },
      data: {
         total_plays: { increment: 1 },
      },
   })

   // if the play is a unique user (never played a game before)
   if (unique) {
      // increment unique plays in the image and in the stat book
      const unique_plays = await prisma.image.update({
         where: { date: date },
         data: {
            unique_plays: { increment: 1 },
         },
      })

      const total_unique_plays = await prisma.stat_book.update({
         where: { id: "stat_book" },
         data: {
            total_unique_plays: { increment: 1 },
         },
      })
   }
   // if the user has already played before
   else {
      // increment return plays
      const return_plays = await prisma.image.update({
         where: { date: date },
         data: {
            return_plays: { increment: 1 },
         },
      })

      const total_return_plays = await prisma.stat_book.update({
         where: { id: "stat_book" },
         data: {
            total_return_plays: { increment: 1 },
         },
      })
   }

   res.json(stat)
}
