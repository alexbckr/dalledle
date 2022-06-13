import { prisma } from "../../../lib/prisma.js"

// PUT /api/update_unique_users
export default async function handle(req, res) {
   const stat = await prisma.stat_book.update({
      where: { id: "stat_book" },
      data: {
         unique_users: { increment: 1 },
      },
   })
   res.json(stat)
}
