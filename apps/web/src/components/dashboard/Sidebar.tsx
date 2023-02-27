import type { DashboardSidebarLinks } from '../../config/types'
import * as packageJSON from '../../../package.json'

import { Link, useNavigate } from 'react-router-dom'

import { createStyles, Image, Text } from '@mantine/core'
import { CalendarBlank, House, ListChecks, Notebook, SignOut, User } from 'phosphor-react'

import DashboardSidebarLink from './SidebarLink'
import { setAuth } from '../../utils'

import Logo from '../../assets/imgs/logo.png'

const links: DashboardSidebarLinks[] = [
    {
        path: 'home',
        icon: <House />
    },
    {
        path: 'calendar',
        icon: <CalendarBlank />
    },
    {
        path: 'tasks',
        icon: <ListChecks />
    },
    {
        path: 'notes',
        icon: <Notebook />
    }
]

const DashboardSidebar: React.FC = () => {
    const { classes } = useStyles()

    const navigate = useNavigate()

    const handleSignOut = () => {
        navigate('/')
        setAuth(null, null)
    }

    return (
        <div className={classes.sidebar}>
            <div className={classes.sidebarTop}>
                <Link to="/">
                    <Image src={Logo} width={38} />
                </Link>
                <Text size="xs" mt="2px">
                    {packageJSON.version}
                </Text>
            </div>

            <div className={classes.sidebarMiddle}>
                {links.map((row) => (
                    <DashboardSidebarLink
                        key={row.path}
                        to={row.path}
                        icon={row.icon}
                        active={location.pathname.includes(row.path)}
                    />
                ))}
            </div>

            <div className={classes.sidebarBottom}>
                <DashboardSidebarLink icon={<SignOut weight="regular" />} onClick={handleSignOut} />

                <DashboardSidebarLink
                    icon={<User weight="regular" />}
                    iconActive={<User weight="fill" />}
                    active={location.pathname.includes('/profile')}
                    onClick={() => navigate('/dashboard/profile')}
                />
            </div>
        </div>
    )
}

export default DashboardSidebar

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        sidebar: {
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            left: 0,
            background: isDark ? colors.dark[8] : theme.white,
            borderRight: '1px solid',
            borderRightColor: isDark ? colors.dark[5] : colors.gray[4],
            height: '100vh'
        },
        sidebarTop: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            textAlign: 'center',
            padding: theme.spacing.md
        },
        sidebarTitle: {
            color: isDark ? theme.white : theme.black,
            textDecoration: 'none',
            cursor: 'pointer'
        },
        sidebarMiddle: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            marginTop: 'auto'
        },
        sidebarBottom: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: 'auto'
        }
    }
})
