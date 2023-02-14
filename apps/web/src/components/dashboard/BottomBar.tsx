import { DashboardSidebarLinks } from '../../config/types'

import { useNavigate } from 'react-router-dom'

import { createStyles } from '@mantine/core'
import { CalendarBlank, House, ListChecks, Notebook, User } from 'phosphor-react'
import DashboardBottomBarLink from './BottomBarLink'

const links: DashboardSidebarLinks[] = [
    {
        path: 'tasks',
        icon: <ListChecks weight="regular" />,
        iconActive: <ListChecks weight="fill" />
    },
    {
        path: 'calendar',
        icon: <CalendarBlank weight="regular" />,
        iconActive: <CalendarBlank weight="fill" />
    },
    {
        path: 'home',
        icon: <House weight="regular" />,
        iconActive: <House weight="fill" />
    },
    {
        path: 'notes',
        icon: <Notebook weight="regular" />,
        iconActive: <Notebook weight="fill" />
    },
    {
        path: 'profile',
        icon: <User weight="regular" />,
        iconActive: <User weight="fill" />
    }
]

const DashboardBottomBar: React.FC = () => {
    const { classes } = useStyles()

    const navigate = useNavigate()

    return (
        <div className={classes.wrapper}>
            {links.map((row) => (
                <DashboardBottomBarLink
                    key={row.path}
                    to={row.path}
                    icon={row.icon}
                    iconActive={row.iconActive}
                    active={location.pathname.includes(row.path)}
                />
            ))}
        </div>
    )
}

export default DashboardBottomBar

const useStyles = createStyles((theme) => {
    const colors = theme.colors

    return {
        wrapper: {
            position: 'fixed',
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            height: '80px',
            backgroundColor: colors.dark[7],
            borderTop: '1px solid',
            borderTopColor: colors.dark[5],
            zIndex: 99
        }
    }
})
