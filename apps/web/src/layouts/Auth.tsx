import { createStyles } from '@mantine/core'
import { Outlet } from 'react-router-dom'

const AuthLayout: React.FC = () => {
    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
            <div className={classes.rightSide}>
                <div className={classes.blob} />
                <div className={classes.acrylic} />
            </div>

            <div className={classes.authWrapper}>
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            height: '100vh'
        },
        authWrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        },
        rightSide: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? colors.dark[8] : colors.gray[3]
        },
        blob: {
            width: '200px',
            height: '200px',
            backgroundColor: colors.blue[5],
            borderRadius: '100%'
        },
        acrylic: {
            position: 'absolute',
            width: '100%',
            height: '50%',
            bottom: 0,
            backdropFilter: 'blur(16px)'
        }
    }
})
