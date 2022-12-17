import { hookstate } from '@hookstate/core'

const drawers = {
    homeRightDrawer: hookstate(false),
    homeLeftDrawer: hookstate(false)
}

export default drawers
