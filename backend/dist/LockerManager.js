"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locker = void 0;
// Le temps (en sec) durant lequel le locker reste dans l'état "true" suite à une ouverture
const OPEN_TIME = 10;
class Locker {
    static changeState(lockerID, state) {
        console.log(`[RPIManager] Changement d'état du locker n°${lockerID} à ${state}`);
        this.lockerStates[lockerID] = state;
    }
    /**
     * On laisse un temps de OPEN_TIME sec durant lequel l'état du locker est à true, puis on repasse à false
     * @param lockerID
     */
    static openLocker(lockerID) {
        if (lockerID > this.lockerStates.length) {
            return null;
        }
        console.log(`[RPIManager] Début d'ouverture du locker n°${lockerID}`);
        this.changeState(lockerID, true);
        setTimeout(() => {
            console.log(`[RPIManager] Fin d'ouverture du locker n°${lockerID}`);
            this.changeState(lockerID, false);
        }, OPEN_TIME * 1000);
    }
    static getLockersStates() {
        return this.lockerStates;
    }
    // Censé donner le numéro d'un locker disponible
    // Pour des raisons de tests, pour l'instant la fonction renvoi constamment 0
    static getAvailableLocker() {
        return 0;
    }
}
exports.Locker = Locker;
Locker.lockerStates = [false, false, false];
