<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-teal-9">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          INVENTARIO 3000
        </q-toolbar-title>

        <div>Beta v{{version}}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :persistent="false"
      :show-if-above="false"
    >
      <q-list>
        <q-item-label
          header
        >
         Usuario: {{user ? user.username :  'Incognito'}}
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Inicio',
    caption: '',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Inventario',
    caption: 'Lista de inventario',
    icon: 'checklist_rtl',
    link: '/inventario'
  },
  {
    title: 'Cerrar Sessión',
    caption: '',
    icon: 'logout',
    link: '/logout'
  }
]

import { defineComponent, ref } from 'vue'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from '../boot/axios'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const user = ref(null)
    const route = useRouter()
    return {
      route,
      user,
      version: process.env.VERSION,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      validLogin () {
        user.value = LocalStorage.getItem('user')
        if (user.value) {
          const token = LocalStorage.getItem('token')
          api.defaults.headers.common.Authorization = `Bearer ${token}`
        } else {
          delete api.defaults.headers.common.Authorization
          route.push('/login')
        }
      }
    }
  },
  created () {
    this.validLogin()
  }
})
</script>
