import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Game, User } from '$pb/pocketbase';
import { InitialGameState } from '$lib/game';

export const load: PageServerLoad = async ({ locals, parent, params }) => {
	const { lobby } = await parent();

	if (!locals.pb) {
		throw error(500, 'PocketBase not initialized!');
	}

	const user = locals.pb.authStore.model;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	let game = await locals.pb.authStore.model?.game;
	if (game) {
		return {
			user: structuredClone(user.export()) as User,
			game: structuredClone(game.export()) as Game,
		}
	}


	// Create a new game
	try {
		const initialGameState = InitialGameState(lobby);

		console.log(initialGameState);

		game = await locals.pb.collection('games').create<Game>({
			lobby: lobby.id,
			username: user.username,
			userId: user.id,
			status: 'new',
			coins: 0,
			choices: [],
			data: initialGameState,
		});
	} catch (e) {
		console.log(e);
		throw error(500, 'Could not create new game!');
	}

	return {
		user: structuredClone(user.export()) as User,
		game: structuredClone(game.export()) as Game,
	}
}