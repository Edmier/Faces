import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { GetLobby, type Lobby } from '$pb/pocketbase';

export const actions: Actions = {
	default: async ({ locals, request, params, cookies }) => {
		if (!locals.pb) {
			return fail(500, { error: 'PocketBase not initialized!' })
		}

		const { id } = params;

		let lobby: Lobby | null;
		try {
			lobby = await GetLobby(locals.pb, id);
		} catch (_) {
			return fail(404, { error: 'Lobby not found' });
		}
		if (!lobby) {
			return fail(404, { error: 'Lobby not found' });
		}

		const form = await request.formData();
		const username = form.get('name') as string;
		const password = (form.get('password') ?? crypto.randomUUID()) as string;

		if (!username || !password) {
			return fail(400, { error: 'Missing username or password' });
		}

		if (username.length < 5) {
			return fail(401, { error: 'Please have username be at least 5 characters' });
		}

		let authUser = null;
		try {
			authUser = await locals.pb.collection('users').authWithPassword(username, password, {});

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
	
				authUser = await locals.pb.collection('users').authWithPassword(username, password, {}, {
					expand: 'game'
				});

				if (!authUser) {
					return fail(401, { error: 'Incorrect username or password!' });
				}
			} catch (e) {
				console.error(e);
				return fail(401, { error: 'Something went wrong while creating a new user!' });
			}

			if (authUser) {
				cookies.set('pb_token', locals.pb.authStore.token, {
					path: '/',
					maxAge: 604800,
				});
				
				throw redirect(302, `/game/${id}/play`);
			} else {
				return fail(401, { error: 'Incorrect username or password!' });
			}
		}

		if (!authUser) {
			return fail(401, { error: 'Incorrect username or password!' });
		}

		if (locals.pb.authStore.token) {
			cookies.set('pb_token', locals.pb.authStore.token, {
				path: '/',
				maxAge: 604800,
			});
		}

		throw redirect(302, `/game/${id}/play`);
	},
};