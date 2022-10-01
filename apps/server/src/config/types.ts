export interface VerifyDecoded {
    user: {
        id: number
        uuid: string
        username: string
        email: string
        createdAt: Date
        updatedAt: Date
    }
    iat: number
    exp: number
}
