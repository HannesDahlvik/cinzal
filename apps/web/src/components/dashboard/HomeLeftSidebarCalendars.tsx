import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Box, Menu, Stack, Text } from '@mantine/core'
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals'
import { DotsThreeOutlineVertical, PencilSimple, Plus, TrashSimple } from 'phosphor-react'

import DashboardAddCalendarModal from './AddCalendarModal'

import { errorHandler, trpc } from '../../utils'
import DashboaredEditCalendarModal from './EditCalendarModal'

const HomeLeftSidebarCalendars: React.FC = () => {
    const trpcUtils = trpc.useContext()
    const deleteCalendarMutation = trpc.calendar.deleteCalendar.useMutation()

    const { value: calendars } = useHookstate(state.data.calendars)

    const handleAddCalendar = () => {
        openModal({
            title: 'Add calendar from URL',
            children: <DashboardAddCalendarModal />
        })
    }

    const handleEditCalendar = (calendar: any) => {
        openModal({
            title: 'Edit',
            children: <DashboaredEditCalendarModal calendar={calendar} />
        })
    }

    const handleDeleteCalendar = (calendar: any) => {
        openConfirmModal({
            title: 'Are you sure you want to delete',
            labels: { cancel: 'Cancel', confirm: 'Delete' },
            onConfirm: () => {
                deleteCalendarMutation.mutate(
                    {
                        id: calendar.id
                    },
                    {
                        onError: (err) => {
                            errorHandler(err.message)
                        },
                        onSuccess: () => {
                            closeAllModals()
                            trpcUtils.calendar.getICalLinks.invalidate()
                        }
                    }
                )
            }
        })
    }

    return (
        <Stack mt="md" px="xl" sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text weight="bold">Calendars</Text>
                <Plus cursor="pointer" size={20} onClick={handleAddCalendar} />
            </Box>

            {calendars.map((row, i) => (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} key={i}>
                    <Text>{row.name}</Text>
                    <Menu position="right" withArrow>
                        <Menu.Target>
                            <DotsThreeOutlineVertical cursor="pointer" size={20} />
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                icon={<PencilSimple />}
                                onClick={() => handleEditCalendar(row)}
                            >
                                Edit
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                icon={<TrashSimple />}
                                onClick={() => handleDeleteCalendar(row)}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Box>
            ))}
        </Stack>
    )
}

export default HomeLeftSidebarCalendars
