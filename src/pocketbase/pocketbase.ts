import type PocketBase from 'pocketbase';

export function GetLobby(pb: PocketBase, lobbyId: string) {
	const lobby = pb.collection('lobbies').getFirstListItem<Lobby>('', {
		lobbyId: lobbyId,
	});

	if (!lobby) {
		return null
	}

	return lobby;
}

export interface Lobby {
	lobbyId: string;
	name: string;
	created: string;
	participants: number;
}

export interface Game {
	id: string;
	lobby: Lobby;
	username: string;
	userId: string;
	choices: Choice[];
	coins: number;
	startTime: string;
	status: 'new' | 'started' | 'finished';
}

export interface Choice {
	timestamp: string;
	choice: 'admit' | 'deny';
	coinChange: number;
	face: string;
	warrented: boolean;
}