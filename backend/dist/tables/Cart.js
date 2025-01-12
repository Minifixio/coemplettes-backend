"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const typeorm_1 = require("typeorm");
const Delivery_1 = require("./Delivery");
const User_1 = require("./User");
const DeliveryProposal_1 = require("./DeliveryProposal");
const CartItem_1 = require("./CartItem");
let Cart = class Cart {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], Cart.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "delivery_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "delivery_proposal_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Cart.prototype, "creation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: false }),
    __metadata("design:type", Date
    // 0 = en attente d'attribution à une delivery
    // 1 = attribuée à un livreur
    // 2 = livrée
    // 3 = récupérée par l'utilisateur
    // 4 = problème
    )
], Cart.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], Cart.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float", nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "average_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float", nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "price_to_pay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }) // le numéro du locker qui sera attribué une fois la Delivery déposée
    ,
    __metadata("design:type", Number)
], Cart.prototype, "locker_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => User_1.User, owner => owner),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.User)
], Cart.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Delivery_1.Delivery, delivery => delivery),
    (0, typeorm_1.JoinColumn)({ name: 'delivery_id', referencedColumnName: 'id' }),
    __metadata("design:type", Delivery_1.Delivery)
], Cart.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => DeliveryProposal_1.DeliveryProposal, deliveryProposal => deliveryProposal),
    (0, typeorm_1.JoinColumn)({ name: 'delivery_proposal_id', referencedColumnName: 'id' }),
    __metadata("design:type", DeliveryProposal_1.DeliveryProposal)
], Cart.prototype, "delivery_proposal", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItem_1.CartItem, (cartItem) => cartItem.cart),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
Cart = __decorate([
    (0, typeorm_1.Entity)({ name: "carts" })
], Cart);
exports.Cart = Cart;
