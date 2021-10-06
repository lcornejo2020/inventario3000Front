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
        v-model="email"
        label="Correo Electrónico *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Ingrese un correo electrónico']">
        <template v-slot:prepend>
          <q-icon name="alternate_email" />
        </template>
      </q-input>

      <q-input
        type="password"
        v-model="password"
        label="Contraseña *"
        lazy-rules
        :rules="[ val => val !== null && val !== '' || 'Ingrese una contraseña']">
        <template v-slot:prepend>
          <q-icon name="key" />
        </template>
      </q-input>

      <div>
        <q-btn label="Iniciar Sesión" type="submit" color="teal-9"/>
        <q-btn label="Cancelar" type="reset" color="teal-5" flat class="q-ml-sm" />
      </div>
      </q-card-section>
    </q-card>
    </q-form>

  </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Login',
  setup () {
    const $q = useQuasar()
    const email = ref(null)
    const password = ref(null)
    return {
      email,
      password,
      onSubmit () {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      },

      onReset () {
        email.value = null
        password.value = null
      }
    }
  }
})
</script>
