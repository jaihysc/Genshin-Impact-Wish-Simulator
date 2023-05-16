<script>
	// Library
	import { onMount, setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import { bannerActive, bannerList } from '$lib/store/stores';
	import { APP_TITLE } from '$lib/env';

	// Components
	import SelectBanner from './_select-banner.svelte';
	import Report from './_report.svelte';
	import Filter from './_filter.svelte';
	import Legends from './_legends.svelte';
	import Pagination from './_pagination.svelte';
	import List from './_list.svelte';
	import Title from '../_parts/title.svelte';

	let dataLength = 0;
	let filteredDataLength = 0;
	let activepage = 1;
	let itemPerPage = 5;
	let filterBy = 'All';

	$: banner = $bannerList.find((v, i) => i === $bannerActive).type;

	const selectBanner = (path) => {
		activepage = 1;
		banner = path;
		filterBy = 'All';
	};
	setContext('selectBanner', selectBanner);

	const clearHistory = () => {
		filterBy = 'clear';
		activepage = 1;
	};
	setContext('clearHistory', clearHistory);

	const filter = (selected) => {
		filterBy = selected;
		activepage = 1;
	};
	setContext('tableFilter', filter);

	const setDataLength = (allData, dataToShow) => {
		dataLength = allData;
		filteredDataLength = dataToShow;
	};
	setContext('setDataLength', setDataLength);

	const navigation = (page) => (activepage = page);
	setContext('navigation', navigation);

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<svelte:head>
	<title>
		{$t(`history.title`)} | {$t('title', { default: APP_TITLE })}
	</title>
</svelte:head>

<Title banner="history" />
<SelectBanner {banner} />
<div class="container">
	<div class="row">
		<Report {dataLength} {banner} />
		<Filter {filterBy} />
	</div>
	<List {banner} filter={filterBy} page={{ activepage, itemPerPage }} />
</div>
<Legends {banner} />
<Pagination dataLength={filteredDataLength} {itemPerPage} {activepage} />

<style>
	/* V2 */
	.row {
		display: flex;
	}

	.container {
		height: 100%;
		overflow: hidden;
	}
</style>
