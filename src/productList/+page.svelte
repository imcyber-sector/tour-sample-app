<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, scale, slide } from 'svelte/transition';
    import { ImagePlaceholder } from 'flowbite-svelte';
    
    import { ApiCalls } from '../../apiCalls';
    import { environment } from '../../environment/environment.dev';
    import { ProductListStore } from '../../stores/productStore';
    import ProductItem from './productItem.svelte';
    // import Header  from '../header/Header.svelte';
    
    onMount(() => {
        let apiCalls = new ApiCalls();
        apiCalls.getQuery(environment.productsEndPoint);
    });
</script>

<!-- <Header /> -->

<div class="skeleton">
    <ImagePlaceholder />
</div>

<div  class="productItems">
    {#each $ProductListStore as product}
        <!-- <div transition:fade> -->
        <div in:slide out:fade="{{ duration: 200 }}">
            <ProductItem product={product}/>
        </div>
    {/each}
</div>

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