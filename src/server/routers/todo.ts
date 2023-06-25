import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { procedure, router } from "../trpc";
import { createInput, updateInput } from "../types/todo";
const prisma = new PrismaClient();

export const todoRouter = router({
  getTodos: procedure.query(async () => {
    const todos = await prisma.todo.findMany();
    return todos;
  }),
  getTodoById: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const todo = await prisma.todo.findUnique({
        where: { id: input.id },
      });
      if (!todo) {
        throw new Error("Todo not found");
      }
      return todo;
    }),
  createTodo: procedure.input(createInput).mutation(async ({ input }) => {
    const todo = await prisma.todo.create({
      data: {
        title: input.title,
        body: input.body,
      },
    });
    return todo;
  }),
  updateTodo: procedure.input(updateInput).mutation(async ({ input }) => {
    const { id, title, body } = input;
    const todo = await prisma.todo.update({
      where: { id },
      data: { title, body },
    });
    return todo;
  }),
  deleteTodo: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.todo.delete({
        where: { id: input.id },
      });
    }),
});
