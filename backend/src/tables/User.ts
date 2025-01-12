import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { UserInterface } from "../models/User"
import { Cart } from "./Cart"
import { Shipper } from "./Shipper"

@Entity({name: "users"})
export class User implements UserInterface {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 25, nullable:false })
    first_name!: string

    @Column({ type: "varchar", length: 25, nullable:false })
    last_name!: string

    @Column({ type: "varchar", length: 100, nullable:false })
    school!: string

    @Column({ type: "varchar", length: 100, nullable:false })
    email!: string

    @Column({ type: "varchar", length: 100, nullable:false })
    phone!: string

    @Column({ type: "varchar", length: 200, nullable:false })
    pwdhash!: string

    @OneToOne(() => Shipper, (shipper) => shipper.user)
    shipper!: Shipper

    @OneToMany(() => Cart, (cart) => cart.owner)
    carts!: Cart[]
}