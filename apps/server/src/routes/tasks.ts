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
        })
})

export default tasksRouter
