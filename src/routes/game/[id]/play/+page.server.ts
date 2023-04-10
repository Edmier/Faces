import { error, type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GetLobby, type Game, type Lobby, type User } from '$pb/pocketbase';

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

	let game = await locals.pb.authStore.model?.expand?.game as Game | null;
	if (game) {

		if (game.status === 'finished') {
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
		console.log(e);
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
	let game: Game | undefined;

	try {
		if (params.id) lobby = await GetLobby(locals.pb, params.id) ?? undefined;
		game = locals.pb.authStore.model?.expand?.game;
	} catch (e) {
		console.log(e);
		return fail(500, { success: false, error: 'Lobby or game not initialized!' });
	}
	
	if (!lobby || !game) {
		return fail(500, { success: false, error: 'Lobby or game not initialized!' });
	}

	const form = await request.formData();
	const id = form.get('waitingIndex') as string;

	console.log('id', id);
	const waiting = lobby.data.waiting?.find((p) => p.seed === id);

	if (!id || !waiting) {
		return fail(400, { success: false, error: 'Error getting which choice is being shown!' });
	}

	let choices = game.choices ?? [];

	if (!Array.isArray(choices)) {
		choices = [];
	}

	choices.push({
		choice: choice,
		coinChange: waiting.netCoins,
		warranted: waiting.isWanted,
		person: waiting.seed,
		timestamp: Date.now(),
	});

	console.log(choices.length, lobby.data.waiting.length, choices.length >= lobby.data.waiting.length);
	const done = choices.length >= lobby.data.waiting.length - 1;

	try {
		console.log('coins', waiting.netCoins, game.coins);
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
		console.log(e);
		return fail(500, { success: false, error: 'Error updating game! Try logging in again' });
	}
}