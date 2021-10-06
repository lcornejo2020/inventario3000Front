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

        <div>Beta v0.1</div>
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
         Menú
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
    title: 'Inventario',
    caption: 'Lista de inventario',
    icon: 'checklist_rtl',
    link: '/inventario'
  },
  {
    title: 'Cerrar Sessión',
    caption: '',
    icon: 'logout',
    link: '/cerrar_session'
  }
]

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
