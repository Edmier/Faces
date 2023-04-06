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

export interface User {
	id: string;
	username: string;
	lobbyId: string;
	game: Game;
}

export interface Lobby {
	id: string;
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
	data: GameData;
}

export interface Choice {
	timestamp: string;
	choice: 'admit' | 'deny' | 'report';
	coinChange: number;
	person: string;
	warrented: boolean;
}

export interface GameData {
	wanted: WantedData[];
	waiting: WaitingData[];
}

export interface WantedData {
	seed: string;
	createdAt: number;
	crime: string;
	face: string;
	guilty: boolean;
}

export interface WaitingData {
	seed: string;
	createdAt: number;
	isWanted: boolean;
	netCoins: number;
}
