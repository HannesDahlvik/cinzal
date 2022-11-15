export interface UserData {
    id: number
    uuid: string
    username: string
    email: string
    redirectDashboard: boolean
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
    user: UserData
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

export interface Calendar {
    id: number
    name: string
    url: string
    uuid: string
}

export interface DashboardSidebarLinks {
    title: string
    path: string
    icon: React.ReactNode
    iconActive: React.ReactNode
}
