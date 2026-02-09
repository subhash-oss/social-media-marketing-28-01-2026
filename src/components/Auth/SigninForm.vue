<template>
  <div class="flex min-h-screen items-center justify-center px-6">
    <div class="w-full max-w-md">

      <!-- Logo (Mobile & Tablet only) -->
      <div class="block lg:hidden">
        <Logo />
      </div>

      <!-- Heading -->
      <h2 class="heading_h5_semibold primary_text_color">
        Sign In
      </h2>

      <p class="label_1_regular secondary_text_color mt-md">
        Manage your posts, analytics, and campaigns with AI.
      </p>

      <!-- Google Sign In -->
      <GoogleSignin />

      <!-- Divider -->
      <div class="my-3xl flex items-center gap-3xl">
        <div class="h-px flex-1 bg-gray-25"></div>
        <span class="or_text">OR</span>
        <div class="h-px flex-1 bg-gray-25"></div>
      </div>

      <!-- Form -->
      <form
        novalidate
        @submit.prevent="handleSubmit"
      >

        <!-- Email -->
        <div class="relative">
          <label
            :class="[
              'absolute left-md transition-all duration-200 pointer-events-none z-10',
              form.email || focusedFields.email
                ? 'top-0 label_2_medium secondary_text_color -translate-y-1/2 bg_secondary_color px-xs'
                : 'top-1/2 -translate-y-1/2 secondary_text_color',
              errors.email && form.email || focusedFields.email ? 'top-0' : errors.email  ? 'top-1/3' : ''
            ]"
          >
            Email
          </label>
          <input
            v-model="form.email"
            @focus="focusedFields.email = true"
            @blur="focusedFields.email = false"
            type="text"
            class="input_box w-full pt-4xl pb-md"
            :class="[
             inputClass(errors.email),
             focusedFields.email ? 'border border-info-50' : ''
            ]"
          />
          <p v-if="errors.email" class="label_2_semibold text-error-600 mt-md flex gap-sm"><img :src="WarningIcon" alt=""> {{ errors.email }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="primary_button w-full mt-7xl"
        >
          Continue
        </button>
      </form>

      <!-- Footer -->
      <p class="body_2_regular secondary_text_color mt-6xl flex justify-center">
        Don't have an account?
        <RouterLink
          to="/signup"
          class="ml-1 font-medium underline primary_text_color"
        >
          Sign Up
        </RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import GoogleSignin from "../../components/Auth/GoogleSignin.vue"
import Logo from "../../components/common/Logo.vue"
import WarningIcon from "../../assets/images/WarningIcon.svg"

const router = useRouter()

/* Form State */
const form = reactive({
  email: "",
})

/* Error State */
const errors = reactive({
  email: "",
})

/* Focus State for Floating Labels */
const focusedFields = reactive({
  email: false,
})

/* Email Regex */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Input Border */
const inputClass = (error) =>
  error
    ? "error_border_color"
    : "regular_border_color"

/* Submit Handler */
const handleSubmit = () => {
  errors.email = ""

  if (!form.email) {
    errors.email = "Email is required"
    return
  }

  if (!emailRegex.test(form.email)) {
    errors.email = "Enter a valid email address"
    return
  }

  router.push("/password")
}
</script>
