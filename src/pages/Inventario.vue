<template>
  <div class="q-pa-md">
    <q-table
      title="Stock de productos"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="nombre" :props="props">
            {{ props.row.producto.nombre }}
            <q-popup-edit v-model="props.row.producto.nombre">
              <q-input v-model="props.row.producto.nombre" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="precio_compra" :props="props">
            $.{{ props.row.precio_compra }}
            <q-popup-edit v-model="props.row.precio_compra">
              <q-input v-model="props.row.precio_compra" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="precio_venta" :props="props">
            $.{{ props.row.precio_venta }}
            <q-popup-edit v-model="props.row.precio_venta">
              <q-input v-model="props.row.precio_venta" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="cantidad" :props="props">
            {{ props.row.cantidad }}
            <q-popup-edit v-model="props.row.cantidad">
              <q-input v-model="props.row.cantidad" dense autofocus counter />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api } from '../boot/axios'

const columns = [
  { name: 'id', align: 'center', label: 'Id', field: 'id', sortable: true },
  {
    name: 'nombre',
    required: true,
    label: 'Producto',
    align: 'left',
    field: row => row.producto.nombre,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'precio_compra', align: 'center', label: 'Precio Compra', field: 'precio_compra', sortable: true },
  { name: 'precio_venta', align: 'center', label: 'Precio Venta', field: 'precio_venta', sortable: true },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad', sortable: true }
]

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const rows = ref([])
    const loading = ref(true)
    return {
      columns,
      rows,
      loading,
      async getStock () {
        const res = await api.get('stocks', {
          params: {
            estado: true
          }
        })
        rows.value = res.data
        loading.value = false
      }
    }
  },
  mounted () {
    this.getStock()
  }
})
</script>
