import { error, type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GetLobby, type Game, type Lobby, type User, GetGame, type Choice, type GameData } from '$pb/pocketbase';
import type PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { lobby } = await parent();

	if (!locals.pb || !lobby) {
		throw error(500, 'Database not initialized or not accessible!');
	}

	const waiting = lobby.data.waiting;

	const user = locals.pb.authStore.model;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	let game;

	if (!user.game) {
		try {
			// console.log('Creating new game');
			game = await locals.pb.collection('games').create<Game>({
				lobby: lobby.id,
				username: user.username,
				userId: user.id,
				status: 'new',
				coins: 0,
				choices: [],
			});
	
			// Update the user's game
			await locals.pb.collection('users').update(user.id, {
				game: game.id,
			});
	
			return {
				user: structuredClone(user.export()) as User,
				game: structuredClone(game) as Game,
				status: 'new',
				nextChoice: 0,
			}
		} catch (e) {
			// console.log(e);
			throw error(500, 'Could not create new game!');
		}
	}


	game = await GetGame(locals.pb, user.game);
	if (game) {
		if (game.status === 'finished') {
			if (!game.data) {
				await collectData(locals.pb, user.game, game.choices);
			}
			throw redirect(303, `/game/${lobby.lobbyId}/results`);
		}

		const choices = game.choices;

		if ((choices?.length ?? 0) >= waiting.length) {
			return {
				user: structuredClone(user.export()) as User,
				game: structuredClone(game) as Game,
				status: 'finished',
			}
		}

		return {
			user: structuredClone(user.export()) as User,
			game: structuredClone(game) as Game,
			status: 'started',
			nextChoice: choices?.length ?? 0,
		}
	}

	// Create a new game
	try {

		// console.log('Creating new game');
		game = await locals.pb.collection('games').create<Game>({
			lobby: lobby.id,
			username: user.username,
			userId: user.id,
			status: 'new',
			coins: 0,
			choices: [],
		});

		// Update the user's game
		await locals.pb.collection('users').update(user.id, {
			game: game.id,
		});

		return {
			user: structuredClone(user.export()) as User,
			game: structuredClone(game) as Game,
			status: 'new',
			nextChoice: 0,
		}
	} catch (e) {
		// console.log(e);
		throw error(500, 'Could not create new game!');
	}
}

export const actions: Actions = {
	allow: async ({ locals, params, request }) => {
		return await handleChoice(locals, params, request, 'admit');
	},
	deny: async ({ locals, params, request }) => {
		return await handleChoice(locals, params, request, 'deny');
	},
	report: async ({ locals, params, request }) => {
		return await handleChoice(locals, params, request, 'report');
	}
}

async function handleChoice(locals: App.Locals, params: Partial<Record<string, string>>, request: Request, choice: 'admit' | 'deny' | 'report') {
	let lobby: Lobby | undefined;
	// console.log('locals', locals.pb.authStore.model?.id);
	const game = await GetGame(locals.pb, locals.pb.authStore.model?.game) ?? undefined;

	try {
		if (params.id) lobby = await GetLobby(locals.pb, params.id) ?? undefined;
		
	} catch (e) {
		// console.log(e);
		return fail(500, { success: false, error: 'Lobby or game not initialized!' });
	}
	
	if (!lobby || !game) {
		// console.log('game', game, 'auth', locals.pb.authStore.model);
		return fail(500, { success: false, error: 'Lobby or game not initialized!' });
	}

	const form = await request.formData();
	const id = form.get('waitingIndex') as string;

	// console.log('id', id, choice);
	const waiting = lobby.data.waiting?.find((p) => p.seed === id);

	if (!id || !waiting) {
		return fail(400, { success: false, error: 'Error getting which choice is being shown!' });
	}

	let choices = game.choices ?? [];

	if (!Array.isArray(choices)) {
		choices = [];
	}

	if (!choices.some((c) => c.person === waiting.seed)) {
		choices.push({
			choice: choice,
			coinChange: waiting.netCoins,
			warranted: waiting.guilty,
			person: waiting.seed,
			timestamp: Date.now(),
		});
	} else {
		console.log('Error: Duplicate choice!', choice, waiting.seed);
		choices.push({
			choice: 'admit',
			coinChange: 0,
			warranted: false,
			person: 'error',
			timestamp: Date.now(),
		})	
	}

	// console.log(choices.length, lobby.data.waiting.length, choices.length >= lobby.data.waiting.length);
	const done = choices.length >= lobby.data.waiting.length - 1;

	if (done && !game.data) {
		await collectData(locals.pb, game.id, choices);
	}

	try {
		// console.log('coins', waiting.netCoins, game.coins);
		await locals.pb.collection('games').update<Game>(game.id, {
			choices: choices,
			coins: game.coins + waiting.netCoins,
			status: done ? 'finished' : 'started',
			startTime: game.startTime ?? new Date().toUTCString(),
		});

		return {
			success: true,
			nextChoice: choices.length,
		}
	} catch (e) {
		// console.log(e);
		return fail(500, { success: false, error: 'Error updating game! Try logging in again' });
	}
}

async function collectData(pb: PocketBase, gameId: string, choices: Choice[]) {
	const data: GameData = {
		deny: 0,
		admit: 0,
		report: 0,
		wanted: {
			deny: 0,
			admit: 0,
			report: 0,
		},
		blockedWanted: []
	};

	if (!choices || !Array.isArray(choices)) return data;

	for (const choice of choices) {
		if (choice.warranted) {
			data.wanted[choice.choice]++;

			if (choice.choice === 'report' || choice.choice === 'deny') {
				data.blockedWanted.push(choice.person);
			}
		}

		data[choice.choice]++;
	}

	try {
		await pb.collection('games').update<Game>(gameId, {
			data: data,
		});
	} catch (e) {
		console.log(e);
	}
}