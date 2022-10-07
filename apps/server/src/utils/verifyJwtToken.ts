import config from '../config'
import { VerifyDecoded } from '../config/types'

import jwt from 'jsonwebtoken'

const verifyJwtToken = (token: string | undefined): null | VerifyDecoded => {
    if (token) {
        const data = jwt.verify(token, config.jwtSecret)
        return data as VerifyDecoded
    } else {
        return null
    }
}

export default verifyJwtToken
