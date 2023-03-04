import * as fs from 'fs';
import * as path from 'path'
import bcrypt from 'bcrypt';

import { DataSource } from "typeorm";

import { initAppDataSource } from "./data-source";
import { User } from "./tables/User";
import { Shipper } from "./tables/Shipper";
import { Cart } from "./tables/Cart";
import { Delivery } from "./tables/Delivery";
import { DeliveryProposal } from "./tables/DeliveryProposal";
import { Product } from "./tables/Product";
import { Category } from "./tables/Category";
import { FeaturedProduct } from "./tables/FeaturedProduct";
import { OAuth } from './tables/OAuth';
import { TokenResponse } from './models/TokenResponse';
import { UserDefault } from './models/UserDefault';

export class DB {

    static AppDataSource: DataSource;

    static async initialize(dbPort: number) {
        console.log("Connexion à la base de donnée sur le port " + dbPort + "\n")
        this.AppDataSource = initAppDataSource(dbPort)
        await this.AppDataSource.initialize()
        .then(() => {
            console.log("Base de donnée initilaisée!\n")
        })
        .catch((error) => console.log(error))
    }

    // Fonction de test
    static async test() {
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.first_name = :first_name", { first_name: "John" })
        .getOne()
        return res
    }

    static async addUserAuth(accessToken: string, refreshToken: string, userId: number, expiresAt: number) {
        const oauth: OAuth = {
            user_id: userId,
            access_token: accessToken,
            expires_at: expiresAt,
            refresh_token: refreshToken
        }

        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(OAuth)
        .values(oauth)
        .execute()
    }

    static async storeAccessToken(token: string, userId: number, expiresAt: number) {
        return await this.AppDataSource
        .createQueryBuilder()
        .update(OAuth)
        .set({access_token: token, expires_at: expiresAt})
        .where("user_id = :user_id", {user_id: userId})
        .execute()
    }

    static async storeRefreshToken(token: string, userId: number){
        return await this.AppDataSource
        .createQueryBuilder()
        .update(OAuth)
        .set({refresh_token: token})
        .where("user_id = :user_id", {user_id: userId})
        .execute()
    }

    static async getAuthInfos(userId: number) {
        const res = await this.AppDataSource
        .getRepository(OAuth)
        .createQueryBuilder("oauth")
        .where("oauth.user_id = :id", { id: userId })
        .getOne()
        return res
    }

    /**
     * Pour toutes les fonctions de type get... voir la doc de TypeORM
     */
    public static async getUserByID(id: number): Promise<User | null> {
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getUserByEmail(email: string): Promise<User | null> {
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: email })
        .getOne()
        return res
    }

    public static async getShipperByID(id: number): Promise<Shipper | null> {
        const res = await this.AppDataSource
        .getRepository(Shipper)
        .createQueryBuilder("shipper")
        .where("shipper.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getCartByID(id: number): Promise<Cart | null> {
        const res = await this.AppDataSource
        .getRepository(Cart)
        .createQueryBuilder("cart")
        .where("cart.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getDeliveryByID(id: number): Promise<Delivery | null> {
        const res = await this.AppDataSource
        .getRepository(Delivery)
        .createQueryBuilder("delivery")
        .where("delivery.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getDeliveryProposalByID(id: number): Promise<DeliveryProposal | null> {
        const res = await this.AppDataSource
        .getRepository(DeliveryProposal)
        .createQueryBuilder("delivery_proposal")
        .where("delivery_proposal.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getProductByID(id: number): Promise<Product | null> {
        const res = await this.AppDataSource
        .getRepository(Product)
        .createQueryBuilder("product")
        .where("product.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getUsers(): Promise<User[] | null> {
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder()
        .getMany()
        return res
    }

    public static async getShippers(): Promise<Shipper[] | null> {
        const res = await this.AppDataSource
        .getRepository(Shipper)
        .createQueryBuilder()
        .getMany()
        return res
    }

    public static async getCarts(owner_id: number): Promise<Cart[] | null> {
        const res = await this.AppDataSource
        .getRepository(Cart)
        .createQueryBuilder("cart")
        .where("cart.owner_id = :owner_id", {owner_id: owner_id})
        .getMany()
        return res
    }

    public static async getDeliveries(shipper_id: number): Promise<Delivery[] | null> {
        const res = await this.AppDataSource
        .getRepository(Delivery)
        .createQueryBuilder("delivery")
        .where("delivery.shipper_id = :shipper_id", {shipper_id: shipper_id})
        .getMany()
        return res
    }

    public static async getDeliveryProposals(shipper_id: number): Promise<DeliveryProposal[] | null> {
        const res = await this.AppDataSource
        .getRepository(DeliveryProposal)
        .createQueryBuilder("delivery_proposal")
        .where("delivery_proposal.shipper_id = :shipper_id", {shipper_id: shipper_id})
        .getMany()
        return res
    }

    public static async getCategories(): Promise<Category[] | null> {
        const res = await this.AppDataSource
        .getRepository(Category)
        .createQueryBuilder()
        .getMany()
        return res
    }

    public static async getProducts(category_id: number): Promise<Product[] | null> {
        const res = await this.AppDataSource
        .getRepository(Product)
        .createQueryBuilder("product")
        .where("product.category_id = :category_id", {category_id: category_id})
        .getMany()
        return res
    }

    public static async getFeaturedProducts(): Promise<FeaturedProduct[] | null> {
        const res = await this.AppDataSource
        .getRepository(FeaturedProduct)
        .createQueryBuilder("featured_product")
        .leftJoinAndSelect("featured_product.product", "product")
        .getMany()
        return res
    }

    public static async getTokens(userId: number): Promise<TokenResponse | null> {
        const req = await this.AppDataSource
        .getRepository(OAuth)
        .createQueryBuilder("oauth")
        .where("oauth.user_id = :user_id", {user_id: userId})
        .getOne()
        
        if(req) {
            return {accessToken: req.access_token, refreshToken: req.refresh_token}
        } else {
            return null
        }

    }

    public static async addUser(user: UserDefault) {
        const req = await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .returning("id")
        .execute()

        const id: number = req.identifiers[0].id
        return id
    }

    public static async addShipper(shipper: Shipper) {
        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Shipper)
        .values(shipper)
        .execute()
    }

    public static async addCart(cart: Cart) {
        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Cart)
        .values(cart)
        .execute()
    }

    public static async addDeliveryProposal(delivery_proposal: DeliveryProposal) {
        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(DeliveryProposal)
        .values(delivery_proposal)
        .execute()
    }

    public static async addProduct(product: Product) {
        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(product)
        .execute()
    }


    // On lit un fichier JSON et on écrit ses données dans la BDD
    public static async writeFromJSON(tableName: string) {
        fs.readFile(path.join(__dirname, `../assets/json/${tableName}.json`), 'utf8', async (error, data: any) => {
            const parsedData = JSON.parse(data)[tableName]
            await this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(tableName)
                .values(parsedData)
                .execute()
        })
    }
}

