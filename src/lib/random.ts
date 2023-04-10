import type { WaitingData, WantedData } from "$pb/pocketbase";
import { CRIMES } from "./crimes";

export class Generator {
    baseSeed: string;
    seed: string;
    seeds: number[];
    crime: () => string;
    wanted: (index?: number) => WantedData;
    waiting: (index?: number) => WaitingData;
    wantedWaiting: (wanted: WantedData) => WaitingData;
    facePointOffsets: () => { x: number, y: number }[];

    constructor(seed: string, time = '') {
        this.baseSeed = seed;
        this.seed = seed + time.toString();
        this.seeds = cyrb128(time.toString() + seed);

        this.crime = () => {
            const gen = new SeededRandom(this.seed);
            const index = gen.nextRange(0, CRIMES.length - 1);
            return CRIMES[index];
        }

        this.wanted = (index = 0) => {
            const gen = new Generator(this.seed, index ? index.toString() : undefined);

            const crime = gen.crime();
            const guilty = true;

            const createdAt = time + index.toString();

            return {
                seed: this.baseSeed + createdAt.toString(),
                createdAt: +createdAt,
                crime,
                guilty,
            };
        }

        this.waiting = (index = 0) => {
            const gen = new SeededRandom(this.seed);
            const createdAt = time + index.toString();

            return {
                seed: this.baseSeed + createdAt.toString(),
                createdAt: +createdAt,
                guilty: false,
                netCoins: gen.nextRange(0, 100) - 50,
            };
        }

        this.wantedWaiting = (wanted: WantedData) => {
            const gen = new SeededRandom(this.seed);

            return {
                seed: wanted.seed,
                createdAt: wanted.createdAt,
                guilty: true,
                netCoins: -gen.nextRange(25, 150),
            };
        }

        this.facePointOffsets = () => {
            const gen = new SeededRandom(this.seed);
            const points = [];

            for (let i = 0; i < 5; i++) {
                points.push({
                    x: gen.nextRange(-3, 3),
                    y: gen.nextRange(-3, 3),
                });
            }

            return points;
        }
    }
}

export class SeededRandom {
	next: () => number;
	seed: string;
	seedInts: number[];

	constructor(seed: string) {
		this.seed = seed;
		this.seedInts = cyrb128(seed);
		this.next = sfc32(this.seedInts[0], this.seedInts[1], this.seedInts[2], this.seedInts[3]);
	}

	nextRange(min: number, max: number) {
        return Math.floor(this.next() * (max - min) + min);
    }
}

function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a: number, b: number, c: number, d: number) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      let t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}