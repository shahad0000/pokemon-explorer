import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	try {
		const { id } = params;	
		const pokemonId = parseInt(id);
        
		if (isNaN(pokemonId) || pokemonId < 1) {
			throw error(400, 'Invalid Pokemon ID');
		}

		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
		
		if (!res.ok) {
			if (res.status === 404) {
				throw error(404, 'Pokemon not found');
			}
			throw error(res.status, 'Failed to fetch Pokemon data');
		}

		const pokemon = await res.json();

		const pokemonData = {
			id: pokemon.id,
			name: pokemon.name,
			height: pokemon.height,
			weight: pokemon.weight,
			base_experience: pokemon.base_experience,
			types: pokemon.types,
			stats: pokemon.stats,
			abilities: pokemon.abilities,
			sprites: {
				front_default: pokemon.sprites.front_default,
				back_default: pokemon.sprites.back_default,
				front_shiny: pokemon.sprites.front_shiny,
				back_shiny: pokemon.sprites.back_shiny,
				other: {
					'official-artwork': {
						front_default: pokemon.sprites.other['official-artwork']?.front_default || null
					}
				}
			},
			species: pokemon.species
		};

		return json({
			success: true,
			data: pokemonData
		});

	} catch (err) {
		console.error('Pokemon detail API error:', err);
		
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		return json({
			success: false,
			error: 'Internal server error',
			details: err instanceof Error ? err.message : 'Unknown error'
		}, { 
			status: 500 
		});
	}
};