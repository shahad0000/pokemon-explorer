import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const [pokemonRes, typesRes] = await Promise.all([
			fetch('/api/pokemon?limit=20&offset=0'),
			fetch('/api/types')
		]);

		const pokemonData = await pokemonRes.json();
		const typesData = await typesRes.json();

		return {
			initialPokemonData: pokemonData.success ? {
				pokemons: pokemonData.data.pokemons || [],
				pagination: pokemonData.data.pagination || null
			} : { pokemons: [], pagination: null },
			types: typesData.success ? typesData.data.types?.map((t: any) => t.name) || [] : []
		};

	} catch (error) {
		console.error('Layout server load error:', error);
		return {
			initialPokemonData: { pokemons: [], pagination: null },
			types: [],
			error: error instanceof Error ? error.message : 'Failed to load data'
		};
	}
};