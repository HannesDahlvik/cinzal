import { IEvent, Task } from '../../../config/types'

interface Props {
    events: IEvent[]
    tasks: Task[]
}

const DashboardCalendarWeekView: React.FC<Props> = ({ events, tasks }) => {
    return (
        <>
            <p>Week View</p>
        </>
    )
}

export default DashboardCalendarWeekView
