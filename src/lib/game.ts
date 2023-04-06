import type { Lobby, User, Game, GameData, WantedData, WaitingData } from "$pb/pocketbase";
import { Generator, SeededRandom } from "./random";

const INITIAL_WANTED = 5;
const INITIAL_WAITING = 10;

export function InitialGameState(lobby: Lobby): GameData {
	const lobbySeed = lobby.id;
	const wanted: WantedData[] = [];
	const waiting: WaitingData[] = [];

	const gen = new Generator(lobbySeed, new Date(lobby.created).getMilliseconds());

	for (let i = 0; i < INITIAL_WANTED; i++) {
		wanted.push(gen.wanted(i));
		console.log(wanted[i]);
	}

	const random = new SeededRandom(lobbySeed);

	for (let i = 0; i < INITIAL_WAITING; i++) {
		if (random.nextRange(0, 10) > 1) {
			waiting.push(gen.waiting(i));
		} else {
			waiting.push(gen.wantedWaiting(wanted[random.nextRange(0, wanted.length - 1)]));
		}
	}

	return {
		wanted,
		waiting,
	};
}