<template>
  <div class="fullscreen bg-teal-2 q-pa-md flex flex-center">
    <div class="q-pa-md" style="width: 30%">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-xl"
    >
     <q-card class="my-card">
       <q-card-section class="bg-teal-9 text-white items-center">
        <h4 class="text-center text-white text-weight-light q-my-none">Inventario 3000</h4>
      </q-card-section>
      <q-card-section>
      <q-input
        v-model="data.identifier"
        :disable="loading"
        label="Correo Electrónico *"
        lazy-rules
        :rules="[
          val => val && val.length > 0 || 'Ingrese un correo electrónico',
          val => isValidEmail(val)
        ]">
        <template v-slot:prepend>
          <q-icon name="alternate_email" />
        </template>
      </q-input>
      <q-input
        type="password"
        :disable="loading"
        v-model="data.password"
        label="Contraseña *"
        lazy-rules
        :rules="[ val => val !== null && val !== '' || 'Ingrese una contraseña']">
        <template v-slot:prepend>
          <q-icon name="key" />
        </template>
      </q-input>
      <div class="q-pt-md">
        <q-btn :loading="loading" label="Iniciar Sesión" type="submit" color="teal-9"/>
        <q-btn :disable="loading" label="Cancelar" type="reset" color="teal-5" flat class="q-ml-sm" />
      </div>
      </q-card-section>
    </q-card>
    </q-form>
  </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

export default defineComponent({
  name: 'Login',
  setup () {
    const $q = useQuasar()
    const data = reactive({
      identifier: null,
      password: null
    })
    const loading = ref(false)
    return {
      loading,
      data,
      async onSubmit () {
        loading.value = true
        try {
          const res = await api.post('auth/local', data)
          $q.localStorage.set('user', res.data)
          loading.value = false
        } catch (error) {
          loading.value = false
          if (error.response) {
            if (error.response.status === 400) {
              $q.notify({
                type: 'warning',
                icon: 'warning',
                message: 'Atención !',
                caption: 'Correo Electrónico o Contraseña no válida'
              })
            }
          } else {
            $q.notify({
              type: 'negative',
              icon: 'close',
              message: 'Error !',
              caption: ':( Oops, ocurrio un problema, notifiquelo'
            })
          }
          console.log(error)
        }
      },
      onReset () {
        data.identifier = null
        data.password = null
      },
      isValidEmail (email) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
        return emailPattern.test(email) || 'Correo Electrónico no válido'
      }
    }
  }
})
</script>
