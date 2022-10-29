import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
    Anchor,
    Button,
    createStyles,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

import { z } from 'zod'
import { errorHandler, setAuth, trpc } from '../../utils'

const formValidation = z.object({
    email: z.string(),
    password: z.string().min(4)
})

type LoginValues = typeof formValidation._type

const AuthLoginPage: React.FC = () => {
    const { classes } = useStyles()

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const { mutate: loginMutation } = trpc.auth.login.useMutation({
        onError: (err) => {
            setLoading(false)
            errorHandler(err.message)
        },
        onSuccess: (data) => {
            setLoading(false)
            setAuth(data.token, data.user)
            navigate('/dashboard')
        }
    })

    const form = useForm<LoginValues>({
        validate: zodResolver(formValidation),
        initialValues: {
            email: '',
            password: ''
        }
    })

    const handleLogin = (vals: LoginValues) => {
        setLoading(true)
        loginMutation(vals)
    }

    return (
        <>
            <Title mb="xl">Login</Title>

            <form className={classes.form} onSubmit={form.onSubmit((vals) => handleLogin(vals))}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="john.doe@email.com"
                        required
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="********"
                        required
                        {...form.getInputProps('password')}
                    />

                    <Button type="submit" loading={loading}>
                        Login
                    </Button>
                </Stack>
            </form>

            <Text mt="md" color="dimmed">
                Don't have an account? <Anchor onClick={() => navigate('/signup')}>Signup</Anchor>
            </Text>
        </>
    )
}

export default AuthLoginPage

const useStyles = createStyles((theme) => {
    return {
        form: {
            width: '400px',

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                width: '100%'
            }
        }
    }
})
