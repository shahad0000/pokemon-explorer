<script lang="ts">
	export let pokemon: {
		id: number;
		name: string;
		types: string[];
	};
	import { typeColors } from '$lib/constants/typeColors';
</script>

<div class="flex-col rounded-2xl border border-neutral-700 px-5 py-5">
	<div class="text-2xl font-semibold capitalize">
		{pokemon.name}
	</div>
	<div class="flex justify-between">
		<div class="flex gap-2 text-neutral-300">
			<div>
				#{pokemon.id}
			</div>
			<div>
				{pokemon.types.join(', ')}
			</div>
		</div>
		<div class=" flex items-end gap-2">
			{#each pokemon.types as type}
				<div class={`${typeColors[type]} rounded-md h-fit text-white px-2`}>
					{type}
				</div>
			{/each}
		</div>
	</div>
</div>
