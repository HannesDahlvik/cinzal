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
    username: z.string().min(3),
    email: z.string(),
    password: z.string().min(4)
})

type SignupValues = typeof formValidation._type

const AuthSignupPage: React.FC = () => {
    const { classes } = useStyles()

    const navigate = useNavigate()

    const { mutate: signupMutation } = trpc.auth.signup.useMutation({
        onError: (err) => errorHandler(err.message),
        onSuccess: (data) => {
            setAuth(data.token, data.user)
            navigate('/dashboard')
        }
    })

    const form = useForm<SignupValues>({
        validate: zodResolver(formValidation),
        initialValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    return (
        <>
            <Title mb="xl">Signup</Title>

            <form className={classes.form} onSubmit={form.onSubmit((vals) => signupMutation(vals))}>
                <Stack>
                    <TextInput
                        label="Username"
                        placeholder="John Doe"
                        required
                        {...form.getInputProps('username')}
                    />

                    <TextInput
                        label="Email"
                        placeholder="john.doe@email.com"
                        type="email"
                        required
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="********"
                        required
                        {...form.getInputProps('password')}
                    />

                    <Button type="submit">Signup</Button>
                </Stack>
            </form>

            <Text mt="md" color="dimmed">
                Already have an account? <Anchor onClick={() => navigate('/login')}>Login</Anchor>
            </Text>
        </>
    )
}

export default AuthSignupPage

const useStyles = createStyles(() => {
    return {
        form: {
            width: '350px'
        }
    }
})
