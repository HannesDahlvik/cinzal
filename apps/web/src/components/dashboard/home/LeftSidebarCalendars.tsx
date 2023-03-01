import { Calendar } from '../../../config/types'

import { Box, Button, Group, Menu, Stack, Text } from '@mantine/core'
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals'
import {
    DotsThreeOutlineVertical,
    Eye,
    EyeSlash,
    PencilSimple,
    Plus,
    TrashSimple
} from 'phosphor-react'

import DashboardAddCalendarModal from '../modals/AddCalendar'

import { errorHandler, trpc } from '../../../utils'
import DashboaredEditCalendarModal from '../modals/EditCalendar'

interface Props {
    calendars: Calendar[]
}

const HomeLeftSidebarCalendars: React.FC<Props> = ({ calendars }) => {
    const tu = trpc.useContext()
    const editCalendarMutation = trpc.calendar.edit.useMutation()
    const deleteCalendarMutation = trpc.calendar.delete.useMutation()

    const handleEditShowCalendar = (calendar: Calendar) => {
        editCalendarMutation.mutate(
            {
                ...calendar,
                show: !calendar.show
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                },
                onSuccess: () => {
                    tu.calendar.links.invalidate()
                }
            }
        )
    }

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

    const handleDeleteCalendar = (calendar: Calendar) => {
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
                            tu.calendar.links.invalidate()
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

            {calendars.length === 0 && (
                <Text align="center" mt="md">
                    You have not added any calendars
                </Text>
            )}

            {calendars.map((row, i) => (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} key={i}>
                    <Text>{row.name}</Text>

                    <Group>
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
                                <Menu.Item
                                    icon={row.show ? <EyeSlash /> : <Eye />}
                                    onClick={() => handleEditShowCalendar(row)}
                                >
                                    {row.show ? 'Hide' : 'Show'}
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
                    </Group>
                </Box>
            ))}
        </Stack>
    )
}

export default HomeLeftSidebarCalendars
