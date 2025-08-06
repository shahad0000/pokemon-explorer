<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Input } from './ui/input';

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		class: className = '',
		icon = 'mdi:magnify'
	}: {
		value?: string;
		placeholder?: string;
		class?: string;
		icon?: string;
	} = $props();
</script>

<div class={`flex h-fit flex-1 items-center rounded-xl bg-card px-4 focus-within:border ${className}`}>
	<Icon {icon} class="h-5 w-5 text-muted-foreground" />
	<Input
		{placeholder}
		bind:value
		class="flex border-none !bg-transparent text-foreground placeholder-muted-foreground shadow-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
	/>
</div>
