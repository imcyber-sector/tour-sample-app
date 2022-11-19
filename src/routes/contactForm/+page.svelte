<script>
    import { Button, Label, Input, Checkbox } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    
    import { ContactDetailStore } from '../../stores/productStore';

    let fullname = '';
    let emailAddress = '';
    /**
   * @type {any}
   */
    let phoneNumber;
    const dispatcher = createEventDispatcher();
    const submitAndClose = () => {
      let contactDetails = {fullname, emailAddress, phoneNumber}
      ContactDetailStore.set(contactDetails);
      dispatcher("close-contact-form");
    }
</script>

<div class="flex flex-col space-y-7">
    <!-- <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Interested in our products or want to know more?</h3> -->
    <p class="text-sm font-normal text-gray-500 dark:text-white p-0">Get in touch and we'll organise a demo for you</p>
    <Label class="space-y-2">
      <span>Your name *</span>
      <Input type="text" name="name" placeholder="Full name" bind:value={fullname} required/>
    </Label>
    <Label class="space-y-2">
      <span>Email *</span>
      <Input type="email" name="email" placeholder="name@company.com" bind:value={emailAddress} required />
    </Label>
    <Label class="space-y-2">
      <span>Phone *</span>
      <Input type="number" name="number" placeholder="eg, +421 9876543210" bind:value={phoneNumber} required />
    </Label>
    <Button type="submit" class="w-full1" on:click={submitAndClose}>Submit</Button>
</div>