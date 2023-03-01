import { Box, Center, createStyles, MantineColor, Text, useMantineTheme } from '@mantine/core'

import { Dayjs } from 'dayjs'

interface Props {
    title: string
    description: string
    color: MantineColor
    deadline: Dayjs
}

const DashboardHomeRightSidebarItem: React.FC<Props> = ({
    title,
    description,
    color,
    deadline
}) => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    return (
        <div className={classes.box}>
            <Center>
                <Text size="lg" weight="bold">
                    {deadline.format('HH:mm')}
                </Text>
            </Center>

            <Box className={classes.divider} sx={{ backgroundColor: theme.colors[color][5] }} />

            <Center
                sx={{
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    marginLeft: theme.spacing.sm
                }}
            >
                <Text weight="bold" lineClamp={1}>
                    {title}
                </Text>
                <Text size="sm" lineClamp={1}>
                    {description}
                </Text>
            </Center>
        </div>
    )
}

export default DashboardHomeRightSidebarItem

const useStyles = createStyles((theme) => {
    return {
        box: {
            display: 'grid',
            gridTemplateColumns: '1fr 6px 4fr',
            alignItems: 'center',
            height: '60px',
            marginBottom: theme.spacing.md
        },
        divider: {
            height: '100%',
            width: '6px',
            borderRadius: theme.radius.xl
        }
    }
})
