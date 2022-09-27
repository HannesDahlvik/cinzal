import type { DashboardSidebarLinks } from '../../config/types'

import { createStyles } from '@mantine/core'
import {
    Alarm,
    CalendarBlank,
    CirclesFour,
    Cloud,
    ListChecks,
    Newspaper,
    Notebook,
    SignOut
} from 'phosphor-react'

import DashboardSidebarLink from './SidebarLink'

const links: DashboardSidebarLinks[] = [
    {
        title: 'Home',
        path: 'home',
        icon: <CirclesFour weight="regular" />,
        iconActive: <CirclesFour weight="fill" />
    },
    {
        title: 'Calendar',
        path: 'calendar',
        icon: <CalendarBlank weight="regular" />,
        iconActive: <CalendarBlank weight="fill" />
    },
    {
        title: 'Notes',
        path: 'notes',
        icon: <Notebook weight="regular" />,
        iconActive: <Notebook weight="fill" />
    },
    {
        title: 'Tasks',
        path: 'tasks',
        icon: <ListChecks weight="regular" />,
        iconActive: <ListChecks weight="fill" />
    },
    {
        title: 'Alarms',
        path: 'alarms',
        icon: <Alarm weight="regular" />,
        iconActive: <Alarm weight="fill" />
    },
    {
        title: 'Weather',
        path: 'weather',
        icon: <Cloud weight="regular" />,
        iconActive: <Cloud weight="fill" />
    },
    {
        title: 'News',
        path: 'news',
        icon: <Newspaper weight="regular" />,
        iconActive: <Newspaper weight="fill" />
    }
]

const DashboardSidebar: React.FC = () => {
    const { classes } = useStyles()

    return (
        <div className={classes.sidebar}>
            <div className={classes.sidebarMiddle}>
                {links.map((row) => (
                    <DashboardSidebarLink
                        key={row.title}
                        title={row.title}
                        to={row.path}
                        icon={row.icon}
                        iconActive={row.iconActive}
                        active={location.pathname.includes(row.path)}
                    />
                ))}
            </div>

            <div className={classes.sidebarBottom}>
                <DashboardSidebarLink
                    title="Sign out"
                    icon={<SignOut weight="regular" />}
                    iconActive={<SignOut weight="fill" />}
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
            width: '100%',
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
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
            width: '100%'
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
