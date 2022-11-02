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
        tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        tasks.sort((a, b) => Number(a.completed) - Number(b.completed))

        return tasks
    }),
    create: ap
        .input(
            z.object({
                title: z.string(),
                description: z.string(),
                deadline: z.date(),
                color: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newTask = await prisma.task
                .create({
                    data: {
                        ...input,
                        uuid: ctx.user.uuid
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
                deadline: z.date(),
                color: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const editTask = await prisma.task
                .update({
                    where: { id: input.id },
                    data: {
                        ...input
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
        }),
    toggle: ap
        .input(
            z.object({
                id: z.number(),
                completed: z.boolean()
            })
        )
        .mutation(async ({ input }) => {
            const toggledTask = await prisma.task
                .update({
                    where: { id: input.id },
                    data: {
                        completed: !input.completed
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            return toggledTask
        })
})

export default tasksRouter
