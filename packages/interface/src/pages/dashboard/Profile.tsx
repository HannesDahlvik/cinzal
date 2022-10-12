import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Avatar, Tabs, Title, createStyles } from '@mantine/core'

import DashboardProfileSettings from '../../components/dashboard/ProfileSettings'
import DashboardProfileUserInfo from '../../components/dashboard/ProfileUserInfo'

const DashboardProfilePage: React.FC = () => {
    const { classes } = useStyles()

    const { value: user } = useHookstate(state.auth.user)

    return (
        <div className={classes.root}>
            <div className={classes.topSection}>
                <Avatar
                    size={128}
                    styles={{
                        root: {
                            borderRadius: '50%'
                        },
                        placeholder: {
                            backgroundColor: 'rgba(52, 58, 64, 0.35)',
                            color: '#fff'
                        }
                    }}
                >
                    {user?.username.charAt(0)}
                    {user?.username.split(' ')[1].charAt(0)}
                </Avatar>
                <Title mt="sm">{user?.username}</Title>
            </div>

            <div className={classes.bottomSection}>
                <Tabs variant="pills" className={classes.tabs} defaultValue="userinfo">
                    <Tabs.List mb="md" grow>
                        <Tabs.Tab value="userinfo">User info</Tabs.Tab>
                        <Tabs.Tab value="settings">Settings</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="userinfo">
                        <DashboardProfileUserInfo />
                    </Tabs.Panel>

                    <Tabs.Panel value="settings">
                        <DashboardProfileSettings />
                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>
    )
}

export default DashboardProfilePage

const useStyles = createStyles((theme) => {
    const colors = theme.colors
    const isDark = theme.colorScheme === 'dark'

    return {
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        topSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '64px 0',
            backgroundColor: isDark ? colors.dark[9] : colors.gray[2]
        },
        bottomSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            padding: '16px 0',
            backgroundColor: isDark ? colors.dark[8] : '#fff',
            borderTop: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        tabs: {
            width: '500px',
            ['@media (max-width: 550px)']: {
                width: '90%'
            }
        }
    }
})
