"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const data_source_1 = require("./data-source");
const User_1 = require("./tables/User");
const Shipper_1 = require("./tables/Shipper");
const Cart_1 = require("./tables/Cart");
const Delivery_1 = require("./tables/Delivery");
const DeliveryProposal_1 = require("./tables/DeliveryProposal");
const Product_1 = require("./tables/Product");
const Category_1 = require("./tables/Category");
const FeaturedProduct_1 = require("./tables/FeaturedProduct");
const OAuth_1 = require("./tables/OAuth");
const CartItem_1 = require("./tables/CartItem");
const LockerManager_1 = require("./LockerManager");
class DB {
    static initialize(dbPort) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Connexion à la base de donnée sur le port " + dbPort + "\n");
            this.AppDataSource = (0, data_source_1.initAppDataSource)(dbPort);
            yield this.AppDataSource.initialize()
                .then(() => {
                console.log("Base de donnée initilaisée!\n");
            })
                .catch((error) => console.log(error));
        });
    }
    // Fonction de test
    static test() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.AppDataSource
                .getRepository(User_1.User)
                .createQueryBuilder("user")
                .where("user.first_name = :first_name", { first_name: "John" })
                .getOne();
            return res;
        });
    }
    static addUserAuth(accessToken, refreshToken, userId, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const oauth = {
                user_id: userId,
                access_token: accessToken,
                expires_at: expiresAt,
                refresh_token: refreshToken
            };
            console.log("[DBManager] Ajout d\'informations d\'auth pour le user n°'" + userId);
            console.log(oauth);
            console.log('\n');
            yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(OAuth_1.OAuth)
                .values(oauth)
                .execute();
        });
    }
    static storeAccessToken(token, userId, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Sauvegarde de l'access token dans la BDD");
            return yield this.AppDataSource
                .createQueryBuilder()
                .update(OAuth_1.OAuth)
                .set({ access_token: token, expires_at: expiresAt })
                .where("user_id = :user_id", { user_id: userId })
                .execute();
        });
    }
    static storeRefreshToken(token, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Sauvegarde du refresh token dans la BDD");
            return yield this.AppDataSource
                .createQueryBuilder()
                .update(OAuth_1.OAuth)
                .set({ refresh_token: token })
                .where("user_id = :user_id", { user_id: userId })
                .execute();
        });
    }
    static getAuthInfos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos d'auth pour le user n°" + userId + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(OAuth_1.OAuth)
                .createQueryBuilder("oauth")
                .where("oauth.user_id = :id", { id: userId })
                .getOne();
            return res;
        });
    }
    /**
     * Pour toutes les fonctions de type get... voir la doc de TypeORM
     */
    static getUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos d'user n°" + id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(User_1.User)
                .createQueryBuilder("user")
                .where("user.id = :id", { id: id })
                .getOne();
            return res;
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos pour : " + email + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(User_1.User)
                .createQueryBuilder("user")
                .where("user.email = :email", { email: email })
                .getOne();
            return res;
        });
    }
    static getShipperByID(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos de shipper pour le user_id n°" + userId + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Shipper_1.Shipper)
                .createQueryBuilder("shipper")
                .where("shipper.user_id = :user_id", { user_id: userId })
                .getOne();
            return res;
        });
    }
    static getCartByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos de la cart n°" + id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.id = :id", { id: id })
                .getOne();
            return res;
        });
    }
    static getDeliveryByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos de la delivery n°" + id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Delivery_1.Delivery)
                .createQueryBuilder("delivery")
                .where("delivery.id = :id", { id: id })
                .getOne();
            return res;
        });
    }
    static getDeliveryDeadline(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de la deadline de la delivery n°" + id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.delivery_id = :id", { id: id })
                .orderBy('cart.deadline', 'DESC')
                .getOne();
            return ((res === null || res === void 0 ? void 0 : res.deadline) ? res === null || res === void 0 ? void 0 : res.deadline : null);
        });
    }
    static getDeliveryProposalByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos de la delivery proposal n°" + id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(DeliveryProposal_1.DeliveryProposal)
                .createQueryBuilder("delivery_proposal")
                .where("delivery_proposal.id = :id", { id: id })
                .getOne();
            return res;
        });
    }
    static getProductByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des infos du produit n°" + id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Product_1.Product)
                .createQueryBuilder("product")
                .where("product.id = :id", { id: id })
                .getOne();
            return res;
        });
    }
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de tous les users dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(User_1.User)
                .createQueryBuilder()
                .getMany();
            return res;
        });
    }
    static getShippers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de tous les shippers dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Shipper_1.Shipper)
                .createQueryBuilder()
                .getMany();
            return res;
        });
    }
    static getAvailableShippers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de tous les shippers disponibles dans la BDD");
            let shippers = yield this.AppDataSource
                .getRepository(Shipper_1.Shipper)
                .createQueryBuilder("shipper")
                .leftJoinAndSelect("shipper.deliveries", "deliveries")
                .getMany();
            const res = [];
            for (let shipper of shippers) {
                if (shipper.deliveries.length === 0) {
                    res.push(shipper);
                }
                else {
                    if (shipper.deliveries.every(delivery => delivery.status > 3)) {
                        res.push(shipper);
                    }
                }
            }
            return shippers;
        });
    }
    static getCarts(owner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des carts pour le user n°" + owner_id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.owner_id = :owner_id", { owner_id: owner_id })
                .getMany();
            return res;
        });
    }
    static getCurrentCart(owner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de la cart courante pour le user n°" + owner_id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .leftJoinAndSelect("cart.delivery", "delivery")
                .leftJoinAndSelect("delivery.shipper", "shipper")
                .leftJoinAndSelect("shipper.user", "user")
                .leftJoinAndSelect("cart.delivery_proposal", "delivery_proposal")
                .leftJoinAndSelect("cart.items", "item")
                .leftJoinAndSelect("item.product", "product")
                .where("cart.owner_id = :owner_id", { owner_id: owner_id })
                .getOne();
            return res;
        });
    }
    static getUnattributedCarts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des carts non attribués dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.status = :status", { status: 0 })
                .orderBy("cart.deadline", "ASC") // les carts les plus urgentes en premier
                .getMany();
            return res;
        });
    }
    static getTimeSlots() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des crénaux horaires dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Shipper_1.Shipper)
                .createQueryBuilder("timeSlot")
                .select("shipper.disponibilities, shipper.id, shipper.price_max")
                .where("shipper.disponibilities <> :disponibilities", { disponibilities: null })
                .getMany();
            return res;
        });
    }
    static getDeliveries(shipper_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des deliveries pour le shipper n°" + shipper_id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Delivery_1.Delivery)
                .createQueryBuilder("delivery")
                .leftJoinAndSelect("delivery.shipper", "shipper")
                .where("delivery.shipper_id = :shipper_id", { shipper_id: shipper_id })
                .getMany();
            return res;
        });
    }
    static getCurrentDelivery(shipper_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de la delivery courante pour le shipper n°" + shipper_id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Delivery_1.Delivery)
                .createQueryBuilder("delivery")
                .leftJoinAndSelect("delivery.shipper", "shipper")
                .where("delivery.shipper_id = :shipper_id", { shipper_id: shipper_id })
                .getOne();
            return res;
        });
    }
    static getDeliverySummary(shipper_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération du recap de la livraison pour le shipper n°" + shipper_id + " dans la BDD");
            const delivery = yield this.AppDataSource
                .getRepository(Delivery_1.Delivery)
                .createQueryBuilder("delivery")
                .where("delivery.shipper_id = :shipper_id", { shipper_id: shipper_id })
                .where("delivery.status != :status", { status: 4 })
                .leftJoinAndSelect("delivery.shipper", "shipper")
                .leftJoinAndSelect("delivery.carts", "cart")
                .leftJoinAndSelect("cart.items", "item")
                .leftJoinAndSelect("item.product", "product")
                .leftJoinAndSelect("cart.owner", "owner")
                .leftJoinAndSelect("shipper.user", "user")
                .getOne();
            return delivery;
        });
    }
    static getDeliveryProposalSummary(deliveryProposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération du recap de la proposition livraison n°" + deliveryProposalId + " dans la BDD");
            const deliveryProposals = yield this.AppDataSource
                .getRepository(DeliveryProposal_1.DeliveryProposal)
                .createQueryBuilder("delivery_proposal")
                .where("delivery_proposal.id = :id", { id: deliveryProposalId })
                .leftJoinAndSelect("delivery_proposal.shipper", "shipper")
                .leftJoinAndSelect("delivery_proposal.carts", "cart")
                .leftJoinAndSelect("cart.items", "item")
                .leftJoinAndSelect("item.product", "product")
                .leftJoinAndSelect("cart.owner", "owner")
                .leftJoinAndSelect("shipper.user", "user")
                .orderBy('delivery_proposal.creation_date', 'ASC')
                .getOne();
            return deliveryProposals;
        });
    }
    static getDeliveryProposals(shipper_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des delivery proposals pour le shipper n°" + shipper_id + " dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(DeliveryProposal_1.DeliveryProposal)
                .createQueryBuilder("delivery_proposal")
                .where("delivery_proposal.shipper_id = :shipper_id", { shipper_id: shipper_id })
                .getMany();
            return res;
        });
    }
    static getDeliveryProposalsNextID() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération de l'ID max des delivery proposals");
            const res = yield this.AppDataSource
                .getRepository(DeliveryProposal_1.DeliveryProposal)
                .createQueryBuilder("delivery_proposal")
                .orderBy('delivery_proposal.id', 'DESC')
                .getOne();
            return ((res === null || res === void 0 ? void 0 : res.id) ? res === null || res === void 0 ? void 0 : res.id : 0);
        });
    }
    static getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des categories dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(Category_1.Category)
                .createQueryBuilder()
                .getMany();
            return res;
        });
    }
    static getProducts(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des produits pour la catégorie n°" + category_id + " dans la BDD");
            const category = yield this.AppDataSource
                .getRepository(Category_1.Category)
                .createQueryBuilder("category")
                .where("category.id = :id", { id: category_id })
                .getOne();
            if ((category === null || category === void 0 ? void 0 : category.name) === "Bio") {
                const res = yield this.AppDataSource
                    .getRepository(Product_1.Product)
                    .createQueryBuilder("product")
                    .where("product.is_bio = :is_bio", { is_bio: true })
                    .getMany();
                return res;
            }
            else {
                const res = yield this.AppDataSource
                    .getRepository(Product_1.Product)
                    .createQueryBuilder("product")
                    .where("product.category_id = :category_id", { category_id: category_id })
                    .getMany();
                return res;
            }
        });
    }
    static getFeaturedProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des produits phares dans la BDD");
            const res = yield this.AppDataSource
                .getRepository(FeaturedProduct_1.FeaturedProduct)
                .createQueryBuilder("featured_product")
                .leftJoinAndSelect("featured_product.product", "product")
                .getMany();
            return res;
        });
    }
    static getTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération des tokens pour le user n°" + userId + " dans la BDD");
            const req = yield this.AppDataSource
                .getRepository(OAuth_1.OAuth)
                .createQueryBuilder("oauth")
                .where("oauth.user_id = :user_id", { user_id: userId })
                .getOne();
            if (req) {
                return { accessToken: req.access_token, refreshToken: req.refresh_token };
            }
            else {
                return null;
            }
        });
    }
    static addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Ajout du user :");
            console.log(user);
            const req = yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(User_1.User)
                .values(user)
                .returning("id")
                .execute();
            const id = req.identifiers[0].id;
            return id;
        });
    }
    static updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Mise à jour des info du user :");
            console.log(user);
            yield this.AppDataSource
                .createQueryBuilder()
                .update(User_1.User)
                .set(user)
                .where("id = :id", { id: user.id })
                .execute();
        });
    }
    static addShipper(shipper) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Ajout du shipper :");
            console.log(shipper);
            const shipperFound = yield this.AppDataSource
                .getRepository(Shipper_1.Shipper)
                .createQueryBuilder("shipper")
                .where("shipper.user_id = :user_id", { user_id: shipper.user_id })
                .getOne();
            if (shipperFound === null) {
                yield this.AppDataSource
                    .createQueryBuilder()
                    .insert()
                    .into(Shipper_1.Shipper)
                    .values(shipper)
                    .execute();
            }
            else {
                yield this.AppDataSource
                    .createQueryBuilder()
                    .update(Shipper_1.Shipper)
                    .set(shipper)
                    .where("user_id = :user_id", { user_id: shipper.user_id })
                    .execute();
            }
        });
    }
    static addCart(cart, cartItems) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Ajout de la cart :");
            console.log(cart);
            cart.status = 0;
            // Le calcul du average_price de la cart se fait désormais côté application
            // On supprime les cart précédentes de l'utilisateur
            // On part du principe que chaque utilistaeur à une seule cart active à cahque fois
            const currentCart = yield this.getCurrentCart(cart.owner_id);
            yield this.AppDataSource
                .createQueryBuilder()
                .delete()
                .from(CartItem_1.CartItem)
                .where("cart_id = :cart_id", { cart_id: currentCart ? currentCart.id : 0 })
                .execute();
            yield this.AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Cart_1.Cart)
                .where("owner_id = :owner_id", { owner_id: cart.owner_id })
                .execute();
            const req = yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(Cart_1.Cart)
                .values(cart)
                .returning("id")
                .execute();
            const cartId = req.identifiers[0].id;
            cartItems.map(item => { item.cart_id = cartId; item.status = 0; });
            yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(CartItem_1.CartItem)
                .values(cartItems)
                .execute();
        });
    }
    static addDeliveryProposals(deliveryProposals) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Ajout des delivery proposals : ", deliveryProposals);
            for (let deliveryProposal of deliveryProposals) {
                yield this.AppDataSource.getRepository(DeliveryProposal_1.DeliveryProposal).save(deliveryProposal);
            }
        });
    }
    static addDeliveryProposal(delivery_proposal) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Ajout de la delivery proposal :");
            console.log(delivery_proposal);
            yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(DeliveryProposal_1.DeliveryProposal)
                .values(delivery_proposal)
                .execute();
        });
    }
    static addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Ajout du produit :");
            console.log(product);
            yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(Product_1.Product)
                .values(product)
                .execute();
        });
    }
    static updateCartStatus(cartId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Mise à jour du status de la cart n°" + cartId + " dans la BDD");
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Cart_1.Cart)
                .set({ status: status })
                .where("id = :id", { id: cartId })
                .execute();
        });
    }
    static cancelCart(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Suppression de la cart n°" + cartId + " dans la BDD");
            // On supprime d'abord les cart_item
            yield this.AppDataSource
                .createQueryBuilder()
                .delete()
                .from(CartItem_1.CartItem)
                .where("cart_id = :cart_id", { cart_id: cartId })
                .execute();
            yield this.AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Cart_1.Cart)
                .where("id = :id", { id: cartId })
                .execute();
        });
    }
    static acceptDeliveryProposal(deliveryProposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Acceptation de la delivery proposal n°" + deliveryProposalId + " dans la BDD");
            const deliveryProposal = (yield this.AppDataSource.getRepository(DeliveryProposal_1.DeliveryProposal).find({
                relations: {
                    carts: true,
                },
                where: {
                    id: deliveryProposalId
                },
                take: 1
            }))[0];
            if (deliveryProposal === undefined) {
                return;
            }
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Cart_1.Cart)
                .set({ delivery_proposal_id: null, status: 1 })
                .where("delivery_proposal_id = :id", { id: deliveryProposalId })
                .execute();
            // On supprime toutes les delivery proposals précédentes de l'utilisateur lors de l'accéptation d'une delivery proposal
            yield this.AppDataSource
                .createQueryBuilder()
                .delete()
                .from(DeliveryProposal_1.DeliveryProposal)
                .where("shipper_id = :id", { id: deliveryProposal.shipper_id })
                .execute();
            let delivery = new Delivery_1.Delivery();
            delivery.carts = deliveryProposal.carts;
            delivery.shipper_id = deliveryProposal.shipper_id;
            delivery.deadline = deliveryProposal.carts.map(cart => cart.deadline).reduce((a, b) => a < b ? a : b);
            delivery.status = 0;
            delivery.suggested_supermarket_id = deliveryProposal.suggested_supermarket_id;
            yield this.AppDataSource.getRepository(Delivery_1.Delivery).save(delivery);
        });
    }
    static delcineDeliveryProposal(deliveryProposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Refus de la delivery proposal n°" + deliveryProposalId + " dans la BDD");
            yield this.AppDataSource
                .createQueryBuilder()
                .delete()
                .from(DeliveryProposal_1.DeliveryProposal)
                .where("id = :id", { id: deliveryProposalId })
                .execute();
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Cart_1.Cart)
                .set({ delivery_proposal_id: null })
                .where("delivery_proposal_id = :id", { id: deliveryProposalId })
                .execute();
        });
    }
    static updateDeliveryStatus(deliveryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Mise à jour du status de la livraison n°" + deliveryId + " dans la BDD");
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Delivery_1.Delivery)
                .set({ status: status })
                .where("id = :id", { id: deliveryId })
                .execute();
        });
    }
    static startDeliveryShopping(deliveryId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Début de l'achat pour la commande " + deliveryId + " !");
            yield this.updateDeliveryStatus(deliveryId, 1);
        });
    }
    /**
     * Permet d'update les carts, les prix, les status des cart_items suite à l'achat
     * @param deliveryId
     * @param carts les carts mises à jour i.e avec le status des carts items mis à jour et le price_to_pay mis à jour
     */
    static endDeliveryShopping(deliveryId, carts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Fin de l'achat pour la commande " + deliveryId + " !");
            yield this.updateDeliveryStatus(deliveryId, 2);
            console.log("[DBManager] Mis à jour des prix finaux pour la commande " + deliveryId + " !");
            // On met à jour les price_to_pay envoyés par le livreur
            yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(Cart_1.Cart)
                .values(carts)
                .orUpdate(["status", "price_to_pay"], ["id"], {
                skipUpdateIfNoValuesChanged: true,
            })
                .execute();
            console.log("[DBManager] Mis à jour des status des cart_items pour la commande " + deliveryId + " !");
            const items = carts.reduce((acc, cur) => acc.concat(cur.items), []);
            // On met à jour les status des items (trouvés ou pas) envoyés par le livreur
            yield this.AppDataSource
                .createQueryBuilder()
                .insert()
                .into(CartItem_1.CartItem)
                .values(items)
                .orUpdate(["status"], ["id"], {
                skipUpdateIfNoValuesChanged: true,
            })
                .execute();
        });
    }
    static depositDelivery(deliveryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const availableLockerId = LockerManager_1.Locker.getAvailableLocker();
            console.log("[DBManager] Dépôt de la commande " + deliveryId + " au locker n°" + availableLockerId);
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Delivery_1.Delivery)
                .set({ status: 3, deposit_date: (new Date()).toJSON() })
                .where("id = :id", { id: deliveryId })
                .execute();
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Cart_1.Cart)
                .set({ status: 2, locker_id: availableLockerId })
                .where("delivery_id = :id", { id: deliveryId })
                .execute();
            LockerManager_1.Locker.openLocker(availableLockerId);
        });
    }
    static finishCart(cartId, retreived) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Finalisation du cart n°" + cartId);
            yield this.AppDataSource
                .createQueryBuilder()
                .update(Cart_1.Cart)
                .set({ status: retreived ? 3 : 4 })
                .where("id = :id", { id: cartId })
                .execute();
            const cart = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.id = :id", { id: cartId })
                .getOne();
            if (cart) {
                yield this.finishDelivery(cart === null || cart === void 0 ? void 0 : cart.delivery_id);
            }
        });
    }
    static finishDelivery(deliveryId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Test de finalisation de la delivery n°" + deliveryId);
            const carts = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.delivery_id = :delivery_id", { delivery_id: deliveryId })
                .getMany();
            const finished = carts.every(cart => cart.status === 3 || cart.status === 4);
            if (finished) {
                const valid = carts.every(cart => cart.status === 3);
                const nextStatus = valid ? 4 : 5;
                console.log("[DBManager] Finalisation de la delivery n°" + deliveryId + (valid ? " validée" : " non validée"));
                yield this.AppDataSource
                    .createQueryBuilder()
                    .update(Delivery_1.Delivery)
                    .set({ status: nextStatus })
                    .where("id = :id", { id: deliveryId })
                    .execute();
            }
        });
    }
    static retreiveCart(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[DBManager] Récupération du cart n°" + cartId);
            const cart = yield this.AppDataSource
                .getRepository(Cart_1.Cart)
                .createQueryBuilder("cart")
                .where("cart.id = :id", { id: cartId })
                .getOne();
            console.log("[DBManager] Récupération du cart n°" + cartId + " au locker n°" + (cart === null || cart === void 0 ? void 0 : cart.locker_id));
            LockerManager_1.Locker.openLocker((cart === null || cart === void 0 ? void 0 : cart.locker_id) ? cart === null || cart === void 0 ? void 0 : cart.locker_id : 0);
        });
    }
    static retreiveDelivery(deliveryId, retreived) {
        return __awaiter(this, void 0, void 0, function* () {
            if (retreived) {
                console.log("[DBManager] Récupération correcte de la commande " + deliveryId);
                yield this.updateDeliveryStatus(deliveryId, 4);
                // On peut supprimer les carts associés à cette delivery
                yield this.AppDataSource
                    .createQueryBuilder()
                    .delete()
                    .from(Cart_1.Cart)
                    .where("delivery_id = :delivery_id", { delivery_id: deliveryId });
            }
            else {
                console.log("[DBManager] Problème lors de la récupération de la commande " + deliveryId);
                yield this.updateDeliveryStatus(deliveryId, 5);
            }
        });
    }
    // On lit un fichier JSON et on écrit ses données dans la BDD
    static writeFromJSON(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.readFile(path.join(__dirname, `../assets/json/${tableName}.json`), 'utf8', (error, data) => __awaiter(this, void 0, void 0, function* () {
                const parsedData = JSON.parse(data)[tableName];
                yield this.AppDataSource
                    .createQueryBuilder()
                    .insert()
                    .into(tableName)
                    .values(parsedData)
                    .execute();
            }));
        });
    }
}
exports.DB = DB;
