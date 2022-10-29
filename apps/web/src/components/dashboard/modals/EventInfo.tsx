import { VEvent } from 'node-ical'

import { createStyles, Text } from '@mantine/core'
import { MapPin, TextAlignLeft } from 'phosphor-react'

import dayjs from 'dayjs'

interface Props {
    event: VEvent
}

const DashboardEventInfoModal: React.FC<Props> = ({ event }) => {
    const { classes } = useStyles()

    return (
        <>
            <Text mb="md">
                {dayjs(event.dtstamp).format('dddd, DD MMMM - ')}
                {dayjs(event.start).format('HH:mm')}
                {' - '}
                {dayjs(event.end).format('HH:mm')}
            </Text>

            <div className={classes.wrapper}>
                <div className={classes.icon}>
                    <MapPin weight="fill" />
                </div>

                <Text>
                    {event.location}

                    {!event.location && 'No location'}
                </Text>

                <div className={classes.icon}>
                    <TextAlignLeft weight="fill" />
                </div>

                <Text>
                    {event.description}

                    {!event.description && 'No description'}
                </Text>
            </div>
        </>
    )
}

export default DashboardEventInfoModal

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '24px 1fr',
            gap: '20px'
        },
        icon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '24px',

            svg: {
                width: '24px',
                height: '24px'
            }
        }
    }
})
