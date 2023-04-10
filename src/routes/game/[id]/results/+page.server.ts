import type { Game } from "$pb/pocketbase";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { lobby } = await parent();
	
	if (!locals.pb || !lobby) {
		throw error(500, "Database not initialized or not accessible!");
	}

	const game = await locals.pb.authStore.model?.expand?.game as Game | null;
	if (!game || game.status !== "finished") {
		throw redirect(303, `/game/${lobby.lobbyId}/play`);
	}

	return {
		game: structuredClone(game) as Game,
	}
};