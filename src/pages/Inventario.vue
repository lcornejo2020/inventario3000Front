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
            <q-popup-edit v-model="props.row.producto">
               <q-select
                  v-model="props.row.producto"
                  dense
                  option-label="nombre"
                  option-value="id"
                  :options="catalogos.productos"
                  label="Productos"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="filterFnProducto"
                  behavior="menu"
                  :rules="[ val => !!val && val !== '' || 'Escoja un producto' ]"
                />
            </q-popup-edit>
          </q-td>
          <q-td key="categoria" :props="props">
            {{ cargarNombre('categorias',props.row.producto.genero) }}
          </q-td>
           <q-td key="material" :props="props">
            {{ cargarNombre('materiales',props.row.producto.material) }}
          </q-td>
          <q-td key="genero" :props="props">
            {{ cargarNombre('generos',props.row.producto.genero) }}
          </q-td>
          <q-td key="descripcion" :props="props">
            {{ props.row.producto.descripcion }}
          </q-td>
          <q-td key="precio_compra" :props="props">
            $ {{ props.row.producto.precio_compra }}
          </q-td>
          <q-td key="precio_venta" :props="props">
            $ {{ props.row.producto.precio_venta }}
          </q-td>
          <q-td key="color" :props="props">
            {{ props.row.color.nombre }}
            <q-popup-edit v-model="props.row.color">
              <q-select
                  v-model="props.row.color"
                  dense
                  option-label="nombre"
                  option-value="id"
                  :options="catalogos.colores"
                  label="Color"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="filterFnColor"
                  behavior="menu"
                  :rules="[ val => !!val && val !== '' || 'Escoja un Color' ]"
                />
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
import { defineComponent, ref, reactive } from 'vue'
import { api } from '../boot/axios'

const columns = [
  { name: 'id', align: 'center', label: 'Id', field: 'id', sortable: true },
  {
    name: 'nombre',
    required: true,
    label: 'Producto',
    align: 'center',
    field: row => row.producto.nombre,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'categoria', align: 'center', label: 'Categoria', field: row => row.producto.categoria, format: val => `${val}`, sortable: true },
  { name: 'material', align: 'center', label: 'Material', field: row => row.producto.categoria, format: val => `${val}`, sortable: true },
  { name: 'genero', align: 'center', label: 'Genero', field: row => row.producto.genero, format: val => `${val}`, sortable: true },
  { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion', sortable: true },
  { name: 'precio_compra', align: 'center', label: 'Precio Compra', field: row => row.producto.precio_compra, format: val => `${val}`, sortable: true },
  { name: 'precio_venta', align: 'center', label: 'Precio Venta', field: row => row.producto.precio_venta, format: val => `${val}`, sortable: true },
  { name: 'color', align: 'center', label: 'Color', field: 'color', sortable: true },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad', sortable: true }
]

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const rows = ref([])
    const catalogos = reactive({
      categorias: ref([]),
      marcas: ref([]),
      productos: ref([]),
      materiales: ref([]),
      generos: ref([]),
      colores: ref([])
    })
    const catalogosTmp = reactive({
      categorias: ref([]),
      marcas: ref([]),
      productos: ref([]),
      materiales: ref([]),
      generos: ref([]),
      colores: ref([])
    })
    const loading = ref(true)
    return {
      catalogos,
      catalogosTmp,
      columns,
      rows,
      loading,
      cargarNombre (catalogo, id) {
        if (catalogosTmp[catalogo].length > 0) {
          console.log(catalogo, id)
          id = !!id && typeof id === 'object' ? id.id : id
          const nombre = catalogosTmp[catalogo].find(v => v.id === id)
          if (nombre) return nombre.nombre
          return 'no encontrado'
        }
        return 'cargando ...'
      },
      filterFnMaterial (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          catalogos.materiales = catalogosTmp.materiales.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      filterFnColor (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          catalogos.colores = catalogosTmp.colores.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      filterFnGenero (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          catalogos.generos = catalogosTmp.generos.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      filterFnProducto (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          catalogos.productos = catalogosTmp.productos.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      async getStock () {
        const res = await api.get('stocks', {
          params: {
            estado: true
          }
        })
        rows.value = res.data
        loading.value = false
        return true
      },
      async getCatalogos () {
        Object.keys(catalogos).forEach(async (key) => {
          const res = await api.get(key, {
            params: {
              estado: true
            }
          })
          catalogos[key] = catalogosTmp[key] = res.data
        })
        return true
      }
    }
  },
  async mounted () {
    const step1 = await this.getStock()
    const step2 = await this.getCatalogos()
    this.loading = !(step1 && step2)
  }
})
</script>
