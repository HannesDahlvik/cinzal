export const parseTrpcError = (err: any): string => {
    const error = JSON.parse(err.message)
    return error[1].message as string
}
