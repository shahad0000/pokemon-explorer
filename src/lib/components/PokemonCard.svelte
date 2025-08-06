<script lang="ts">
	export let pokemon: {
		id: number;
		name: string;
		types: Array<{type: {name: string}}>;
	};
	import TypeTag from './TypeTag.svelte';

</script>

<div class="hover:bg-card-clicked flex-col rounded-2xl border border-neutral-700 px-5 py-5">
	<div class="text-2xl font-semibold capitalize">
		{pokemon.name}
	</div>
	<div class="flex justify-between">
		<div class="flex gap-2 text-muted-foreground">
			<div>
				#{pokemon.id}
			</div>
			<div>
				{pokemon.types.map(typeObj => typeObj.type.name).join(', ')}
			</div>
		</div>
		<div class="flex items-end gap-2">
			{#each pokemon.types as typeObj}
				<TypeTag type={typeObj.type.name} />
			{/each}
		</div>
	</div>
</div>
