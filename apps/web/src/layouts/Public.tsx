import { useEffect } from 'react'

import { Outlet } from 'react-router-dom'

import { createStyles, useMantineTheme } from '@mantine/core'

import LandingNavbar from '../components/landing/Navbar'

const PublicLayout: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    useEffect(() => {
        document.body.setAttribute('style', `background-color: ${theme.colors.dark[9]}`)
    }, [])

    return (
        <div>
            <LandingNavbar />

            <div className={classes.background} />

            <main>
                <div className={classes.innerMain}>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default PublicLayout

const useStyles = createStyles((theme) => {
    const breakpoints = theme.breakpoints

    return {
        background: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '400px',
            background:
                'radial-gradient(ellipse 50% 100% at 50% -20%, rgba(77, 171, 247, 0.15), transparent)',

            [`@media (max-width: ${breakpoints.md}px)`]: {
                background:
                    'radial-gradient(ellipse 70% 100% at 50% -20%, rgba(77, 171, 247, 0.15), transparent)'
            },

            [`@media (max-width: ${breakpoints.sm}px)`]: {
                background:
                    'radial-gradient(ellipse 100% 80% at 50% -20%, rgba(77, 171, 247, 0.15), transparent)'
            }
        },
        innerMain: {
            paddingTop: '80px'
        }
    }
})
