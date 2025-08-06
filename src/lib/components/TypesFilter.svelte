<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from './ui/dropdown-menu';

	let {
		types,
		selectedTypes = $bindable(new Set<string>()),
		triggerText = 'Filter by Type',
		class: className = ''
	}: {
		types: string[];
		selectedTypes?: Set<string>;
		triggerText?: string;
		class?: string;
	} = $props();

    const toggleType = (typeName: string) => {
		if (selectedTypes.has(typeName)) selectedTypes.delete(typeName);
		else selectedTypes.add(typeName);
		selectedTypes = new Set(selectedTypes);
	};
</script>

<DropdownMenu>
	<DropdownMenuTrigger class={`mt-2 rounded-md bg-card px-4 py-2 text-sm text-foreground ${className}`}>
		{triggerText}
	</DropdownMenuTrigger>
	<DropdownMenuContent class="bg-card text-foreground">
		{#each types as type}
			<DropdownMenuItem>
				<button onclick={() => toggleType(type)} class="flex w-full items-center space-x-2">
					<input
						type="checkbox"
						checked={selectedTypes.has(type)}
						class="pointer-events-none accent-muted-foreground"
						readonly
					/>
					<span class="capitalize">{type}</span>
				</button>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
