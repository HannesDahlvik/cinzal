import { t } from '../router'
import { z } from 'zod'
import { prisma } from '../server'
import { TRPCError } from '@trpc/server'

const tasksRouter = t.router({
    get: t.procedure
        .input(
            z.object({
                uuid: z.string()
            })
        )
        .query(async ({ input }) => {
            const tasks = await prisma.task
                .findMany({ where: { uuid: input.uuid } })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error',
                        cause: err
                    })
                })

            return tasks
        }),
    create: t.procedure
        .input(
            z.object({
                uuid: z.string(),
                title: z.string(),
                description: z.string(),
                deadline: z.string(),
                color: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const deadline = new Date(input.deadline)

            const newTask = await prisma.task
                .create({
                    data: {
                        ...input,
                        deadline
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error',
                        cause: err
                    })
                })

            return newTask
        }),
    edit: t.procedure
        .input(
            z.object({
                id: z.number(),
                uuid: z.string(),
                title: z.string(),
                description: z.string(),
                deadline: z.string(),
                color: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const deadline = new Date(input.deadline)

            const editTask = await prisma.task
                .update({
                    where: { id: input.id },
                    data: {
                        title: input.title,
                        description: input.description,
                        deadline: deadline,
                        color: input.color
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error',
                        cause: err
                    })
                })

            return editTask
        }),
    delete: t.procedure
        .input(
            z.object({
                task_id: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const deleteTask = await prisma.task
                .delete({ where: { id: input.task_id } })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error',
                        cause: err
                    })
                })

            return deleteTask
        })
})

export default tasksRouter
