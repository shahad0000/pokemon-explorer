import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const query = url.searchParams.get('q')?.toLowerCase() || '';
	const limit = parseInt(url.searchParams.get('limit') ?? '50');
	
	if (!query || query.length < 2) {
		return json({
			success: true,
			data: {
				pokemons: [],
				total: 0
			}
		});
	}

	try {
		const allPokemonRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
		const allPokemonData = await allPokemonRes.json();
		
		const matchingPokemon = allPokemonData.results.filter((pokemon: any) =>
			pokemon.name.toLowerCase().includes(query)
		).slice(0, limit);

		const detailedPokemon = await Promise.all(
			matchingPokemon.map(async (pokemon: any) => {
				const detail = await fetch(pokemon.url).then(r => r.json());
				return {
					id: detail.id,
					name: detail.name,
					types: detail.types,
				};
			})
		);

		return json({
			success: true,
			data: {
				pokemons: detailedPokemon,
				total: detailedPokemon.length
			}
		});

	} catch (error) {
		console.error('Search error:', error);
		return json({
			success: false,
			error: 'Failed to search Pokemon'
		}, { status: 500 });
	}
};