import { Box, createStyles } from '@mantine/core'
import { IconContext } from 'phosphor-react'

import { useNavigate } from 'react-router-dom'

interface Props {
    icon: React.ReactNode
    to?: string
    active?: boolean
    onClick?: () => void
}

const DashboardBottomBarLink: React.FC<Props> = (props) => {
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
        <div className={classes.link} onClick={onClick}>
            <Box
                sx={{
                    width: '28px',
                    height: '28px',

                    svg: {
                        width: '28px',
                        height: '28px'
                    }
                }}
            >
                <IconContext.Provider
                    value={{
                        weight: props.active ? 'fill' : 'regular'
                    }}
                >
                    {props.icon}
                </IconContext.Provider>
            </Box>
        </div>
    )
}

export default DashboardBottomBarLink

const useStyles = createStyles((theme) => {
    const colors = theme.colors

    return {
        link: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            transition: '.25s',
            color: colors.gray[5]
        },
        linkIcon: {
            width: '28px',
            height: '28px',

            svg: {
                width: '28px',
                height: '28px'
            }
        }
    }
})
