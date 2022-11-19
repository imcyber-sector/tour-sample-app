<script lang="ts">
     import { page } from '$app/stores';
     import { Card, Button, Select } from "flowbite-svelte";
     import { onDestroy, onMount } from 'svelte';
     import { Modal } from 'flowbite-svelte';
     import { fade } from 'svelte/transition'
     import { goto } from '$app/navigation';
     
     import ContactForm from '../../contactForm/+page.svelte';
     import { ApiCalls } from '../../../apiCalls';
     import { environment } from '../../../environment/environment.dev';
     import { ProductDetailStore, ContactDetailStore } from '../../../stores/productStore';
     import type { Unit } from '../../../models/interfaces/unit';
     import type { Booking } from '../../../models/interfaces/booking';

     let data:any;
     let count:any = {};
     let selectedCurrency = "eur";
     let availableCurrencies:any = [];
     let totalAmount = 0;
     let booking: Booking;
     let formModal = false;
     let contactModelName = "We'll try to make this trip as one of the Best Trips of your life :)";
     
     onMount(() => {
        let apiCalls = new ApiCalls();
        apiCalls.getQuery(environment.productsEndPoint,$page.params.id);
     })
     
     const getCount = (unit:Unit,index:number) => {
          if(!count[index]) {
               count[index] = {[unit.id] : {}};
          }
          count[index][unit.id] = {
               quantity: 0, 
               price: unit.pricing.reduce((obj:any,item) => {
                    obj[item.currency]  = {price: item.price, currencyPrecision: item.currencyPrecision};
                    return obj;
               },{})
          };

          count[index]['total'] = 0

          // if(count.hasOwnProperty(`${id}_${index}`)) {
          //      // return count[`${id}_${index}`];
          //      return
          // }
          // count[`${id}_${index}`] = 0;
          // // return count[`${id}_${index}`];
          
     }
     const unsubscribe = ProductDetailStore.subscribe(value => {
	     data = value;
          if(data && data.availableCurrencies && data.availableCurrencies.length) {
               availableCurrencies = data.availableCurrencies.reduce((arr:any, item:string) => {
                    return [...arr, {value: item, name: item}];
               }, []);

               data?.options?.forEach((item1:any, index1:number) => {
                    item1.units.forEach((item2:any, index2:number) => {
                         getCount(item2, index1);
                    })
               })
          }
	});

     const decrement = (id:string,index:number) => {          
          // let temp = count[`${id}_${index}`];
          let temp = count[index][id].quantity;
          if(temp === 0) {
               return;
          }
          temp--;
          count[index][id].quantity = temp;
          let currencyPrecision = count[index][id].price[selectedCurrency].currencyPrecision;
          count[index]['total'] = Math.round((count[index]['total'] - (count[index][id].price[selectedCurrency].price / 10**currencyPrecision) ) * 10**currencyPrecision) / 10**currencyPrecision;
          // count[index]['total'] = Math.round((count[index]['total'] - count[index][id].price[selectedCurrency].price) * 10**count[index][id].price[selectedCurrency].currencyPrecision) / (10**count[index][id].price[selectedCurrency].currencyPrecision);
          count = JSON.parse(JSON.stringify(count));
          // count = { ...count, [`${id}_${index}`]: temp};
     }

     const increment = (id:string,index:number) => {
          // let temp = count[`${id}_${index}`];
          // count = { ...count, [`${id}_${index}`]: temp+1};
          let temp = count[index][id].quantity;
          count[index][id].quantity = temp+1;
          let currencyPrecision = count[index][id].price[selectedCurrency].currencyPrecision;
          count[index]['total'] = roundOfNumber(count[index]['total'], count[index][id].price[selectedCurrency].price, currencyPrecision);
          // count[index]['total'] - Math.round((count[index]['total'] + (count[index][id].price[selectedCurrency].price / 10**currencyPrecision) ) * 10**currencyPrecision) / 10**currencyPrecision;
          // count[index]['total'] = Math.round((count[index]['total'] + count[index][id].price[selectedCurrency].price) * 10**count[index][id].price[selectedCurrency].currencyPrecision) / (10**count[index][id].price[selectedCurrency].currencyPrecision);
          count = JSON.parse(JSON.stringify(count));
     }

     $: getAmount = (unit:Unit) => {
          let temp = unit.pricing.filter((item) => item.currency === selectedCurrency)[0]
          return roundOfNumber(0, temp.price, temp.currencyPrecision) + ` ${selectedCurrency}`; // temp.price / (10 ** temp.currencyPrecision)
     }

     const roundOfNumber = (total:number, num:number, precision:number) => {
          return Math.round((total + (num / 10**precision)) * 10**precision) / 10**precision;
     }

     const getTotal = (index:number) => {
          // let ans = Object.keys(count).filter((item) => item.includes(index.toString()));
          // let units = data.options[index].units;
          
          // totalAmount = ans.reduce((sum, item) => {
          //      let amount = 0;
          //      let currencyPrecision = 1;
          //      units.every((item2:Unit) => {
          //           if(item.includes(item2.id)) {
          //                let temp = item2.pricing.filter((item) => item.currency === selectedCurrency)[0];
          //                amount = temp.price / (10 ** temp.currencyPrecision);
          //                currencyPrecision = temp.currencyPrecision;
          //                return false;
          //           }
          //           return true;
          //      });
          //      return Math.round((sum+(amount*count[item])) * (10**currencyPrecision)) / (10**currencyPrecision);
          // },0);
          // return totalAmount + ` ${selectedCurrency}`;
          totalAmount = count[index]['total']

          return totalAmount;
     }

     const createBookingPayload = (index:number) => {
          let selectedItems = count[index];
          let units = data.options[index].units;

          let currencyPrecision;
          let unitItems = Object.keys(selectedItems).reduce((arr:any, item) => {
               if(item !== 'total') {
                    let quantity = selectedItems[item].quantity;
                    let unitId=item;
                    let price = +selectedItems[item].price[selectedCurrency].price;
                    currencyPrecision = +selectedItems[item].price[selectedCurrency].currencyPrecision
                    return quantity ? [...arr, {unitId, quantity, price}] : arr;
               }
               return arr;
          },[]);

          booking = {
               productId: data._id,
               optionId: data.options[index].id,
               pricing: {
                    currency: selectedCurrency,
                    currencyPrecision: currencyPrecision || 2,
                    price: count[index]['total']
               },
               unitItems: unitItems 
          };

          let contactDetail:any = $ContactDetailStore;
          if(Object.keys(contactDetail).length && contactDetail.fullname !== '' && contactDetail.emailAddress !== '' && contactDetail.phoneNumber !== '') {
               submitAndCloseContactForm();
          } else {
               formModal = true;
          }
     }

     const changeTotal = () => {
          Object.keys(count).forEach((item1) => {
               let total = 0;
               Object.keys(count[item1]).forEach((item2) => {
                    if(item2 !== 'total') {
                         total = roundOfNumber(total, count[item1][item2].price[selectedCurrency].price*count[item1][item2].quantity, count[item1][item2].price[selectedCurrency].currencyPrecision);
                    }
               });
               count[item1]['total'] = total;
          });
          count = JSON.parse(JSON.stringify(count));
     }

     const submitAndCloseContactForm = () => {
          formModal = false;
          let contactDetail:any = $ContactDetailStore;
          
          booking = {...booking, contact: contactDetail};
          console.log("booking : ",booking);

          goto('../../successPage');
     }

	onDestroy(unsubscribe);
</script>

<!-- <Header /> -->
{#if Object.keys(data).length}
     <!-- <h1>{$ProductDetailStore.name}</h1> -->
     <h2 class="text-4xl font-bold text-gray-900 dark:text-white w-full text-align text-capitalize"><u>{data.name}</u></h2>
     <div class="productItems">
          {#each data.options as option, i}
               <div class="max-width border rounded-md p-4 m-1 shadow-md" >
                    <h4 class=" text-center text-2xl font-bold text-gray-900 dark:text-white w-full text-capitalize">{option.name}</h4>
                    
                    <ul class="my-7 space-y-4">
                         <li class="flex space-x-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">2 team members</span>
                         </li>
                         <li class="flex space-x-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">20GB Cloud storage</span>
                         </li>
                         <li class="flex space-x-2">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Integration help</span>
                         </li>
                         <li class="flex space-x-2 line-through decoration-gray-500">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500">Sketch Files</span>
                         </li>
                         <li class="flex space-x-2 line-through decoration-gray-500">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500">API Access</span>
                         </li>
                         <li class="flex space-x-2 line-through decoration-gray-500">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500">Complete documentation</span>
                         </li>
                         <li class="flex space-x-2 line-through decoration-gray-500">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span class="text-base font-normal leading-tight text-gray-500">24×7 phone & email support</span>
                         </li>
                    </ul>


                    {#each option.units as unit}
                         <div class="flex-row-outer">
                              <span class="text-capitalize w-1/3">{unit.name} <span class="lowercase">({getAmount(unit)})</span></span>:
                              <div class="flex-row-inner">
                                   <button class="m-1.5" on:click={() => decrement(unit.id, i)}>-</button>
                                   <span class="m-1.5">{ count && count[i] && count[i][unit.id] ? count[i][unit.id].quantity : 0 }</span>
                                   <button class="m-1" on:click={() => increment(unit.id, i)}>+</button>
                              </div>
                         </div>
                         
                    {/each}

                    <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700">

                    <div class="flex-row-outer mb-4">
                         <span class="w-1/3">Total</span>
                         <span>{count[i]['total']} {selectedCurrency}</span>
                    </div>

                    <div class="flex-row-outer mb-4">
                         <span class="text-center m-auto w-1/3">Choose Currency</span>
                         <Select size="sm" class="mt-2" items={availableCurrencies} on:change={changeTotal} bind:value={selectedCurrency}/>
                    </div>

                     <Button class="w-full" on:click={() => createBookingPayload(i)}>Select</Button>
               </div>
          {/each}
          </div>
{/if}

{#if formModal}    
    <div in:fade="{{delay:200}}" out:fade="{{delay:200}}">
        <Modal bind:open={formModal} title={contactModelName} size="md" autoclose={false}>
            <ContactForm on:close-contact-form={submitAndCloseContactForm}/>
        </Modal>
    </div>
{/if}

<style>
     .text-align {
          text-align: center;
          margin: auto;
     }

     .text-capitalize {
          text-transform: capitalize;
     }

     .productItems {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .productItems>* {
        flex: 1 1;
        margin: 10px;
      }

      .flex-row-outer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
      }

      .flex-row-inner {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
      }

      @media (min-width: 1280px) { 
          .max-width {
               max-width: 33.33%;
          }
       }

       @media (max-width: 780px) {
          .productItems {
               display: flex;
               flex-direction: column;
               justify-content: space-evenly;
               flex-wrap: wrap;
          }

          .productItems>* {
               flex: 1;
               margin: 10px;
          }

          .max-width {
               max-width: 90%;
               margin: 1% 10%;
          }
       }

</style>
