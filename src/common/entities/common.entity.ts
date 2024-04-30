import { Expose } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  AfterInsert,
  AfterRemove,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
} from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({
    comment: '创建时间',
    type: 'timestamp',
    nullable: true,
  })
  @Expose()
  createdAt: Date;

  @Column({
    comment: '创建者',
    nullable: true,
  })
  createdBy: number;

  @Column({
    comment: '修改时间',
    type: 'timestamp',
    nullable: true,
  })
  @Expose()
  updatedAt: Date;

  @Column({
    comment: '修改者',
    nullable: true,
  })
  updatedBy: number;

  @Column({
    comment: '删除时间',
    type: 'timestamp',
    nullable: true,
  })
  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    comment: '删除者',
    nullable: true,
  })
  deletedBy: number;

  @BeforeInsert()
  setCreatedAt() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }


}
