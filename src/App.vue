<template>
  <div id="app">
    <AuthForm v-if="!user" />
    <Dashboard v-else />
  </div>
</template>

<script setup>
import { onAuthStateChanged } from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { auth } from './firebase'

import AuthForm from './components/AuthForm.vue'
import Dashboard from './components/Dashboard.vue'

const user = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
  })
})
</script>