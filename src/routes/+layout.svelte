<script>
	// Packagae
	import { registerSW } from 'virtual:pwa-register';
	import { isLoading, locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { onMount, setContext } from 'svelte';
	import {
		viewportHeight,
		viewportWidth,
		isMobile,
		mobileMode,
		isAcquaintUsed,
		bannerActive,
		bannerList,
		assets,
		isPWA
	} from '$lib/store/stores';
	import { HOST, DESCRIPTION, KEYWORDS, APP_TITLE } from '$lib/env';
	import { mountLocale } from '$lib/helpers/i18n';
	import { importLocalBalance } from '$lib/helpers/importLocalData';
	import { mobileDetect } from '$lib/helpers/mobileDetect';
	import { userCurrencies } from '$lib/helpers/currencies';
	import { wakeLock } from '$lib/helpers/wakeLock';
	import '../app.css';
	import Loader from '$lib/components/utility/Loader.svelte';
	import Iklan from '$lib/components/utility/Iklan.svelte';

	let innerHeight;
	let innerWidth;
	let isBannerLoaded = false;
	let isloaded = false;

	$: isCN = $locale?.toLowerCase().includes('cn');
	$: viewportWidth.set(innerWidth);
	$: viewportHeight.set(innerHeight);
	$: path = $page.url.pathname.split('/');
	$: directLoad = path[1] !== '';
	$: preview = path[1] === 'screen';

	$: if ($bannerList.length > 0) {
		const { type } = $bannerList[$bannerActive];
		isAcquaintUsed.set(type === 'standard' || type === 'beginner');
	}

	const setMobileMode = () => {
		if ($isPWA) return mobileMode.set(true);
		const angle = screen.orientation?.angle || 0;
		const rotate = angle === 90 || angle === 270;
		mobileMode.set(rotate);
	};

	const bannerLoaded = () => (isBannerLoaded = true);
	setContext('bannerLoaded', bannerLoaded);
	const loaded = () => (isloaded = true);
	setContext('loaded', loaded);

	mountLocale();
	onMount(() => {
		const available = ['install', 'privacy-policy', 'screen'];
		if (path[1] && !available.includes(path[1].toLowerCase())) return window.location.replace('/');

		const url = new URL(window.location.href);
		const searchParams = new URLSearchParams(url.search);
		isPWA.set(searchParams.get('pwa') === 'true');

		registerSW();
		wakeLock();
		importLocalBalance();
		userCurrencies.init();

		isMobile.set(mobileDetect() || innerWidth < 601);
		if ($isMobile) setMobileMode();

		window.addEventListener('orientationchange', () => {
			if ($isMobile) setMobileMode();
		});

		// prevent Righ click (hold on android) on production mode
		if (!dev) document.addEventListener('contextmenu', (e) => e.preventDefault());
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<svelte:head>
	<meta name="description" content={DESCRIPTION} />
	<meta name="keywords" content={KEYWORDS} />
	<meta property="al:web:url" content={HOST} />
	<link rel="fluid-icon" href="{HOST}/screenshot/meta-picture.jpg" title={APP_TITLE} />

	<meta property="og:url" content={HOST} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={APP_TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content="{HOST}/screenshot/meta-picture.jpg" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={HOST.replace('https://', '').replace('http://', '')} />
	<meta property="twitter:url" content={HOST} />
	<meta name="twitter:title" content={APP_TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{HOST}/screenshot/meta-picture.jpg" />

	{#if !dev}
		<link rel="manifest" href="/appmanifest.json" />
	{/if}

	{#if isloaded}
		<Iklan head />
	{/if}
</svelte:head>

<Loader {isBannerLoaded} {directLoad} />

<main
	class:mobile={$mobileMode}
	class:preview
	class={$locale}
	style="height: {$viewportHeight ? `${$viewportHeight}px` : '100vh'}"
>
	{#if !$isLoading && isloaded}
		<slot />
	{/if}
	<a
		href="/"
		on:click|preventDefault={() => window.location.replace('/')}
		class="uid"
		title="Try Your Luck by this Simulator"
	>
		WishSimulator.App
	</a>

	<img
		src={$assets[`genshin-logo${isCN ? '-cn' : ''}.webp`]}
		alt="genshin logo"
		class="logo"
		class:cn={isCN}
	/>
</main>

<style>
	@import '../../node_modules/overlayscrollbars/css/OverlayScrollbars.css';

	:global(.os-theme-light > .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle) {
		background-color: #d2c69c;
		opacity: 0.7;
	}
	:global(.os-theme-light > .os-scrollbar-vertical) {
		width: 8px;
	}
	:global(.os-theme-light > .os-scrollbar-horizontal) {
		height: 8px;
	}

	main {
		display: block;
		width: 100%;
		overflow: hidden;
	}

	:global(audio) {
		visibility: hidden;
	}

	.uid {
		display: block;
		position: fixed;
		bottom: 0px;
		right: 5px;
		z-index: 9999;
		color: #fff;
		text-shadow: 0 0 1.5px rgba(0, 0, 0, 0.7);
		font-family: Roboto, sans-serif;
		pointer-events: none;
	}

	.preview .uid {
		pointer-events: unset;
		right: unset;
		left: 1rem;
		bottom: 1rem;
	}
	.logo {
		display: none;
	}
	.preview .logo {
		display: block;
		width: 30vh;
		max-width: 30%;
		position: fixed;
		bottom: 0px;
		right: 5px;
	}

	.preview .logo.cn {
		max-height: 20vh;
		width: 20vh;
	}
</style>