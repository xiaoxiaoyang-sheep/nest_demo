import { Role } from "../common/enum/roles.enum"
import { Logs } from "../modules/logs/logs.entity"
import { User } from "../modules/user/user.entity"

export const getEntities = (path: string) => {
    const map = {
        '/user': User,
        '/logs': Logs,
        '/roles': Role,
    }

    for(let key in map) {
        if(key === path) {
            return map[key]
        }
    }
}