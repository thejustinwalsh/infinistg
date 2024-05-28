// Modified spatial hash implementation base on:
/*
The MIT License (MIT)

Copyright (c) 2014 Christer Bystrom

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

A spatial hash. For an explanation, see

http://www.gamedev.net/page/resources/_/technical/game-programming/spatial-hashing-r2697

For computational efficiency, the positions are bit-shifted n times. This means
that they are divided by a factor of power of two. This factor is the
only argument to the constructor.
*/

type Rect = {x: number; y: number; width: number; height: number};

const DEFAULT_POWER_OF_TWO = 5;

function makeKeysFn(shift: number) {
  return function (obj: Rect) {
    const sx = obj.x >> shift,
      sy = obj.y >> shift,
      ex = (obj.x + obj.width) >> shift,
      ey = (obj.y + obj.height) >> shift,
      keys = [];
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        keys.push('' + x + ':' + y);
      }
    }
    return keys;
  };
}

/**
 * @param {number} power_of_two - how many times the rects should be shifted
 *                                when hashing
 */
export default function SpatialHash<T extends Rect>(power_of_two: number = DEFAULT_POWER_OF_TWO) {
  const getKeys = makeKeysFn(power_of_two);
  const hash: Record<string, T[]> = {};
  const list: T[] = [];

  return {
    clear: () => {
      for (const key in hash) {
        if (hash[key].length === 0) {
          delete hash[key];
        } else {
          hash[key].length = 0;
        }
      }
      list.length = 0;
    },
    getNumBuckets: () => {
      let count = 0;
      for (const key in hash) {
        if (Object.prototype.hasOwnProperty.call(hash, key)) {
          if (hash[key].length > 0) {
            count++;
          }
        }
      }
      return count;
    },
    insert: (obj: T, rect?: Rect) => {
      const keys = getKeys(rect || obj);
      list.push(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        hash[key] ? hash[key].push(obj) : (hash[key] = [obj]);
      }
    },
    retrieve: (obj?: T, rect?: Rect) => {
      let ret: T[] = [];
      if (!obj || !rect) return list;

      const keys = getKeys(rect || obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (hash[key]) {
          ret = ret.concat(hash[key]);
        }
      }
      return ret;
    },
  };
}
