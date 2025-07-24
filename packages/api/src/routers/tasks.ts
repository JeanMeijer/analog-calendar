import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, taskProcedure } from "../trpc";

export const tasksRouter = createTRPCRouter({
  list: taskProcedure.query(async ({ ctx }) => {
    const accounts = await Promise.all(
      ctx.providers.map(async ({ client, account }) => {
        const tasks = await client.tasks();

        return {
          id: account.accountId,
          provider: account.providerId,
          name: account.email,
          tasks,
        };
      }),
    );

    return {
      accounts,
    };
  }),

  listCategories: taskProcedure.query(async ({ ctx }) => {
    const categories = await Promise.all(
      ctx.providers.map(async ({ client, account }) => {
        const categories = await client.categories();

        return {
          id: account.accountId,
          provider: account.providerId,
          name: account.email,
          categories,
        };
      }),
    );

    return {
      categories,
    };
  }),

  getTasksForCategory: taskProcedure
    .input(
      z.object({
        accountId: z.string(),
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { accountId, categoryId } = input;

      const taskClient = ctx.providers.find(
        ({ account }) => account.accountId === accountId,
      );

      if (!taskClient?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task client not found for accountId: ${accountId}`,
        });
      }

      const tasks = await taskClient.client.tasksForCategory({
        id: categoryId,
      });

      return { tasks };
    }),

  createTask: taskProcedure
    .input(
      z.object({
        accountId: z.string(),
        categoryId: z.string(),
        task: z.object({
          title: z.string(),
          notes: z.string().optional(),
          due: z.string().optional(),
          status: z.string().optional().default("needsAction"),
          completed: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { accountId, categoryId, task } = input;

      const taskClient = ctx.providers.find(
        ({ account }) => account.accountId === accountId,
      );

      if (!taskClient?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task client not found for accountId: ${accountId}`,
        });
      }

      const createdTask = await taskClient.client.createTask(
        { id: categoryId },
        task,
      );

      return { task: createdTask };
    }),

  updateTask: taskProcedure
    .input(
      z.object({
        accountId: z.string(),
        categoryId: z.string(),
        task: z.object({
          id: z.string(),
          title: z.string().optional(),
          notes: z.string().optional(),
          due: z.string().optional(),
          status: z.string().optional(),
          completed: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { accountId, categoryId, task } = input;

      const taskClient = ctx.providers.find(
        ({ account }) => account.accountId === accountId,
      );

      if (!taskClient?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task client not found for accountId: ${accountId}`,
        });
      }

      const updatedTask = await taskClient.client.updateTask(
        { id: categoryId },
        task,
      );

      return { task: updatedTask };
    }),

  deleteTask: taskProcedure
    .input(
      z.object({
        accountId: z.string(),
        categoryId: z.string(),
        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { accountId, categoryId, taskId } = input;

      const taskClient = ctx.providers.find(
        ({ account }) => account.accountId === accountId,
      );

      if (!taskClient?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task client not found for accountId: ${accountId}`,
        });
      }

      await taskClient.client.deleteTask({ id: categoryId }, taskId);

      return { success: true };
    }),
});
