<script lang="ts">
	import { typeColors } from '$lib/constants/typeColors';

	const {
		type,
		size = 'default',
		class: className = '',
	}: {
		type: string;
		size?: 'small' | 'default' | 'large';
		class?: string;
	} = $props();

	const sizeClasses = {
		small: 'px-2 py-0.5 text-xs',
		default: 'px-2 py-1 text-sm',
		large: 'px-3 py-1.5 text-base'
	};
</script>

<div class={`${typeColors[type]} ${sizeClasses[size]} ${className} h-fit rounded-md px-2`}>
	{type}
</div>
