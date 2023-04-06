import { POCKETBASE_URL } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
import PocketBase from 'pocketbase';
import { GetLobby, type Lobby } from '$pb/pocketbase';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const { id } = params;

	if (!locals.pb) {
		locals.pb = new PocketBase(POCKETBASE_URL);
	}

	try {
		const lobby = await GetLobby(locals.pb, id);

		if (!lobby) {
			throw error(404, 'Lobby not found');
		}

		return {
			lobby: structuredClone(lobby) as Lobby
		};

	} catch (_) {
		throw error(404, 'Lobby not found');
	}
};
