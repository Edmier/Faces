import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Game } from "$pb/pocketbase";

export const load = (async ({ parent, locals }) => {
	const { lobby } = await parent();

	if (!lobby) {
		throw error(404, "Lobby not found");
	}

	let games: Game[] = [];
	try {
		const result = await locals.pb.collection("games").getList<Game>(0, 500, {
			lobbyId: lobby.id
		});

		games = result.items;
	} catch (e) {
		throw error(500, "Could not load games!");
	}

	const results = games.map((game) => {
		return game.data;
	}).filter((data) => {
		return data !== null;
	});

	return {
		results
	};
}) satisfies PageServerLoad;