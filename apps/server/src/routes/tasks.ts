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
                deadline: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const deadline = new Date(input.deadline)

            const newTask = await prisma.task.create({
                data: {
                    ...input,
                    deadline
                }
            })

            return newTask
        })
})

export default tasksRouter
