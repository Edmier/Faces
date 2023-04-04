import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GetLobby } from '$pb/pocketbase';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	await parent();
};

export const actions: Actions = {
	join: async ({ locals, request, params, cookies }) => {
		if (!locals.pb) {
			return fail(500, { error: 'PocketBase not initialized!' })
		}

		const { id } = params;

		const lobby = await GetLobby(locals.pb, id);
		if (!lobby) {
			return fail(404, { error: 'Lobby not found' });
		}

		const form = await request.formData();
		const username = form.get('name') as string;
		const password = form.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Missing username or password' });
		}

		if (username.length < 5) {
			return fail(401, { error: 'Please have username be at least 5 characters' });
		}

		if (password.length < 8) {
			return fail(401, { error: 'Please have password be at least 8 characters' });
		}

		let authUser = null;
		try {
			authUser = await locals.pb.collection('users').authWithPassword(username, password);
			if (!authUser) {
				return fail(401, { error: 'Incorrect username or password!' });
			}
		} catch (_) {
			try {
				await locals.pb.collection('users').create({
					username: username,
					password: password,
					passwordConfirm: password,
					lobbyId: lobby.lobbyId,
				});
	
				authUser = await locals.pb.collection('users').authWithPassword(username, password);
				if (!authUser) {
					return fail(401, { error: 'Incorrect username or password!' });
				}
			} catch (e) {
				return fail(401, { error: 'Something went wrong while creating a new user!' });
			}

			return fail(401, { error: 'Something went wrong while creating a new user!' });
		}

		if (!authUser) {
			return fail(401, { error: 'Incorrect username or password!' });
		}

		const cookie = locals.pb.authStore.exportToCookie();
		// Split apart the cookie string in order to set the cookie
		const cookieParts = cookie.split(';');
		const cookieName = cookieParts[0].split('=')[0];
		const cookieValue = cookieParts[0].split('=')[1];
		// const cookieOptions = cookieParts.slice(1).join(';');

		cookies.set(cookieName, cookieValue, {
			path: '/',
		});
	},
	newgame: async ({ locals, params }) => {
		if (!locals.pb) {
			return fail(500, { error: 'PocketBase not initialized!' })
		}
		const { id } = params;

		const lobby = await GetLobby(locals.pb, id);
		if (!lobby) {
			return fail(404, { error: 'Lobby not found' })
		}

		const game = await locals.pb.collection('games').create({
			lobbyId: lobby.lobbyId,
			players: [],
			rounds: [],
		});

		return {
			status: 200,
			body: game,
		};
	}
};