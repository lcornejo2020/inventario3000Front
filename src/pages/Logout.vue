<template>
  <div></div>
</template>

<script>
import { defineComponent } from 'vue'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from '../boot/axios'

export default defineComponent({
  name: 'Login',
  setup () {
    const route = useRouter()
    return {
      route,
      logout () {
        LocalStorage.clear()
        delete api.defaults.headers.common.Authorization
        route.push('/login')
      }
    }
  },
  mounted () {
    this.logout()
  }
})
</script>
