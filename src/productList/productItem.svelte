<script>
// @ts-nocheck

    import { Card, Button, Rating, Badge } from "flowbite-svelte";
    /**
   * @type {import("src/models/interfaces/product").Product}
   */
     export let product;
     let adultPrice;
     if(product && product.options && product.options.length && product.options[0].units && product.options[0].units.length) {
      let tempArr = product.options[0].units.filter((item) => item.id === 'adult');
      tempArr.length ? adultPrice = tempArr[0].pricing[0] : '';
     }
</script>

<Card class="text-center" size="md" color='green' padding="sm" shadow={true} border={true} >
  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-transform"><u>{product.name}</u></h5>
  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
  {#if adultPrice}  
    <h5 class="mb-2 text-xl font-medium tracking-tight text-gray-900 dark:text-white text-border"><span class="text-transform">{product.options[0].name} </span> starts with just : <span class="text-uppercase">{adultPrice.price / (10 ** adultPrice.currencyPrecision)} {adultPrice.currency}</span>/adult*</h5>
  {/if}
  <Button href="/productDetail/{product._id}" gradient color="pinkToOrange" shadow="red">
    More Details <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
  </Button>
</Card>

<style>
  .text-transform {
    text-transform: capitalize;
  }
  .text-uppercase {
    text-transform: uppercase;
  }
  .text-border {
    /* border: 3px double rgb(238, 84, 84); */
    border-radius: 3px;
  }
</style>
