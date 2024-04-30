<template>
  <alert :message="status.message" :modalActive="modalActive" :isError="status.isError" @close="closeNotification" />
  <div
    class="absolute w-full h-full bg-cover sm:bg-[url('@/assets/img/login-bg.png')] bg-center flex justify-center items-center">
  </div>
  <div class="content">
    <img src="@/assets/img/teman-indobara-logo.png" id="logo" class="logo">
    <div class="login-wrapper">
      <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" class="w-full">
        <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
          <BaseInput name="username" type="text" placeholder="your username" class="outlined" label="Username" />
          <BaseInput name="password" type="password" placeholder="notyourbirthday" class="outlined" label="Password" />
          <MyButton type="submit" class="filled__red" label="LOGIN" :loading="isLoading" />
        </form>
      </VeeForm>
      <MyButton type="button" class="outlined__red" label="SSO LOGIN" @click="keycloak.login()" />
      <!-- <div class="create-account">
        <router-link :to="{name: 'ResetPassword'}"> Forgot Password? </router-link>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import BaseInput from '@/components/input/BaseInput.vue'
import MyButton from '@/components/button/BaseButton.vue'
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
import { useAuthStore } from '@/stores/auth/AuthStore'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { loginSchema } from '@/composable/validationSchemas'
import keycloak from '@/composable/keycloak'


const schema = loginSchema

// auth with pinia
const authStore = useAuthStore();
const { status, isLoading } = storeToRefs(useAuthStore())
const modalActive = ref(false)
const isError = ref(false)

const onSubmit = async (values, { resetForm }) => {
  await authStore.signIn(values)
  modalActive.value = true
  setTimeout(closeNotification, 5000)
  resetForm()
}

const closeNotification = () => {
  modalActive.value = false
}

</script>


<style scoped>
.content {
  @apply flex flex-col m-auto relative gap-[80px] items-center
}

.login-wrapper {
  @apply w-[459px]
}

.form-wrapper {
  @apply flex flex-col mb-4 w-full gap-4 sm:px-0 px-10
}

.create-account {
  @apply flex flex-col gap-3 w-full text-left text-[#353535]
}

.service-name {
  @apply mb-8 font-bold text-[21px] text-[#2F393F]
}

.logo {
  @apply m-auto w-[400px] sm:w-[609px]
}
</style>