import { Outlet, useNavigate } from 'react-router-dom'

import { useHookstate } from '@hookstate/core'
import state from '../state'

import { createStyles } from '@mantine/core'
import { useShallowEffect } from '@mantine/hooks'

import LandingNavbar from '../components/landing/Navbar'

const LandingLayout: React.FC = () => {
    const { classes } = useStyles()

    const navigate = useNavigate()

    const { value: user } = useHookstate(state.auth.user)
    const { value: hasRedirectedDashboard } = useHookstate(state.hasRedirectedDashboard)

    useShallowEffect(() => {
        if (user?.redirectDashboard && !hasRedirectedDashboard) {
            navigate('/dashboard')
        }
    }, [0])

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

export default LandingLayout

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
