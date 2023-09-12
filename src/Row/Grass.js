import {Object3D, Mesh, BoxGeometry, MeshBasicMaterial} from 'three';

import ModelLoader from '../../src/ModelLoader';
import { groundLevel } from '../GameSettings';

export const Fill = {
  empty: 'empty',
  solid: 'solid',
  random: 'random',
};

const HAS_WALLS = true;
const HAS_OBSTACLES = true;
const HAS_VARIETY = true;
const HAS_COINS = true;

export default class Grass extends Object3D {
  active = false;
  entities = [];
  coins = [];

  top = 0.4;
  /*

* Build Walls

* Random Fill Center
* Solid Fill Center
* Empty Fill Center


*/

  generate = (type = Fill.random) => {
    this.entities.map(val => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];
    this.obstacleMap = {};
    this.coinMap = {};
    this.coins = [];
    this.treeGen(type);
    this.coinGen(type);
  };

  obstacleMap = {};
  coinMap = {};

  addCoins = x => {
    if ( HAS_COINS ) {
      this.createCoin(x);
    }
  }

  addObstacle = x => {
    let mesh;
    if (HAS_VARIETY) {
      mesh =
        Math.random() < 0.4
          ? ModelLoader._boulder.getRandom()
          : ModelLoader._tree.getRandom();
    } else {
      mesh = ModelLoader._tree.getRandom();
    }
    this.obstacleMap[`${x | 0}`] = { index: this.entities.length };
    this.entities.push({ mesh });
    this.floor.add(mesh);
    mesh.position.set(x, groundLevel, 0);
  };

  coinGen = type => {
    for (let x = -3; x < 12; x++) {
      const _x = x - 4;

      if (type === Fill.solid) continue;

      // Decide if we're placing a coin on this row with a 30% chance
      if (Math.random() < 0.3) {
        this.addCoins(_x);
        // Skip to the next row since we don't want more coins on this row
        x += 1;
      }
    }
  };

  treeGen = type => {
    // 0 - 8
    let _rowCount = 0;
    const count = Math.round(Math.random() * 2) + 1;
    for (let x = -3; x < 12; x++) {
      const _x = x - 4;
      if (type === Fill.solid) {
        this.addObstacle(_x);
        continue;
      }

      if (HAS_WALLS) {
        /// Walls
        if (x >= 9 || x <= -1) {
          this.addObstacle(_x);
          continue;
        }
      }

      if (HAS_OBSTACLES) {
        if (_rowCount < count) {
          if (_x !== 0 && Math.random() > 0.6) {
            this.addObstacle(_x);
            _rowCount++;
          }
        }
      }
    }
  };

  createCoin = x => {
    let mesh = ModelLoader._coins.getRandom();
    const collisionBoxSize = 1;
    this.coinMap[`${x | 0}`] = { index: this.entities.length };
    this.coins.push({ mesh, collisionBox: collisionBoxSize });
    this.entities.push({ mesh, collisionBox: collisionBoxSize });
    this.floor.add(mesh);
    mesh.position.set(x, groundLevel, 0);
  };

  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }

  collectCoins = (dt, player) => {
    this.coins.forEach((coin, index) => {
      if (this.checkCoinCollision({ dt, coin, player })) {
        // If there's a collision, handle it (e.g., increase score, remove coin)
        this.handleCoinCollision(coin, index);
      }
    });
  }

  checkCoinCollision = ({ coin, player }) => {
    if (Math.round(player.position.z) === this.position.z && player.isAlive) {
      const { mesh, collisionBox } = coin;
      if (
          player.position.x < mesh.position.x + collisionBox &&
          player.position.x > mesh.position.x - collisionBox
      ) {
        return true;
      }
    }
    return false;
  };

  handleCoinCollision = (coin, index) => {
    // this.onCollide(coin, 'coin');
    // Remove coin from scene
    this.floor.remove(coin.mesh);
    // Remove coin from coins array
    this.coins.splice(index, 1);
    // Increase player's score or call a function that does
    // player.collectCoin();
  };
}
