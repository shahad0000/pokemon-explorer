# Pokémon Explorer

A sleek and interactive Pokémon explorer built with SvelteKit and Tailwind CSS.  
Search, filter by type, and view detailed stats for your favorite Pokémon!

---

## Features

- **Pokémon Search:** Quickly find Pokémon by name, type, or ID.  
- **Type Filtering:** Filter Pokémon list by one or multiple types using a dynamic dropdown.  
- **Pokémon Details:** View detailed stats, abilities, and official artwork in a side panel.  
- **Responsive Design:** Optimized for desktop and larger screens with a sticky sidebar navigation.  
- **Smooth Navigation:** Click on Pokémon to load detailed info without full page refresh.

---

## Tech Stack

- **SvelteKit** – Framework for building reactive web apps  
- **Tailwind CSS** – Utility-first CSS framework for styling  
- **TypeScript** – Typed JavaScript for better code quality  
- **Iconify** – For sleek, customizable icons  
- **PokeAPI** – RESTful Pokémon data API for fetching Pokémon info

---

## Project Structure

- `src/routes/+layout.svelte` – Main layout with Pokémon list, search, and filter  
- `src/routes/pokemon/[id].svelte` – Pokémon detail page loading data dynamically  
- `src/lib/components/PokemonCard.svelte` – Individual Pokémon card component  
- `src/lib/components/ui/*` – UI components like input, dropdown menu, etc.  
- `src/lib/typeColors.ts` – Tailwind CSS classes for Pokémon type colors
