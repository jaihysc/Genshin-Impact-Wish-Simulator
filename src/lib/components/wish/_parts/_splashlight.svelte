<script>
	import { assets } from '$lib/store/stores';

	export let type = '';
	export let rarity = 0;
</script>

{#if type === 'in'}
	<video autoplay>
		<source src={$assets[`${rarity}star-splashout.webm`]} type="video/webm">
	</video>
{/if}

{#if type === 'out'}
	<video autoplay>
		<source src={$assets[`${rarity}star-splashout2.webm`]} type="video/webm">
	</video>
{/if}

<style>
	video {
		object-fit: cover;
		width: 100vw;
		height: 100vh;
		position: absolute;
	}
</style>
