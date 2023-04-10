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
	wanted: WantedData[];
	waiting: WaitingData[];
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
	isWanted: boolean;
	netCoins: number;
}
