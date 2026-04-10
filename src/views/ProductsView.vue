<template>
    <ProductIntroPage
        v-if="view === 'list'"
        ref="introPageRef"
        @add-product="handleAddProduct"
        @select-product="handleSelectProduct"
    />
    <ProductInfoForm
        v-else-if="view === 'create'"
        :current-step="currentStep"
        @back="handleBack"
        @continue="handleContinue"
        @close="handleCreateFlowClose"
    />
    <ProductEditPage
        v-else-if="view === 'edit' && editingProduct"
        :product="editingProduct"
        @back="handleCloseEdit"
        @saved="handleEditSaved"
        @deleted="handleEditDeleted"
    />
</template>

<script setup>
import { ref } from "vue";
import ProductIntroPage from "../components/Dashboard/Product/ProductIntroPage.vue";
import ProductInfoForm from "../components/Dashboard/Product/ProductInfoForm.vue";
import ProductEditPage from "../components/Dashboard/Product/ProductEditPage.vue";

const view = ref("list"); // 'list' | 'create' | 'edit'
const currentStep = ref(1);
const editingProduct = ref(null);
const introPageRef = ref(null);

const handleAddProduct = () => {
    view.value = "create";
    currentStep.value = 1;
};

const handleSelectProduct = (product) => {
    if (!product?.id) return;
    editingProduct.value = product;
    view.value = "edit";
};

const handleCloseEdit = () => {
    editingProduct.value = null;
    view.value = "list";
};

const handleEditSaved = () => {
    introPageRef.value?.fetchProducts?.();
    handleCloseEdit();
};

const handleEditDeleted = () => {
    introPageRef.value?.fetchProducts?.();
    handleCloseEdit();
};

const handleBack = () => {
    if (currentStep.value === 1) {
        view.value = "list";
    } else {
        currentStep.value--;
    }
};

const handleContinue = (data) => {
    console.log("Form data:", {
        websiteUrl: data?.websiteUrl,
        productName: data?.productName,
        description: data?.description,
        brandColors: data?.brandColors,
        brandVoice: data?.brandVoice,
        typography: data?.typography,
        moveToNextStep: data?.moveToNextStep,
    });

    if (data && data.moveToNextStep && currentStep.value < 3) {
        currentStep.value++;
    }
};

const handleCreateFlowClose = () => {
    view.value = "list";
    introPageRef.value?.fetchProducts?.();
};
</script>
