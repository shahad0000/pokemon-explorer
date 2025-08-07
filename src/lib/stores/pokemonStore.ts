import { writable, get } from 'svelte/store';
import type { Pokemon } from '$lib/types';

interface PokemonState {
	pokemons: Pokemon[];
	types: string[];
	loading: boolean;
	loadingMore: boolean;
	searching: boolean;
	error: string | null;
	searchResults: Pokemon[];
	isSearchMode: boolean;
	initialized: boolean; 
	pagination: {
		limit: number;
		offset: number;
		total: number;
		hasMore: boolean;
	} | null;
}

const initialState: PokemonState = {
	pokemons: [],
	types: [],
	loading: false,
	loadingMore: false,
	searching: false,
	error: null,
	searchResults: [],
	isSearchMode: false,
	initialized: false,
	pagination: null
};

const createPokemonStore = () => {
	const { subscribe, set, update } = writable<PokemonState>(initialState);

	return {
		subscribe,
		initializeFromLayout(layoutData: any) {
			update((state) => {
				if (state.initialized) return state;

				return {
					...state,
					pokemons: layoutData.initialPokemonData?.pokemons || [],
					types: layoutData.types || [],
					initialized: true,
					pagination: layoutData.initialPokemonData?.pagination
						? {
								limit: layoutData.initialPokemonData.pagination.limit || 20,
								offset: layoutData.initialPokemonData.pagination.offset || 0,
								total: layoutData.initialPokemonData.pagination.total || 0,
								hasMore: layoutData.initialPokemonData.pagination.hasMore || false
							}
						: {
								limit: 20,
								offset: 0,
								total: layoutData.initialPokemonData?.pokemons?.length || 0,
								hasMore: false
							}
				};
			});
		},

		async loadMorePokemon(fetch: typeof globalThis.fetch) {
			update((state) => {
				if (state.loadingMore || !state.pagination?.hasMore) return state;
				return { ...state, loadingMore: true, error: null };
			});

			try {
				const currentState = get({ subscribe });
				if (!currentState.pagination) return;

				const nextOffset = currentState.pagination.offset + currentState.pagination.limit;
				const pokemonRes = await fetch(`/api/pokemon?limit=20&offset=${nextOffset}`);
				const pokemonData = await pokemonRes.json();

				if (!pokemonData.success) {
					throw new Error(pokemonData.error || 'Failed to load more Pokemon');
				}

				update((state) => ({
					...state,
					pokemons: [...state.pokemons, ...(pokemonData.data.pokemons || [])],
					pagination: pokemonData.data.pagination
						? {
								limit: pokemonData.data.pagination.limit || 20,
								offset: pokemonData.data.pagination.offset || 0,
								total: pokemonData.data.pagination.total || 0,
								hasMore: pokemonData.data.pagination.hasMore || false
							}
						: {
								limit: 20,
								offset: state.pagination?.offset || 0,
								total: state.pokemons.length + (pokemonData.data.pokemons?.length || 0),
								hasMore: false
							},
					loadingMore: false,
					error: null
				}));
			} catch (error) {
				console.error('Load more Pokemon error:', error);
				update((state) => ({
					...state,
					loadingMore: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				}));
			}
		},

		async searchPokemon(fetch: typeof globalThis.fetch, query: string) {
			if (!query || query.length < 2) {
				update((state) => ({
					...state,
					searchResults: [],
					isSearchMode: false,
					searching: false
				}));
				return;
			}

			update((state) => ({ ...state, searching: true, error: null }));

			try {
				const searchUrl = `/api/pokemon/search?q=${encodeURIComponent(query)}&limit=50`;
				const searchRes = await fetch(searchUrl);
				const searchData = await searchRes.json();

				if (!searchData.success) {
					throw new Error(searchData.error || 'Search failed');
				}

				update((state) => ({
					...state,
					searchResults: searchData.data.pokemons,
					isSearchMode: true,
					searching: false,
					error: null
				}));
			} catch (error) {
				console.error('Search error:', error);
				update((state) => ({
					...state,
					searching: false,
					isSearchMode: false,
					searchResults: [],
					error: error instanceof Error ? error.message : 'Search failed'
				}));
			}
		},

		clearSearch() {
			update((state) => ({
				...state,
				searchResults: [],
				isSearchMode: false,
				searching: false
			}));
		},

		reset() {
			set(initialState);
		}
	};
};

export const pokemonStore = createPokemonStore();