import { t } from '../router'
import { z } from 'zod'
import { prisma } from '../server'

const tasksRouter = t.router({
    get: t.procedure
        .input(
            z.object({
                uuid: z.string()
            })
        )
        .query(async ({ input }) => {
            const tasks = await prisma.task.findMany({ where: { uuid: input.uuid } })

            return tasks
        }),
    create: t.procedure
        .input(
            z.object({
                uuid: z.string(),
                title: z.string(),
                description: z.string(),
                deadline: z.date()
            })
        )
        .mutation(async ({ input }) => {
            const newTask = await prisma.task.create({
                data: {
                    ...input
                }
            })

            return newTask
        })
})

export default tasksRouter
