import { z } from "zod";
import { generateNonce, SiweMessage } from "siwe";
import { router, publicProcedure } from "../trpc";

export const authRouter = router({
  getNonce: publicProcedure.query(async ({ ctx }) => {
    const nonce = generateNonce();
    ctx.session.nonce = nonce;
    await ctx.session.save();
    return { nonce };
  }),

  verify: publicProcedure
    .input(
      z.object({
        message: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const siweMessage = new SiweMessage(input.message);
      const result = await siweMessage.verify({
        signature: input.signature,
        nonce: ctx.session.nonce,
      });

      if (!result.success) {
        throw new Error("Invalid signature");
      }

      ctx.session.walletAddress = result.data.address;
      ctx.session.nonce = undefined;
      await ctx.session.save();

      return { address: result.data.address };
    }),

  session: publicProcedure.query(async ({ ctx }) => {
    return {
      walletAddress: ctx.session.walletAddress ?? null,
    };
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
    return { success: true };
  }),
});
