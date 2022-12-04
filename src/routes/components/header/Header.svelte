<script lang='ts'>
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Modal } from 'flowbite-svelte';
    import { fade } from 'svelte/transition'

    import ContactForm from '../contactForm/+page.svelte';
    
    let formModal = false;
    let contactModelName = "Interested in our products or want to know more?";

    const submitAndCloseContactForm = () => {
        formModal = false;
    }
</script>


<Navbar let:hidden color="red" let:toggle>
    <NavBrand href="/">
        <img
            src="https://flowbite.com/docs/images/logo.svg"
            class="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
        />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Tours&Travels
        </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/productList">Products</NavLi>
        <NavLi on:click={() => formModal = true}>Contact</NavLi>
        <NavLi href="/about">About</NavLi>
    </NavUl>
</Navbar>

{#if formModal}    
    <div in:fade="{{delay:200}}" out:fade="{{delay:200}}">
        <Modal bind:open={formModal} title={contactModelName} size="md" autoclose={false}>
            <ContactForm on:close-contact-form={submitAndCloseContactForm}/>
        </Modal>
    </div>
{/if}

<style>
</style>
