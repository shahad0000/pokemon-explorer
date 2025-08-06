import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '20');
	const offset = parseInt(url.searchParams.get('offset') ?? '0');
  
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
	const data = await res.json();
  
	const pokemons = await Promise.all(
		data.results.map(async (poke: any) => {
			const detail = await fetch(poke.url).then((r) => r.json());
			return {
				id: detail.id,
				name: detail.name,
				types: detail.types,
			};
		})
	);

	const total = data.count; 
	const hasMore = (offset + limit) < total;
  
	return json({
		success: true,
		data: {
			pokemons,
			pagination: {
				limit,
				offset,
				total,
				hasMore
			}
		}
	});
};