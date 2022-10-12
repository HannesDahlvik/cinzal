import { Navigate } from 'react-router-dom'

import { useHookstate } from '@hookstate/core'
import state from '../state'

interface Props {
    children: JSX.Element
}

const RequireAuth: React.FC<Props> = ({ children }: Props) => {
    const { value: token } = useHookstate(state.auth.token)

    if (!token) return <Navigate to="/login" />
    else return children
}

export default RequireAuth
