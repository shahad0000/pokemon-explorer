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

export const store = $state<PokemonState>(initialState);

export const initializeFromLayout = (layoutData: any) => {
	if (store.initialized) return;
	store.pokemons = layoutData.initialPokemonData?.pokemons || [];
	store.types = layoutData.types || [];
	store.initialized = true;
	store.pagination = layoutData.initialPokemonData?.pagination
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
			};
};

//Load more
export const loadMorePokemon = async (fetch: typeof globalThis.fetch) => {
	if (store.loadingMore || !store.pagination?.hasMore) return;
	store.loadingMore = true;
	store.error = null;

	try {
		const nextOffset = (store.pagination?.offset ?? 0) + (store.pagination?.limit ?? 20);
		const res = await fetch(`/api/pokemon?limit=20&offset=${nextOffset}`);
		const data = await res.json();

		if (!data.success) {
			throw new Error(data.error || 'Failed to load more Pokemon');
		}

		store.pokemons = [...store.pokemons, ...(data.data.pokemons || [])];
		((store.pagination = data.data.pagination
			? {
					limit: data.data.pagination.limit || 20,
					offset: data.data.pagination.offset || 0,
					total: data.data.pagination.total || 0,
					hasMore: data.data.pagination.hasMore || false
				}
			: {
					limit: 20,
					offset: store.pagination?.offset || 0,
					total: store.pokemons.length + (data.data.pokemons?.length || 0),
					hasMore: false
				}),
			(store.loadingMore = false));
		store.error = null;
	} catch (error) {
		console.error('Load more Pokemon error:', error);
		store.loadingMore = false;
		store.error = error instanceof Error ? error.message : 'Unknown error';
	}
};

export const searchPokemon = async (fetch: typeof globalThis.fetch, query: string) => {
	if (!query || query.length < 2) {
		store.searchResults = [];
		store.isSearchMode = false;
		store.searching = false;
		return;
	}

	store.searching = true;
	store.error = null;
	try {
		const searchUrl = `/api/pokemon/search?q=${encodeURIComponent(query)}&limit=50`;
		const res = await fetch(searchUrl);
		const data = await res.json();

		if (!data.success) {
			throw new Error(data.error || 'Search failed');
		}
		((store.searchResults = data.data.pokemons),
			(store.isSearchMode = true),
			(store.searching = false),
			(store.error = null));
	} catch (error) {
		console.error('Search error:', error);
		store.searching = false;
		store.isSearchMode = false;
		store.searchResults = [];
		store.error = error instanceof Error ? error.message : 'Search failed';
	}
};
export const clearSearch = () => {
	store.searchResults = [];
	store.isSearchMode = false;
	store.searching = false;
};

export const reset = () => {
	Object.assign(store, initialState);
};
