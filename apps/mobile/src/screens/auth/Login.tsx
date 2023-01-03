import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { RootStackScreenProps } from '~/navigation/Root'

import { Box, Button, FormControl, Heading, Icon, Input, Pressable, Stack } from 'native-base'
import { Eye, EyeSlash } from 'phosphor-react-native'

import { setAuth, trpc, useErrorHandler } from '../../utils'
import { Controller, useForm } from 'react-hook-form'

interface FormVals {
    email: string
    password: string
}

const AuthLoginScreen: React.FC<RootStackScreenProps<'Login'>> = () => {
    const errorHandler = useErrorHandler()

    const loginMutation = trpc.auth.login.useMutation()

    const { control, handleSubmit } = useForm<FormVals>()

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = (data: FormVals) => {
        if (!data.email || !data.password) return errorHandler('Insert email and/or password')
        setLoading(true)

        loginMutation.mutate(data, {
            onError: (err) => {
                setLoading(false)
                errorHandler(err.message)
            },
            onSuccess: (data) => {
                setLoading(false)
                setAuth(data.token, data.user)
            }
        })
    }

    return (
        <Stack style={styles.wrapper}>
            <Heading size="2xl" mb="5">
                Login
            </Heading>

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

            <Button w="75%" mt="2" isLoading={loading} onPress={handleSubmit(handleLogin)}>
                Login
            </Button>
        </Stack>
    )
}

export default AuthLoginScreen

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
