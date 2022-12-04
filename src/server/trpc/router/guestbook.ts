import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const guestbookRouter = router({
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.guestbook.create({
        data: {
          name: input.name,
          message: input.message,
        },
      });
    }),
});
