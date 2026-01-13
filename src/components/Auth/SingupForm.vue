<template>
  <div class="flex items-center justify-center px-6 min-h-screen">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="block lg:hidden">
        <Logo />
      </div>

      <!-- Heading -->
      <h2 class="heading_h5_semibold">
        Create your account
      </h2>

      <p class="label_1_regular regular_gap">
        Start creating AI-powered social posts for your brand.
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
      <form class="space-y-4" novalidate @submit.prevent="handleSubmit">

        <!-- Full Name -->
        <div>
          <input
            v-model="form.name"
            type="text"
            placeholder="Fullname"
            class="input_box"
            :class="inputClass(errors.name)"
          />
          <p v-if="errors.name" class="error_text">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <input
            v-model="form.email"
            type="text"
            placeholder="Email"
            class="input_box"
            :class="inputClass(errors.email)"
          />
          <p v-if="errors.email" class="error_text">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="input_box pr-10"
              :class="inputClass(errors.password)"
            />

            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <img v-if="!showPassword" :src="EyeOpenIcon" />
              <span v-else>🙈</span>
            </button>
          </div>

          <p v-if="errors.password" class="error_text">{{ errors.password }}</p>
        </div>

        <!-- Terms -->
        <div>
          <label class="label_2_regular flex items-start gap-2">
            <input
              type="checkbox"
              v-model="form.terms"
              class="accent-[#7950F2] regular_gap"
            />
            <span>
              I agree to the
              <a class="underline">Terms of Service</a>
              and
              <a class="underline">Privacy Policy</a>
            </span>
          </label>

          <p v-if="errors.terms" class="error_text">{{ errors.terms }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="!isFormFilled"
          class="w-full rounded-md py-2 font-medium transition"
          :class="isFormFilled
            ? 'primary_button'
            : 'disabled_primary_button'"
        >
          Create Account
        </button>
      </form>

      <!-- Footer -->
      <p class="label_1_regular flex justify-center mt-5">
        Already have an account?
        <RouterLink
          to="/signin"
          class="ml-1 underline font-medium primary_text_color"
        >
          Log in
        </RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue"
import { useRouter } from "vue-router"
import GoogleSignin from "../../components/Auth/GoogleSignin.vue"
import EyeOpenIcon from "../../assets/images/EyeOpen.svg"
import Logo from "../../components/common/Logo.vue"

const router = useRouter()

/* Form State */
const form = reactive({
  name: "",
  email: "",
  password: "",
  terms: false,
})

/* Error State */
const errors = reactive({
  name: "",
  email: "",
  password: "",
  terms: "",
})

/* Regex */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=]).{8,}$/;

/* Password Toggle */
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

/* Button Enable Logic (ONLY filled check) */
const isFormFilled = computed(() => {
  return (
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "" &&
    form.terms
  )
})

/* Input Border */
const inputClass = (error) =>
  error
    ? "border border-red-500 focus:border-red-500"
    : "border border-gray-300 focus:border-purple-500"

/* Submit → FULL validation happens here */
const handleSubmit = () => {
  errors.name = ""
  errors.email = ""
  errors.password = ""
  errors.terms = ""

  let isValid = true

  if (!form.name) {
    errors.name = "Full name is required"
    isValid = false
  }

  if (!form.email) {
    errors.email = "Email is required"
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Enter a valid email address"
    isValid = false
  }

  if (!form.password) {
    errors.password = "Password is required"
    isValid = false
  } else if (!passwordRegex.test(form.password)) {
    errors.password =
      "Oops! The password you entered is incorrect."
    isValid = false
  }

  if (!form.terms) {
    errors.terms = "You must accept the terms"
    isValid = false
  }

  if (isValid) {
    router.push("/email-validation")
  }
}
</script>
