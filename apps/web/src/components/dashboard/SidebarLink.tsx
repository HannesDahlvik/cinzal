import { useNavigate } from 'react-router-dom'

import { createStyles, Text } from '@mantine/core'

interface Props {
    title: string
    icon: React.ReactNode
    iconActive: React.ReactNode
    to?: string
    active?: boolean
    onClick?: () => void
}

const DashboardSidebarLink: React.FC<Props> = (props) => {
    const { classes } = useStyles()
    const navigate = useNavigate()

    const onClick = () => {
        if (props.onClick) {
            props.onClick()
        } else if (props.to) {
            navigate(`/dashboard/${props.to}`)
        }
    }

    return (
        <div
            className={`${classes.sidebarLink} ${
                props.active ? classes.sidebarLinkActive : classes.sidebarLink
            }`}
            onClick={onClick}
        >
            <div className={classes.sidebarLinkIcon}>
                {props.active ? props.iconActive : props.icon}
            </div>
            <Text className={classes.sidebarLinkText}>{props.title}</Text>
        </div>
    )
}

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        sidebarLink: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderRadius: theme.radius.sm,
            padding: theme.spacing.md,
            paddingLeft: theme.spacing.lg,
            paddingRight: theme.spacing.lg,
            cursor: 'pointer',
            transition: '.25s',
            color: colors.gray[5],

            '&:hover': {
                color: 'white'
            }
        },
        sidebarLinkActive: {
            color: 'white !important',
            transition: '.25s',

            '&:after': {
                content: '""',
                position: 'absolute',
                right: 0,
                height: '75%',
                width: '8px',
                transition: '.25s',
                backgroundColor: isDark ? theme.white : '',
                borderTopLeftRadius: theme.radius.sm,
                borderBottomLeftRadius: theme.radius.sm
            }
        },
        sidebarLinkIcon: {
            width: '24px',
            height: '24px'
        },
        sidebarLinkText: {
            fontWeight: 'bold'
        }
    }
})

export default DashboardSidebarLink
