import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const res = await fetch(`/api/pokemon/${params.id}`);
		const data = await res.json();

		if (!data.success) {
			throw error(404, 'Pokemon not found');
		}
		return {
			pokemon: data.data
		};
	} catch (err) {
		console.error(err);
	}
};
