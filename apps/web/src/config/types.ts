import ical from 'node-ical'

export interface UserData {
    id: number
    uuid: string
    username: string
    email: string
    redirectDashboard: boolean
    calendarView: string
    createdAt: Date
    updatedAt: Date
}

export interface Task {
    id: number
    title: string
    description: string
    deadline: Date
    completed: boolean
    color: string
    uuid: String
    createdAt: Date
    updatedAt: Date
}

export interface Event {
    id: number
    title: string
    start: Date
    end: Date
    location: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    uuid: string
}

export type IEvent = ical.VEvent & Event

export interface Calendar {
    id: number
    name: string
    url: string
    uuid: string
    show: boolean
}

export type CalendarViews = 'month' | 'week'

export interface DashboardSidebarLinks {
    title: string
    path: string
    icon: React.ReactNode
    iconActive: React.ReactNode
}

export interface DasboardTimelineCheckEvents {
    start: number
    end: number
}
