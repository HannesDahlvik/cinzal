import { hookstate } from '@hookstate/core'

const drawers = {
    homeRightDrawer: hookstate(false),
    homeLeftDrawer: hookstate(false),
    notesDrawer: hookstate(false)
}

export default drawers
