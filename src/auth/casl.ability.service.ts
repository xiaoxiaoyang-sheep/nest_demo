import { Injectable } from "@nestjs/common";
import { AbilityBuilder, ExtractSubjectType, createMongoAbility } from "@casl/ability"
import { Logs } from "../logs/logs.entity";
import { UserService } from "../user/user.service";
import { getEntities } from "../utils/common";

@Injectable()
export class CaslAbilityService {

    constructor(private userService: UserService) {}

    async forRoot(username: string) {
        // 针对整个系统
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

        // menu 名称、路径、acl -> actions -> 名称、路径 -> 实体对应
        // path -> prefix -> 写死在项目里

        // 其它思路： acl -> 表来进行存储 -> LogController + Action
        // Log -> sys:log -> sys:log:read, sys:log:update ...
        const user = await this.userService.find(username)
        // user -> 1:n roles -> 1:n meanu -> 去重
        user.roles.forEach(role => {
            role.menus.forEach(menu => {
                // path -> acl -> actions
                const actions = menu.acl.split(',')
                // todo 去重
                for(let action of actions) {
                    can(action, getEntities(menu.path))
                }
            })
        })
        
        can('update', Logs, 'path', )
        
        const ability = build({
            detectSubjectType: (object) => object.constructor as ExtractSubjectType<any>
        })

        // ablilty.can
        // @CheckPolicies((ability) => ablility.cannot(Action, User, ['']))

        return ability
    }
}