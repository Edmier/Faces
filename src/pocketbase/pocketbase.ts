import { CreateLobbyState } from '$lib/game';
import type { Face } from 'facesjs';
import type PocketBase from 'pocketbase';

export async function GetLobby(pb: PocketBase, lobbyId: string) {
	try {
		const lobby = await pb.collection('lobbies').getFirstListItem<Lobby>('', {
			lobbyId: lobbyId,
		});

		if (!lobby) {
			return null;
		}

		if (!lobby.data) {
			return await CreateLobbyState(pb, lobby);
		}

		return lobby;
	} catch (_) {
		return null;
	}
}

export async function GetGame(pb: PocketBase, gameId: string) {
	try {
		const game = await pb.collection('games').getOne<Game>(gameId, {
			gameId: gameId,
		});

		if (!game) {
			return null;
		}

		return game;
	} catch (_) {
		return null;
	}
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
	data: LobbyData;
}

export interface LobbyData {
	wanted: WantedData[];
	waiting: WaitingData[];
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
	timestamp: number;
	choice: 'admit' | 'deny' | 'report';
	coinChange: number;
	person: string;
	warranted: boolean;
}

export interface GameData {
	deny: number;
	admit: number;
	report: number;
	wanted: {
		deny: number;
		admit: number;
		report: number;
	}
	blockedWanted: string[]
}

export interface WantedData {
	face?: Face,
	seed: string;
	createdAt: number;
	crime: string;
	guilty: boolean;
}

export interface WaitingData {
	face?: Face,
	seed: string;
	createdAt: number;
	guilty: boolean;
	netCoins: number;
}
