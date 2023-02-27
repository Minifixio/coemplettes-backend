import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm"

@Entity({name: "shippers"})
export class Shipper {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "int", nullable:false })
    user_id!: number

    @Column({ type: "int", nullable:false })
    capacity!: number

    @Column({ type: "boolean", nullable:false })
    has_car!: boolean

    @Column({ type: "int", nullable:true })
    deliveries_count!: number

    @Column({ type: "int", nullable:false })
    price_max!: number

    @Column({ type: "float", nullable:true })
    loc_long!: number

    @Column({ type: "float", nullable:true })
    loc_lat!: number

    @Column({ type: "varchar", nullable:true })
    drive!: string

    @Column({ type: "boolean", nullable:true })
    shop!: boolean

    @Column({ type: "varchar", nullable:true })
    disponibilities!: string
}