<template>
  <div class="flex min-h-screen items-center justify-center px-6">
    <div class="w-full max-w-md">

      <!-- Logo (Mobile & Tablet only) -->
      <div class="block lg:hidden mb-4">
        <Logo />
      </div>

      <!-- Heading -->
      <h2 class="heading_h5_semibold">
        Sign In
      </h2>

      <p class="label_1_regular regular_gap">
        Manage your posts, analytics, and campaigns with AI.
      </p>

      <!-- Google Sign In -->
      <GoogleSignin />

      <!-- Divider -->
      <div class="my-6 flex items-center gap-3">
        <div class="h-px flex-1 bg-[#E5E7EB]"></div>
        <span class="or_text">OR</span>
        <div class="h-px flex-1 bg-[#E5E7EB]"></div>
      </div>

      <!-- Form -->
      <form
        class="space-y-4"
        novalidate
        @submit.prevent="handleSubmit"
      >

        <!-- Email -->
        <div>
          <input
            v-model="form.email"
            type="text"
            placeholder="Email"
            class="input_box border-gray-300 focus:border-purple-500"
          />

          <p v-if="errors.email" class="error_text">
            {{ errors.email }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="primary_button w-full"
        >
          Continue
        </button>
      </form>

      <!-- Footer -->
      <p class="label_1_regular mt-5 flex justify-center">
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

const router = useRouter()

/* Form State */
const form = reactive({
  email: "",
})

/* Error State */
const errors = reactive({
  email: "",
})

/* Email Regex */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
