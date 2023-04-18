import type { Lobby, WantedData, WaitingData, LobbyData } from "$pb/pocketbase";
import { Generator } from "./random";
import PocketBase from "pocketbase";
import { generate, type Face } from "facesjs";
import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, POCKETBASE_URL } from "$env/static/private";
// import type { Overrides } from "facesjs/build/override";

const INITIAL_WANTED = 6;
const INITIAL_WAITING = 30;
const INITAL_GUILTY = 6;

type Overrides = {
	[key in keyof Face]?: Face[key];
}

export function InitialGameState(lobby: Lobby): LobbyData {
	const lobbySeed = lobby.id;
	const wanted: WantedData[] = [];
	const waiting: WaitingData[] = [];

	const gen = new Generator(lobbySeed, new Date(lobby.created).getMilliseconds().toString());

	// Yes I know how bad this looks, but I want the representation to be equal and this is the only way
	// to do that with the faces library
	const races = ['white', 'white', 'asian', 'asian', 'brown', 'black'];

	for (let i = 0; i < INITIAL_WANTED; i++) {
		const obj = gen.wanted(i);

		// Split genders evenly
		const gender = (i % 2 === 0) ? 'male' : 'female';

		obj.face = generate(undefined, { gender, race: races[i] as unknown as undefined });
		wanted.push(obj);
	}

	for (let i = 0; i < INITIAL_WAITING; i++) {
		const obj = gen.waiting(i);
		const gender = (i % 2 === 0) ? 'male' : 'female';
		obj.face = generate(undefined, { gender,  });
		waiting.push(obj);
	}

	// Create more waiting people until we have enough guilty
	for (let i = 0; i < INITAL_GUILTY; i++) {
		const obj = gen.waiting(i);

		const guilty = wanted[i].face;
		if (!guilty) continue;

		const overrides: Overrides = {
			ear: guilty.ear,
			body: guilty.body,
			head: guilty.head,
			eye: guilty.eye,
			mouth: guilty.mouth,
			nose: guilty.nose,
			eyebrow: guilty.eyebrow,
			accessories: guilty.accessories,
			// Add +- 0.1 to the guilty's fatness
			fatness: guilty.fatness + (Math.random() * 0.2) - 0.1,
		}

		obj.face = generate(overrides);
		obj.guilty = true;
		waiting.push(obj);
	}

	// Shuffle the wanted and waiting lists
	for (let i = wanted.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[wanted[i], wanted[j]] = [wanted[j], wanted[i]];
	}

	for (let i = waiting.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[waiting[i], waiting[j]] = [waiting[j], waiting[i]];
	}

	// console.log(wanted);

	return {
		wanted,
		waiting,
	};
}

export async function CreateLobbyState(pb: PocketBase, lobby: Lobby): Promise<Lobby> {
	// console.log("Creating lobby state");
	const state = InitialGameState(lobby);

	try {
		const admin = new PocketBase(POCKETBASE_URL);
		await admin.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

		await admin.collection("lobbies").update(lobby.id, {
			data: state,
		});
	} catch (e) {
		console.error(e);
		return lobby;
	}

	return pb.collection("lobbies").getFirstListItem<Lobby>('', {
		lobbyId: lobby.lobbyId,
	});
}