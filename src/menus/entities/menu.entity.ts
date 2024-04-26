import { Roles } from "../../roles/roles.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Menu {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    path: string;

    @Column()
    order: number;

    // 不要通过string存数组
    // 这里只有5个操作策略
    // CREAT, REAT, UPDATE, DELETE, MANAGE
    @Column()
    acl: string;

    @ManyToMany(() => Roles, (role) => role.menus)
    @JoinTable({name: 'role_menus'})
    role: Roles
}
