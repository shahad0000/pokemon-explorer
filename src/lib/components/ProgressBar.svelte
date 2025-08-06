<script lang="ts">
	const {
		name,
		value,
		color = 'bg-cyan-600',
		class: className = ''
	}: {
		name: string;
		value: number;
		color?: string;
		class?: string;
	} = $props();
</script>

<div class="mb-2 flex items-center gap-4 text-sm text-muted-foreground capitalize">
	<span class="w-30 font-medium">
		{name === 'hp' ? 'HP' : name}
	</span>
	<div class="h-1.5 flex-1 overflow-hidden rounded bg-card">
		<div class={`h-full ${color}`} style="width: {Math.min(value, 100)}%"></div>
	</div>
	<span class="w-8 text-right font-semibold">{value}</span>
</div>
