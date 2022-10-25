import { t } from '../router'
import { z } from 'zod'
import { prisma } from '../server'
import { TRPCError } from '@trpc/server'

import { ap } from '../middleware/isAuthed'

const notesRouter = t.router({
    all: ap.query(async ({ ctx }) => {
        const notes = await prisma.note
            .findMany({
                where: {
                    uuid: ctx.user.uuid
                }
            })
            .catch((err) => {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
            })

        return notes
    }),
    get: ap
        .input(
            z.object({
                noteID: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const note = await prisma.note
                .findFirst({
                    where: {
                        id: input.noteID,
                        AND: {
                            uuid: ctx.user.uuid
                        }
                    }
                })
                .catch((err) => {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
                })

            return note
        }),
    create: ap
        .input(
            z.object({
                title: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newNote = await prisma.note
                .create({
                    data: {
                        title: input.title,
                        data: '',
                        uuid: ctx.user.uuid
                    }
                })
                .catch((err) => {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
                })

            return newNote
        }),
    save: ap
        .input(
            z.object({
                noteID: z.number(),
                title: z.string(),
                data: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const note = await prisma.note
                .update({
                    where: { id: input.noteID },
                    data: {
                        title: input.title,
                        data: input.data
                    }
                })
                .catch((err) => {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
                })

            return note
        }),
    delete: ap
        .input(
            z.object({
                noteID: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const deletedNote = await prisma.note
                .delete({ where: { id: input.noteID } })
                .catch((err) => {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
                })

            return deletedNote
        })
})

export default notesRouter
