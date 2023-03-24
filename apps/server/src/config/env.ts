import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    NODE_ENV: z.enum(['development', 'production'])
})

const check = envSchema.safeParse(process.env)

if (!check.success) {
    console.error('Invalid environment variablies:', JSON.stringify(check.error.format(), null, 4))
    process.exit(1)
}

export const env = check.data
