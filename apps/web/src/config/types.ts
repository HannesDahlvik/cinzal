export interface UserData {
    uuid: string
    username: string
    email: string
    createdAt: Date
    updatedAt: Date
}

export interface Task {
    id: number
    title: string
    description: string
    deadline: Date
    completed: boolean
    uuid: String
    user: UserData
    createdAt: Date
    updatedAt: Date
}

export interface DashboardSidebarLinks {
    title: string
    path: string
    icon: React.ReactNode
    iconActive: React.ReactNode
}
