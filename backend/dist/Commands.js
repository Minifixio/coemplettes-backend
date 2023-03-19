"use strict";
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
exports.GroupedCommands = void 0;
const DBManager_1 = require("./DBManager");
class GroupedCommands {
    static cron() {
        return __awaiter(this, void 0, void 0, function* () {
            // Cette méthode réalise les regroupements de commandes
            yield DBManager_1.DB.initialize(process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306);
            createCommands();
        });
    }
    static createGroupedCommands() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static getCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            // Cette méthode récupère les commandes
        });
    }
}
exports.GroupedCommands = GroupedCommands;
