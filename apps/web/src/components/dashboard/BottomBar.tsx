import { DashboardSidebarLinks } from '../../config/types'

import { useNavigate } from 'react-router-dom'

import { createStyles } from '@mantine/core'
import { CalendarBlank, House, ListChecks, Notebook, User } from 'phosphor-react'
import DashboardBottomBarLink from './BottomBarLink'

const links: DashboardSidebarLinks[] = [
    {
        path: 'tasks',
        icon: <ListChecks />
    },
    {
        path: 'calendar',
        icon: <CalendarBlank />
    },
    {
        path: 'home',
        icon: <House />
    },
    {
        path: 'notes',
        icon: <Notebook />
    },
    {
        path: 'profile',
        icon: <User />
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
