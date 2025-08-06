<script lang="ts">
	import Icon from '@iconify/svelte';

	const {
		text,
		icon,
		onclick,
		class: className = ''
	}: {
		text: string;
		icon: string;
		onclick?: () => void;
		class?: string;
	} = $props();
</script>

<button
	class={`flex w-full cursor-pointer items-center gap-4 rounded-xl bg-card p-3 text-2xl ${className}`}
	{onclick}
>
	<Icon {icon} class="text-muted-foreground" />
	{text}
</button>
