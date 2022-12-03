import { DasboardTimelineCheckEvents } from '../config/types'

export const timelineGetAttributes = (
    events: DasboardTimelineCheckEvents[],
    collisions: number[][]
) => {
    let width: number[] = []
    let leftOffSet: number[] = []

    for (let i = 0; i < events.length; i++) {
        width.push(0)
        leftOffSet.push(0)
    }

    collisions.forEach((period) => {
        const count = period.reduce((a, b) => (b ? a + 1 : a))

        if (count > 1)
            period.forEach((_, i) => {
                if (period[i] && count > width[i]) width[i] = count

                if (period[i] && !leftOffSet[i]) {
                    leftOffSet[i] = period[i]
                }
            })
    })

    return { width, leftOffSet }
}
