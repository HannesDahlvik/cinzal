import { User } from '@prisma/client'

export interface VerifyDecoded {
    user: User
    iat: number
    exp: number
}

export interface CalendarResponse {
    datatype: string
    description: string
    dtstmp: Date
    end: Date
    location: string
    method: string
    params: unknown[]
    start: Date
    status: string
    summary: string
    type: string
    uid: string
}
