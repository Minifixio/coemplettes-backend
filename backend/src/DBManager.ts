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
import { CartItem } from './tables/CartItem';

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

        console.log("[DBManager] Ajout d\'informations d\'auth pour le user n°'" + userId)
        console.log(oauth)
        console.log('\n')

        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(OAuth)
        .values(oauth)
        .execute()
    }

    static async storeAccessToken(token: string, userId: number, expiresAt: number) {
        console.log("[DBManager] Sauvegarde de l'access token dans la BDD")
        return await this.AppDataSource
        .createQueryBuilder()
        .update(OAuth)
        .set({access_token: token, expires_at: expiresAt})
        .where("user_id = :user_id", {user_id: userId})
        .execute()
    }

    static async storeRefreshToken(token: string, userId: number){
        console.log("[DBManager] Sauvegarde du refresh token dans la BDD")
        return await this.AppDataSource
        .createQueryBuilder()
        .update(OAuth)
        .set({refresh_token: token})
        .where("user_id = :user_id", {user_id: userId})
        .execute()
    }

    static async getAuthInfos(userId: number) {
        console.log("[DBManager] Récupération des infos d'auth pour le user n°" + userId + " dans la BDD")
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
        console.log("[DBManager] Récupération des infos d'user n°" + id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getUserByEmail(email: string): Promise<User | null> {
        console.log("[DBManager] Récupération des infos pour : " + email + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: email })
        .getOne()
        return res
    }

    public static async getShipperByID(userId: number): Promise<Shipper | null> {
        console.log("[DBManager] Récupération des infos de shipper pour le user_id n°" + userId + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Shipper)
        .createQueryBuilder("shipper")
        .where("shipper.user_id = :user_id", { user_id: userId })
        .getOne()
        return res
    }

    public static async getCartByID(id: number): Promise<Cart | null> {
        console.log("[DBManager] Récupération des infos de la cart n°" + id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Cart)
        .createQueryBuilder("cart")
        .where("cart.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getDeliveryByID(id: number): Promise<Delivery | null> {
        console.log("[DBManager] Récupération des infos de la delivery n°" + id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Delivery)
        .createQueryBuilder("delivery")
        .where("delivery.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getDeliveryProposalByID(id: number): Promise<DeliveryProposal | null> {
        console.log("[DBManager] Récupération des infos de la delivery proposal n°" + id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(DeliveryProposal)
        .createQueryBuilder("delivery_proposal")
        .where("delivery_proposal.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getProductByID(id: number): Promise<Product | null> {
        console.log("[DBManager] Récupération des infos du produit n°" + id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Product)
        .createQueryBuilder("product")
        .where("product.id = :id", { id: id })
        .getOne()
        return res
    }

    public static async getUsers(): Promise<User[] | null> {
        console.log("[DBManager] Récupération de tous les users dans la BDD")
        const res = await this.AppDataSource
        .getRepository(User)
        .createQueryBuilder()
        .getMany()
        return res
    }

    public static async getShippers(): Promise<Shipper[] | null> {
        console.log("[DBManager] Récupération de tous les shippers dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Shipper)
        .createQueryBuilder()
        .getMany()
        return res
    }

    public static async getCarts(owner_id: number): Promise<Cart[] | null> {
        console.log("[DBManager] Récupération des carts pour le user n°" + owner_id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Cart)
        .createQueryBuilder("cart")
        .where("cart.owner_id = :owner_id", {owner_id: owner_id})
        .getMany()
        return res
    }

    public static async getUnattributedCarts(): Promise<Cart[]> {
        console.log("[DBManager] Récupération des carts non attribués dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Cart)
        .createQueryBuilder("cart")
        .where("cart.delivery_proposal_id = :delivery_proposal_id", {delivery_proposal_id: null})
        .orderBy("cart.deadline", "ASC")
        .getMany()
        return res
    }
    
    public static async getTimeSlots() {
        console.log("[DBManager] Récupération des crénaux horaires dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Shipper)
        .createQueryBuilder("shipper")
        .select("shipper.disponibilities, shipper.id, shipper.price_max")
        .where("shipper.disponibilities <> :disponibilities", {disponibilities: null})
        .getMany()
        return res
    }

    public static async getDeliveries(shipper_id: number): Promise<Delivery[] | null> {
        console.log("[DBManager] Récupération des deliveries pour le shipper n°" + shipper_id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Delivery)
        .createQueryBuilder("delivery")
        .where("delivery.shipper_id = :shipper_id", {shipper_id: shipper_id})
        .getMany()
        return res
    }

    public static async getDeliveryProposals(shipper_id: number): Promise<DeliveryProposal[] | null> {
        console.log("[DBManager] Récupération des delivery proposals pour le shipper n°" + shipper_id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(DeliveryProposal)
        .createQueryBuilder("delivery_proposal")
        .where("delivery_proposal.shipper_id = :shipper_id", {shipper_id: shipper_id})
        .getMany()
        return res
    }

    public static async getCategories(): Promise<Category[] | null> {
        console.log("[DBManager] Récupération des categories dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Category)
        .createQueryBuilder()
        .getMany()
        return res
    }

    public static async getProducts(category_id: number): Promise<Product[] | null> {
        console.log("[DBManager] Récupération des produits pour la catégorie n°" + category_id + " dans la BDD")
        const res = await this.AppDataSource
        .getRepository(Product)
        .createQueryBuilder("product")
        .where("product.category_id = :category_id", {category_id: category_id})
        .getMany()
        return res
    }

    public static async getFeaturedProducts(): Promise<FeaturedProduct[] | null> {
        console.log("[DBManager] Récupération des produits phares dans la BDD")
        const res = await this.AppDataSource
        .getRepository(FeaturedProduct)
        .createQueryBuilder("featured_product")
        .leftJoinAndSelect("featured_product.product", "product")
        .getMany()
        return res
    }

    public static async getTokens(userId: number): Promise<TokenResponse | null> {
        console.log("[DBManager] Récupération des tokens pour le user n°" + userId + " dans la BDD")
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
        console.log("[DBManager] Ajout du user :")
        console.log(user)
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
        console.log("[DBManager] Ajout du shipper :")
        console.log(shipper)

        const shipperFound = await this.AppDataSource
        .getRepository(Shipper)
        .createQueryBuilder("shipper")
        .where("shipper.user_id = :user_id", { user_id: shipper.user_id })
        .getOne()

        if (shipperFound === null) {
            await this.AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Shipper)
            .values(shipper)
            .execute()
        } else {
            await this.AppDataSource
            .createQueryBuilder()
            .update(Shipper)
            .set(shipper)
            .where("user_id = :user_id", { user_id: shipper.user_id })
            .execute()
        }


    }

    public static async addCart(cart: Cart, cartItems: CartItem[]) {
        console.log("[DBManager] Ajout de la cart :")
        console.log(cart)
        cart.status=0;
        // calcul du prix total moyen
        let total = 0;
        cartItems.forEach(item => {
            total += item.product.average_price * item.quantity;
        });
        cart.average_price = total;

        const req = await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Cart)
        .values(cart)
        .returning("id")
        .execute()

        const cartId: number = req.identifiers[0].id
        cartItems.map(item => {item.cart_id = cartId})

        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(CartItem)
        .values(cartItems)
        .execute()
    }

    public static async addDeliveryProposal(delivery_proposal: DeliveryProposal) {
        console.log("[DBManager] Ajout de la delivery proposal :")
        console.log(delivery_proposal)
        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(DeliveryProposal)
        .values(delivery_proposal)
        .execute()
    }

    public static async addProduct(product: Product) {
        console.log("[DBManager] Ajout du produit :")
        console.log(product)
        await this.AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(product)
        .execute()
    }

    public static async updateCartStatus(cartId: number, status: number) {
        console.log("[DBManager] Mise à jour du status de la cart n°" + cartId + " dans la BDD")
        await this.AppDataSource
        .createQueryBuilder()
        .update(Cart)
        .set({status: status})
        .where("id = :id", {id: cartId})
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

