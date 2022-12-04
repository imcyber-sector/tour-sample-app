<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { ImagePlaceholder } from 'flowbite-svelte';
    
    import { ApiCalls } from '../../apiCalls';
    import { environment } from '../../environment/environment.dev';
    import { ProductListStore } from '../../stores/productStore';
    import ProductItem from './productItem.svelte';
    import Loader from '../components/loader/+page.svelte';

    let isDataAvailable = true;
    let timer: NodeJS.Timeout | undefined;
    let waitTimeForAPI = 30000;
    
    onMount(() => {
        let apiCalls = new ApiCalls();
        apiCalls.getQuery(environment.productsEndPoint);
        timer = setTimeout(() => {
          if(!$ProductListStore.length) {
               isDataAvailable = false;
          }
        }, waitTimeForAPI);
    });

    onDestroy(() => {
          clearTimeout(timer);
     });
</script>

<!-- <div class="skeleton">
    <ImagePlaceholder />
</div> -->

<div  class="productItems">
    {#each $ProductListStore as product}
        <div in:slide out:fade="{{ duration: 200 }}">
            <ProductItem product={product}/>
        </div>
    {/each}
</div>
{#if !isDataAvailable}
    <div class="text-center">
        <p>Some error has occured !! Please try again. </p>
    </div>
{:else if !$ProductListStore}
    <Loader />
{/if}

<style>
    .skeleton {
        margin: 1% 5%;
    }

    .productItems {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .productItems>* {
        flex: 1 1 1;
        margin: 10px;
    }
</style>