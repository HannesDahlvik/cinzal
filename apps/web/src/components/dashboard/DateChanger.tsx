import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { createStyles, Badge, Text } from '@mantine/core'
import { CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight } from 'phosphor-react'

import dayjs from 'dayjs'

interface Props {
    changeWeek?: boolean
}

const DashboardDateChanger: React.FC<Props> = ({ changeWeek = false }) => {
    const { classes } = useStyles()

    const { value: globalDate, set: setGlobalDate } = useHookstate(state.date)

    const handlePrev = () => {
        if (changeWeek) setGlobalDate(globalDate.clone().subtract(1, 'week'))
        else setGlobalDate(globalDate.clone().subtract(1, 'month'))
    }

    const handlePrevYear = () => {
        setGlobalDate(globalDate.clone().subtract(1, 'year'))
    }

    const handleNext = () => {
        if (changeWeek) setGlobalDate(globalDate.clone().add(1, 'week'))
        else setGlobalDate(globalDate.clone().add(1, 'month'))
    }

    const handleNextYear = () => {
        setGlobalDate(globalDate.clone().add(1, 'year'))
    }

    const handleReset = () => {
        const d = new Date()
        setGlobalDate(dayjs(d))
    }

    return (
        <div className={classes.root}>
            <div className={classes.icons}>
                <CaretDoubleLeft
                    className={classes.icon}
                    weight="regular"
                    onClick={handlePrevYear}
                />
                <CaretLeft className={classes.icon} weight="regular" onClick={handlePrev} />
            </div>

            <Text className={classes.text} onClick={handleReset}>
                {dayjs.months()[globalDate.month()]} {globalDate.year()} <br />
                {changeWeek && <Badge>Week {globalDate.week()}</Badge>}
            </Text>

            <div className={classes.icons}>
                <CaretRight className={classes.icon} weight="regular" onClick={handleNext} />
                <CaretDoubleRight
                    className={classes.icon}
                    weight="regular"
                    onClick={handleNextYear}
                />
            </div>
        </div>
    )
}

export default DashboardDateChanger

const useStyles = createStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    icons: {
        height: '24px',

        svg: {
            width: '24px',
            height: '24px'
        }
    },
    icon: {
        cursor: 'pointer',
        marginLeft: '2px',
        marginRight: '2px'
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
    }
}))
