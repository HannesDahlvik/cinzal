import { IEvent } from '../../../state'

import { Button, createStyles, Group, Text } from '@mantine/core'
import { closeAllModals, openConfirmModal } from '@mantine/modals'
import { MapPin, TextAlignLeft } from 'phosphor-react'

import dayjs from 'dayjs'
import { errorHandler, trpc } from '../../../utils'

interface Props {
    event: IEvent
}

const DashboardEventInfoModal: React.FC<Props> = ({ event }) => {
    const { classes } = useStyles()

    const tu = trpc.useContext()
    const deleteEventMutation = trpc.events.delete.useMutation()

    const handleClose = () => {
        closeAllModals()
    }

    const handleDeleteEvent = () => {
        openConfirmModal({
            title: `Are you sure you want to delete "${event.summary || event.title}"`,
            labels: { cancel: 'No', confirm: 'Yes' },
            cancelProps: { variant: 'outline' },
            onCancel: () => handleClose(),
            onConfirm: () => {
                deleteEventMutation.mutate(
                    {
                        id: event.id
                    },
                    {
                        onError: (err) => {
                            errorHandler(err.message)
                            handleClose()
                        },
                        onSuccess: () => {
                            handleClose()
                            tu.events.all.invalidate()
                        }
                    }
                )
            }
        })
    }

    return (
        <>
            <Text mb="md">
                {dayjs(event.dtstamp).format('dddd, DD MMMM - ')}
                {dayjs(event.start).format('HH:mm')}
                {' - '}
                {dayjs(event.end).format('HH:mm')}
            </Text>

            <div className={classes.wrapper}>
                <div className={classes.icon}>
                    <MapPin weight="fill" />
                </div>

                <Text>
                    {event.location}

                    {!event.location && 'No location'}
                </Text>

                <div className={classes.icon}>
                    <TextAlignLeft weight="fill" />
                </div>

                <Text>
                    {event.description}

                    {!event.description && 'No description'}
                </Text>
            </div>

            {event.type !== 'VEVENT' && (
                <Group position="right" mt="md">
                    <Button color="red" variant="outline" onClick={handleDeleteEvent}>
                        Delete
                    </Button>
                </Group>
            )}
        </>
    )
}

export default DashboardEventInfoModal

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '24px 1fr',
            gap: '20px'
        },
        icon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '24px',

            svg: {
                width: '24px',
                height: '24px'
            }
        }
    }
})
