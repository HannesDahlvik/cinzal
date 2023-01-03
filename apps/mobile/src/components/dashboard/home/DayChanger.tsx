import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import dayjs from 'dayjs'
import { Button, Flex, Text } from 'native-base'
import { CaretLeft, CaretRight } from 'phosphor-react-native'

const DashboardHomeDayChanger: React.FC = () => {
    const { value: globalDate, set: setGlobalDate } = useHookstate(state.date)

    const handlePrevDay = () => {
        setGlobalDate(globalDate.clone().subtract(1, 'day'))
    }

    const handleNextDayy = () => {
        setGlobalDate(globalDate.clone().add(1, 'day'))
    }

    const handleReset = () => {
        const d = new Date()
        setGlobalDate(dayjs(d))
    }

    return (
        <Flex
            flexDir="row"
            justify="space-between"
            align="center"
            h="60px"
            w="100%"
            px="2"
            borderBottomWidth={1}
            borderBottomColor="dark.400"
        >
            <Button variant="ghost" onPress={handlePrevDay}>
                <CaretLeft weight="bold" />
            </Button>

            <Flex align="center">
                <Text fontWeight="bold" fontSize="md" onPress={handleReset}>
                    {globalDate.date()} {dayjs.months()[globalDate.month()]} {globalDate.year()}
                </Text>
                <Text onPress={handleReset}>{globalDate.format('dddd')}</Text>
            </Flex>

            <Button variant="ghost" onPress={handleNextDayy}>
                <CaretRight weight="bold" />
            </Button>
        </Flex>
    )
}

export default DashboardHomeDayChanger
