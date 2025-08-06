import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const res = await fetch('https://pokeapi.co/api/v2/type');
		
		if (!res.ok) {
			throw new Error(`PokeAPI responded with status: ${res.status}`);
		}

		const data = await res.json();

		const types = data.results
			.map((type: any) => ({
				name: type.name,
				url: type.url
			}))
			.filter((type: any) => 
				!['unknown', 'shadow'].includes(type.name)
			)
			.sort((a: any, b: any) => a.name.localeCompare(b.name));

		return json({
			success: true,
			data: {
				types,
				count: types.length
			}
		});

	} catch (error) {
		console.error('Types API error:', error);
		
		return json({
			success: false,
			error: 'Failed to fetch Pokemon types',
			details: error instanceof Error ? error.message : 'Unknown error'
		}, { 
			status: 500 
		});
	}
};