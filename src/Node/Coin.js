import Generic from './Generic';

export default class Coin extends Generic {
     setup = async () => {
        const {
            environment: { coins },
        } = this.globalModels;
         for (let i = 0; i < 2; i++) {
             const coin = coins['0'];
             if (coin.texture) {
                 await this._register('0', {
                     ...coin,
                     castShadow: true,
                     receiveShadow: false,
                 });
             } else {
                 console.warn('Coin texture is null');
             }
         }
        return this.models;
    };
}