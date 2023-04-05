import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	await parent();

	if (!locals.pb) {
		throw error(500, 'PocketBase not initialized!');
	}

	const user = locals.pb.authStore.model;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	return {
		user: structuredClone(user.export())
	}
}