<script lang="ts">
  import { Button, Label, Input } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';
  
  import { ContactDetailStore } from '../../../stores/productStore';
  let fullname:string = '';
  let emailAddress:string = '';
  let phoneNumber:string = '+421';
  const dispatcher = createEventDispatcher();
  let submitButtonDisabled = true;
  let showEmailValidation = false;
  $: submitButtonDisabled = fullname.length<3 || !emailAddress || phoneNumber.length<10;
  
  function checkNumberInput(e:any) {
    console.log(`${e.key} : ${e.keyCode}`)
    if(!((e.key === '+' && !phoneNumber.includes('+')) || (e.keyCode >= 48 && e.keyCode < 58))){
      e.preventDefault();
    }
  }
  
  const submitAndClose = () => {
    showEmailValidation = false;
    if (!isValidEmail(emailAddress.trim())) {
      showEmailValidation = true;
      return;
    }
    let contactDetails = {fullname: fullname.trim(), emailAddress: emailAddress.trim(), phoneNumber: phoneNumber.trim()}
    ContactDetailStore.set(contactDetails);
    closeContactForm();
  }
  
  const closeContactForm = () => {
    dispatcher("close-contact-form");
  }

  const isValidEmail = (value:string) => {
    return value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  }
</script>

<div class="flex flex-col space-y-7">
    <p class="text-sm font-normal text-gray-500 dark:text-white p-0">Get in touch and we'll organise a demo for you</p>
    <Label class="space-y-2">
      <span>Your name *</span>
      <Input type="text" name="name" placeholder="Full name" maxlength="50" bind:value={fullname} required/>
    </Label>
    <Label class="space-y-2">
      <span>Email *</span>
      <Input type="email" name="email" placeholder="name@company.com" maxlength="50" bind:value={emailAddress} required />
      {#if showEmailValidation}
        <span class="text-rose-500">Please enter a valid email address !!</span>
      {/if}
    </Label>
    <Label class="space-y-2">
      <span>Phone *</span>
      <Input type="text" name="number" placeholder="eg, +4219876543210" maxlength="14" on:keypress={checkNumberInput} bind:value={phoneNumber} required />
    </Label>
    <div class="flex flex-row justify-evenly">
      <Button type="submit" class="w-5/12" gradient color="blue" on:click={submitAndClose} bind:disabled={submitButtonDisabled}>Submit</Button>
      <Button type="submit" class="w-5/12" gradient color="red" on:click={closeContactForm}>Cancel</Button>
    </div>
</div>