import { t } from '../router'
import { z } from 'zod'
import { prisma } from '../server'
import { TRPCError } from '@trpc/server'

import { ap } from '../middleware/isAuthed'

const tasksRouter = t.router({
    get: ap
        .input(
            z.object({
                uuid: z.string()
            })
        )
        .query(async ({ input }) => {
            try {
                const tasks = await prisma.task.findMany({ where: { uuid: input.uuid } })

                return tasks
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database error'
                })
            }
        }),
    create: ap
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
            try {
                const deadline = new Date(input.deadline)

                const newTask = await prisma.task.create({
                    data: {
                        ...input,
                        deadline
                    }
                })

                return newTask
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database error'
                })
            }
        }),
    edit: ap
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
            try {
                const deadline = new Date(input.deadline)

                const editTask = await prisma.task.update({
                    where: { id: input.id },
                    data: {
                        title: input.title,
                        description: input.description,
                        deadline: deadline,
                        color: input.color
                    }
                })

                return editTask
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database error'
                })
            }
        }),
    delete: ap
        .input(
            z.object({
                task_id: z.number()
            })
        )
        .mutation(async ({ input }) => {
            try {
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
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database error'
                })
            }
        })
})

export default tasksRouter
