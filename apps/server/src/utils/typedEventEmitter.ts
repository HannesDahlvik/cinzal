import { Event } from '@prisma/client'
import EventEmitter from 'events'

type Events = {
    onEventCreate: Event
}

interface StringKeyedObject {
    [key: string]: unknown
}
interface TypedEventEmitter<C extends StringKeyedObject> extends EventEmitter {
    on<K extends Extract<keyof C, string>>(eventName: K, listener: (arg: C[K]) => void): this
    once<K extends Extract<keyof C, string>>(eventName: K, listener: (arg: C[K]) => void): this
    off<K extends Extract<keyof C, string>>(eventName: K, listener: (arg: C[K]) => void): this
    emit<K extends Extract<keyof C, string>>(eventName: K, arg: C[K]): boolean
}

export const ee: TypedEventEmitter<Events> = new EventEmitter()
