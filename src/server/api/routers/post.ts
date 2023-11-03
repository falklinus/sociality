import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  bySessionUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getByUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: input.id } },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
