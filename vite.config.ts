import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		allowedHosts: ['pokemon-explorer-ykv5.onrender.com']
	},
	plugins: [tailwindcss(), sveltekit()]
});
