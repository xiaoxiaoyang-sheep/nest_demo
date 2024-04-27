import { Role } from "../enum/roles.enum"
import { Logs } from "../logs/logs.entity"
import { User } from "../user/user.entity"

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