import type { Pokemon } from '$lib/types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	try {
		const [pokemonRes, typesRes] = await Promise.all([
			fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0'), 
			fetch('https://pokeapi.co/api/v2/type')
		]);
		const pokemonData = await pokemonRes.json();
		const typeData = await typesRes.json();
        
        // fetch pokemons' details
		const pokemons: Pokemon[] = await Promise.all(
			pokemonData.results.map(async (poke: any) => {
				const details = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.name}/`).then((r) =>
					r.json()
				);
				return {
					id: details.id,
					name: details.name,
					types: details.types.map((t: any) => t.type.name)
				};
			})
		);
        const types = typeData.results.map((t: any) => t.name);

        return { pokemons, types };
	} catch (err) {
		console.error(err);
		return { pokemons: [] };
	}
};
