import { Box, createStyles, Sx } from '@mantine/core'

interface Props {
    children: React.ReactNode
    sx?: Sx
    onClick?: () => void
}

const DashboardPanel: React.FC<Props> = (props) => {
    const { classes } = useStyles()

    const handleOnClick = () => {
        if (props.onClick) props.onClick()
    }

    return (
        <Box sx={props.sx} className={classes.panel} onClick={handleOnClick}>
            {props.children}
        </Box>
    )
}

export default DashboardPanel

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        panel: {
            width: '100%',
            height: '100%',
            padding: theme.spacing.sm,
            border: '1px solid',
            borderColor: isDark ? colors.dark[6] : colors.gray[4],
            borderRadius: theme.radius.md
        }
    }
})
