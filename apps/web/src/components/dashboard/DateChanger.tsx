import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Text, createStyles } from '@mantine/core'
import { CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight } from 'phosphor-react'

import dayjs from 'dayjs'

const DashboardDateChanger: React.FC = () => {
    const { classes } = useStyles()

    const { value: globalDate, set: setGlobalDate } = useHookstate(state.date)

    const handlePrevMonth = () => {
        setGlobalDate(globalDate.clone().subtract(1, 'month'))
    }

    const handlePrevYear = () => {
        setGlobalDate(globalDate.clone().subtract(1, 'year'))
    }

    const handleNextMonth = () => {
        setGlobalDate(globalDate.clone().add(1, 'month'))
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
                <CaretLeft className={classes.icon} weight="regular" onClick={handlePrevMonth} />
            </div>

            <Text className={classes.text} onClick={handleReset}>
                {dayjs.months()[globalDate.month()]} {globalDate.year()}
            </Text>

            <div className={classes.icons}>
                <CaretRight className={classes.icon} weight="regular" onClick={handleNextMonth} />
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
        cursor: 'pointer'
    }
}))
