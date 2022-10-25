import { t } from '../router'
import { z } from 'zod'
import { prisma } from '../server'
import { TRPCError } from '@trpc/server'

import { ap } from '../middleware/isAuthed'

const tasksRouter = t.router({
    get: ap.query(async ({ ctx }) => {
        const tasks = await prisma.task
            .findMany({ where: { uuid: ctx.user.uuid } })
            .catch((err) => {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: err.message
                })
            })

        return tasks
    }),
    create: ap
        .input(
            z.object({
                title: z.string(),
                description: z.string(),
                deadline: z.string(),
                color: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const deadline = new Date(input.deadline)

            const newTask = await prisma.task
                .create({
                    data: {
                        ...input,
                        uuid: ctx.user.uuid,
                        deadline
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            return newTask
        }),
    edit: ap
        .input(
            z.object({
                id: z.number(),
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
                        message: err.message
                    })
                })

            return editTask
        }),
    delete: ap
        .input(
            z.object({
                taskId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const deleteTask = await prisma.task
                .delete({ where: { id: input.taskId } })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            return deleteTask
        })
})

export default tasksRouter
