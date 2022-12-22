import { DasboardTimelineCheckEvents } from '../config/types'

export const timelineGetCollisions = (events: DasboardTimelineCheckEvents[]) => {
    let collisions: number[][] = []

    for (let i = 0; i < 48; i++) {
        const time = []
        for (let j = 0; j < events.length; j++) time.push(0)
        collisions.push(time)
    }

    events.forEach((event, id) => {
        const end = event.end
        let start = event.start
        let order = 1

        while (start < end) {
            const timeIndex = Math.floor(start / 30)

            while (order < events.length) {
                if (collisions[timeIndex].indexOf(order) === -1) break
                order++
            }

            collisions[timeIndex][id] = order
            start = start + 30
        }

        collisions[Math.floor((end - 1) / 30)][id] = order
    })

    return collisions
}
