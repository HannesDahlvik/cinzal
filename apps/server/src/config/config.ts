const config = {
    jwtSecret: process.env.JWT_SECRET as string,
    certificate: {
        key: process.env.CERTIFICATE_KEY as string,
        cert: process.env.CERTIFICATE_CERT as string
    } 
}

export default config
