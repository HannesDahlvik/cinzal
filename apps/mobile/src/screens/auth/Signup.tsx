import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { RootStackScreenProps } from '~/navigation/Root'

import {
    Box,
    Button,
    FormControl,
    Heading,
    Icon,
    Input,
    Pressable,
    Stack,
    useToast
} from 'native-base'
import { Eye, EyeSlash } from 'phosphor-react-native'

import { trpc } from '../../utils'
import { Controller, useForm } from 'react-hook-form'

interface FormVals {
    username: string
    email: string
    password: string
}

const AuthSignupScreen: React.FC<RootStackScreenProps<'Signup'>> = () => {
    const signupMutation = trpc.auth.signup.useMutation()

    const { control, handleSubmit } = useForm<FormVals>()

    const [showPassword, setShowPassword] = useState(false)

    const toast = useToast()

    const handleSignup = (data: FormVals) => {
        if (!data.email && !data.password)
            return toast.show({ title: 'Insert email and/or password' })

        signupMutation.mutate(data, {
            onSuccess: (data) => {
                console.log(data)
            }
        })
    }

    return (
        <Stack style={styles.wrapper}>
            <Heading size="2xl" mb="5">
                Signup
            </Heading>

            <Box alignItems="center" mb="2" w="75%">
                <FormControl>
                    <FormControl.Label isRequired>Username</FormControl.Label>
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Input
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="John Doe"
                            />
                        )}
                    />
                </FormControl>
            </Box>

            <Box alignItems="center" mb="2" w="75%">
                <FormControl>
                    <FormControl.Label isRequired>Email</FormControl.Label>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Input
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="john.doe@gmail.com"
                            />
                        )}
                    />
                </FormControl>
            </Box>

            <Box alignItems="center" mb="2" w="75%">
                <FormControl>
                    <FormControl.Label isRequired>Password</FormControl.Label>
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Input
                                placeholder="********"
                                type={showPassword ? 'text' : 'password'}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                InputRightElement={
                                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                                        <Icon as={showPassword ? <EyeSlash /> : <Eye />} mr="2" />
                                    </Pressable>
                                }
                            />
                        )}
                    />
                </FormControl>
            </Box>

            <Button w="75%" mt="2" onPress={handleSubmit(handleSignup)}>
                Signup
            </Button>
        </Stack>
    )
}

export default AuthSignupScreen

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
