import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Game } from "$pb/pocketbase";

export const load = (async ({ parent, locals }) => {
	const { lobby } = await parent();

	if (!lobby) {
		throw error(404, "Lobby not found");
	}

	const games = await locals.pb.collection('games').getList<Game>(0, 500, {
		lobbyId: lobby.id
	});

	console.log(games);

}) satisfies PageServerLoad;