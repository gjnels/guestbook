import { TRPCError } from "@trpc/server";
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
  deleteMessage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const message = await ctx.prisma.guestbook.findUnique({
          where: {
            id: input.id,
          },
          select: {
            name: true,
          },
        });

        if (message?.name !== ctx.session.user.name) {
          throw new TRPCError({
            message: "Not your message",
            code: "UNAUTHORIZED",
          });
        }

        return await ctx.prisma.guestbook.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: "Error deleting message",
          code: "NOT_FOUND",
        });
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new TRPCError({
        message: "Error fetching messages",
        code: "NOT_FOUND",
      });
    }
  }),
});
