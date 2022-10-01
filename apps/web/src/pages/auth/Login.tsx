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

    const navigate = useNavigate()

    const { mutate: loginMutation } = trpc.auth.login.useMutation({
        onError: (err) => errorHandler(err.message),
        onSuccess: (data) => {
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

    return (
        <>
            <Title mb="xl">Login</Title>

            <form className={classes.form} onSubmit={form.onSubmit((vals) => loginMutation(vals))}>
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

                    <Button type="submit">Login</Button>
                </Stack>
            </form>

            <Text mt="md" color="dimmed">
                Don't have an account? <Anchor onClick={() => navigate('/signup')}>Signup</Anchor>
            </Text>
        </>
    )
}

export default AuthLoginPage

const useStyles = createStyles(() => {
    return {
        form: {
            width: '350px'
        }
    }
})
