import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Box, createStyles, Group, Image, Text } from '@mantine/core'

import Logo from '../../assets/imgs/logo.png'
import githubLogo from '../../assets/icons/github.svg'

const LandingNavbar: React.FC = () => {
    const { classes } = useStyles()

    const navigate = useNavigate()

    const [transparent, setTransparent] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', (ev) => {
            if (window.scrollY > 50) {
                setTransparent(true)
            } else {
                setTransparent(false)
            }
        })
    }, [])

    return (
        <Box className={`${classes.navbar} ${transparent ? classes.navbarBackground : ''}`}>
            <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <Image src={Logo} alt="Cinzal logo" width="32px" withPlaceholder />

                <Text ml="xs" size="xl" weight="bold">
                    Cinzal
                </Text>
            </Box>

            <Group position="right" spacing="xs">
                <a
                    className={classes.link}
                    href="https://github.com/HannesDahlvik/cinzal"
                    target="_blank"
                >
                    <img className={classes.icon} src={githubLogo} width={30} />
                </a>
            </Group>
        </Box>
    )
}

export default LandingNavbar

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors
    const spacing = theme.spacing

    return {
        navbar: {
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '80px',
            padding: spacing.md,
            borderBottom: '1px solid',
            borderBottomColor: 'transparent',
            transition: '.3s',
            zIndex: 10
        },
        navbarBackground: {
            backgroundColor: isDark ? 'rgba(20, 21, 23, 0.5)' : 'rgba(233, 236, 239, 0.5)',
            backdropFilter: `blur(18px)`,
            borderBottomColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        link: {
            display: 'flex',
            color: isDark ? theme.white : theme.black,
            textDecoration: 'none',
            fontSize: '26px',
            cursor: 'pointer'
        },
        icon: {
            filter: isDark ? 'invert(1)' : 'invert(0)'
        }
    }
})
