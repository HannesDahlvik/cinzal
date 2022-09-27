import { useEffect, useRef, useState } from 'react'

import { Box, createStyles, Text } from '@mantine/core'

import dayjs from 'dayjs'

const DashboardHomeTimeline: React.FC = () => {
    const { classes } = useStyles()

    const wrapperEl = useRef<HTMLDivElement>(null)

    const [needlePos, setNeedlePos] = useState(0)

    const times = Array.from({ length: 24 }).fill(0) as number[]

    useEffect(() => {
        const el = document.querySelector<HTMLDivElement>(`#time-${dayjs().hour()}`)

        if (wrapperEl.current && el) {
            wrapperEl.current.scrollTo({
                top: el.offsetTop - 200,
                behavior: 'smooth'
            })
        }

        calcNeedlePos()
        const interval = setInterval(() => calcNeedlePos(), 1000)

        return () => clearInterval(interval)
    }, [])

    const calcNeedlePos = () => {
        const time = dayjs()
        const hour = time.hour()
        const minute = time.minute()

        const hourPos = hour * 100
        const minutePos = 100 / (60 / minute)
        const finalPos = hourPos + minutePos

        setNeedlePos(finalPos)
    }

    return (
        <div className={classes.wrapper} ref={wrapperEl}>
            <div className={classes.timeWrapper}>
                {times.map((row, hour) => (
                    <Text className={classes.timeBox} id={`time-${hour}`} key={hour}>
                        {hour}:00
                    </Text>
                ))}
            </div>

            <div className={classes.innerWrapper}>
                {times.map((row, hour) => (
                    <div className={classes.timeBox} key={hour}></div>
                ))}

                <Box className={classes.needle} sx={{ top: needlePos }} />
            </div>
        </div>
    )
}

export default DashboardHomeTimeline

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            height: '100%',
            backgroundColor: isDark ? colors.dark[7] : theme.white,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            position: 'relative'
        },
        timeWrapper: {
            display: 'grid',
            gridTemplateRows: 'repeat(24, 100px)',
            textAlign: 'center'
        },
        innerWrapper: {
            position: 'relative',
            display: 'grid',
            gridTemplateRows: 'repeat(24, 100px)'
        },
        taskBox: {
            position: 'absolute',
            width: '100%',
            height: '80px',
            padding: '0 12px'
        },
        innerTaskBox: {
            backgroundColor: colors.blue[5],
            borderRadius: theme.radius.sm,
            padding: '2px',
            cursor: 'pointer'
        },
        timeBox: {
            width: '100%',
            height: '100%',
            borderTop: '1px solid',
            borderLeft: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[2]
        },
        needle: {
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: colors.blue[5]
        }
    }
})
