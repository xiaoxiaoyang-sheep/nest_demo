import { Role } from "src/enum/roles.enum"
import { Logs } from "src/logs/logs.entity"
import { User } from "src/user/user.entity"

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