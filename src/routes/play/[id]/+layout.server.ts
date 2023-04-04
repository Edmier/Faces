import { POCKETBASE_URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import PocketBase from 'pocketbase';
import { GetLobby, type Lobby } from '$pb/pocketbase';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const { id } = params;

	if (id === 'guest') {
		return {
			name: 'Guest Lobby',
			lobbyId: 'guest',
		};
	}

	if (!locals.pb) {
		locals.pb = new PocketBase(POCKETBASE_URL);
	}

	const lobby = await GetLobby(locals.pb, id);

	if (!lobby) {
		throw error(404, 'Lobby not found');
	}

	return structuredClone(lobby) as Lobby;
};
