<template>
    <ProductIntroPage v-if="!showCreateForm" @add-product="handleAddProduct" />
    <ProductInfoForm
        v-else
        :current-step="currentStep"
        @back="handleBack"
        @continue="handleContinue"
    />
</template>

<script setup>
import { ref } from "vue";
import ProductIntroPage from "../../components/Dashboard/Product/ProductIntroPage.vue";
import ProductInfoForm from "../../components/Dashboard/Product/ProductInfoForm.vue";

const showCreateForm = ref(false);
const currentStep = ref(1);

const handleAddProduct = () => {
    showCreateForm.value = true;
    currentStep.value = 1;
};

const handleBack = () => {
    if (currentStep.value === 1) {
        showCreateForm.value = false;
    } else {
        currentStep.value--;
    }
};

const handleContinue = (data) => {
    console.log("Form data:", data);
    
    // If moving to next main step (step 1 -> step 2, or step 2 -> step 3)
    if (data && data.moveToNextStep && currentStep.value < 3) {
        currentStep.value++;
    } else if (currentStep.value === 3 && data && data.moveToNextStep) {
        // Final step - submit form
        console.log("Submit form with data:", data);
        // You can add submission logic here
    }
};
</script>