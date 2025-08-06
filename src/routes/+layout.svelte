<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { isDark } from '$lib/stores/theme';
	import NavBtn from '$lib/components/NavBtn.svelte';
	let showMobileMenu = $state(false);
	let { children } = $props();

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', $isDark);
		}
	});
</script>

<div
	class="flex min-h-screen min-w-screen bg-background p-1 text-foreground lg:p-5"
	class:dark={$isDark}
>
	<div class="flex w-full flex-col-reverse rounded-2xl border border-muted lg:flex-row">
		<!-- Mobile Menu -->
		<div class=" order-1 flex items-center justify-between px-5 py-4 lg:hidden">
			<div class="flex items-center gap-3 text-xl font-semibold">
				<img src="/pokemon.png" alt="pokemon icon" class="h-8 w-8" />
				<p>Pokémon Explorer</p>
			</div>
			<button onclick={() => (showMobileMenu = !showMobileMenu)}>
				<Icon icon="lucide:menu" class="h-7 w-7" />
			</button>
		</div>
		{#if showMobileMenu}
			<div
				role="button"
				tabindex="0"
				class="fixed inset-0 z-50 bg-background/90 p-5 backdrop-blur-sm lg:hidden"
				onclick={() => (showMobileMenu = false)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						showMobileMenu = false;
					}
				}}
			>
				<div class="flex flex-col space-y-4">
					<button class="flex items-center gap-3 rounded-xl bg-card p-3 text-xl">
						<Icon icon="lucide:compass" class="text-muted-foreground" />
						<p>Explore</p>
					</button>

					<button
						onclick={() => isDark.update((v) => !v)}
						class="flex items-center gap-3 rounded-xl bg-card p-3 text-xl"
					>
						<Icon icon={$isDark ? 'lucide:sun' : 'lucide:moon'} class="text-muted-foreground" />
						<p>{$isDark ? 'Light' : 'Dark'} Mode</p>
					</button>
				</div>
			</div>
		{/if}
		<!-- Desktop Menu -->
		<div
			class="sticky top-0 hidden h-screen items-center space-y-5 px-9 py-5 lg:flex lg:w-2/8 lg:flex-col"
		>
			<div class="flex w-83 gap-4 text-3xl font-semibold">
				<div class="aspect-square w-10">
					<img src="/pokemon.png" alt="pokemon icon" />
				</div>
				<p>Pokémon Explorer</p>
			</div>
			<div class="flex w-full flex-col items-start space-y-3">
				<NavBtn icon="lucide:compass" text="Explore" />
				<NavBtn
					icon={$isDark ? 'lucide:sun' : 'lucide:moon'}
					onclick={() => isDark.update((v) => !v)}
					text={`${$isDark ? 'Light' : 'Dark'} Mode`}
				/>
			</div>
		</div>
		{@render children()}
	</div>
</div>
