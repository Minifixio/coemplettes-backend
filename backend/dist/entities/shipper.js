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
exports.Shipper = void 0;
const typeorm_1 = require("typeorm");
let Shipper = class Shipper {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Shipper.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], Shipper.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], Shipper.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: false }),
    __metadata("design:type", Boolean)
], Shipper.prototype, "has_car", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Shipper.prototype, "deliveries_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], Shipper.prototype, "price_max", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float", nullable: true }),
    __metadata("design:type", Number)
], Shipper.prototype, "loc_long", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float", nullable: true }),
    __metadata("design:type", Number)
], Shipper.prototype, "loc_lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Shipper.prototype, "drive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: true }),
    __metadata("design:type", Boolean)
], Shipper.prototype, "shop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Shipper.prototype, "availability", void 0);
Shipper = __decorate([
    (0, typeorm_1.Entity)({ name: "shippers" })
], Shipper);
exports.Shipper = Shipper;
