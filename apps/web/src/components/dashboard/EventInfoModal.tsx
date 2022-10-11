import { Text } from '@mantine/core'
import { VEvent } from 'node-ical'

interface Props {
    event: VEvent
}

const DashboardEventInfoModal: React.FC<Props> = ({ event }) => {
    return (
        <div>
            <Text>{event.description}</Text>

            <br />

            <Text>{event.location}</Text>
        </div>
    )
}

export default DashboardEventInfoModal
