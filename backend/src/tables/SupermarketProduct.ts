import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm"
import { Product } from "./Product"
import { Supermarket } from "./Supermarket"

@Entity({name: "supermarket_products"})
export class SupermarketProduct {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "int", nullable:false })
    product_id!: number

    // Liste provisoire des supermarchés : Cora Massy, Leclerc Massy, Auchan Villebon-sur-Yvette, Intermarché du Moulon ?
    @Column({ type: "int", nullable:false })
    supermarket_id!: number

    @Column({ type: "float", nullable:false })
    price!: number

    @Column({ type: "boolean", nullable:true })
    is_available!: boolean

    @ManyToOne(type => Product, product => product)
    @JoinColumn(
        { name: 'product_id', referencedColumnName: 'id'}
    )
    product!: Product

    @ManyToOne(type => Supermarket, supermarket => supermarket)
    @JoinColumn(
        { name: 'supermarket_id', referencedColumnName: 'id'}
    )
    supermarket!: Supermarket
}