import { Outlet, useNavigate } from 'react-router-dom'

import { Box, createStyles, Image, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { CaretLeft } from 'phosphor-react'

import Logo from '../assets/imgs/logo.png'

const AuthLayout: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()
    const showLogo = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

    const navigate = useNavigate()

    return (
        <>
            <div className={classes.background} />

            <Box
                className={classes.wrapper}
                sx={{
                    paddingTop: !showLogo ? '75px' : '150px'
                }}
            >
                <div className={classes.back} onClick={() => navigate('/')}>
                    <CaretLeft weight="bold" size={24} />
                    <Text>Back</Text>
                </div>

                {!showLogo ? <Image src={Logo} width={100} mb="xl" /> : null}

                <div className={classes.authWrapper}>
                    <Outlet />
                </div>
            </Box>
        </>
    )
}

export default AuthLayout

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        background: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '50%',
            background:
                'conic-gradient(from 90deg at 50% 50%, rgba(92, 124, 250, 0.3) 0%, rgba(51, 154, 240, 0.4) 54%, rgba(255, 255, 255, 0) 54%, rgba(255, 255, 255, 0) 96%, rgba(92, 124, 250, 0.3) 100%)',
            filter: 'blur(100px)',
            zIndex: -1
        },
        wrapper: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh'
        },
        back: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
            position: 'absolute',
            top: 24,
            left: 24,
            cursor: 'pointer'
        },
        authWrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            backgroundColor: colors.dark[8],
            border: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[4],

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                width: '90%'
            }
        }
    }
})
