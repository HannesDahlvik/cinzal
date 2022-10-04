import config from '../config'

import jwt from 'jsonwebtoken'

const verifyJwtToken = (token: string | undefined) => {
    if (token) {
        return jwt.verify(token, config.jwtSecret)
    } else {
        return null
    }
}

export default verifyJwtToken
