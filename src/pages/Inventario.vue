<template>
  <div class="q-pa-md">
     <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-teal-8 text-white" style="min-width: 800px !important;">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-teal-8">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-teal-8">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup @click="reset">
            <q-tooltip class="bg-white text-teal-8">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-py-sm">
          <div class="text-h6">Crear Nuevo Stock</div>
        </q-card-section>
        <q-card-section class="q-pt-none bg-white" style="border-radius: 25px 25px 0px 0px;">
          <q-form
            @submit="onSubmit"
              ref="myForm"
              class="q-gutter-xs"
          >
            <q-select
              v-model="data.producto"
              option-label="nombre"
              option-value="id"
              :options="catalogos.productos"
              label="Producto"
              use-input
              hide-selected
              fill-input
              input-debounce="10"
              @filter="filterFnProducto"
              behavior="menu"
              :rules="[ val => !!val && val !== '' || 'Escoja un producto' ]"
            />
            <q-select
              v-model="data.color"
              option-label="nombre"
              option-value="id"
              :options="catalogos.colores"
              label="Color"
              use-input
              hide-selected
              fill-input
              input-debounce="10"
              @filter="filterFnColor"
              behavior="menu"
              :rules="[ val => !!val && val !== '' || 'Escoja un color' ]"
            />
            <q-input type="number" label="Cantidad" v-model="data.cantidad" :rules="[ val => !!val && val !== '' && val > 0 || 'Ingrese valores mayor a 0' ]"/>
            <q-separator inset />
            <div class="text-subtitle1 text-dark q-py-md" v-if="!!data.producto">Descripción del producto</div>
            <div class="row q-col-gutter-md" v-if="!!data.producto">
              <q-field class="col" label="Categoria" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{cargarNombre('categorias',data.producto.categoria) }}</div>
                </template>
              </q-field>
              <q-field class="col" label="Marca" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{cargarNombre('marcas',data.producto.marca) }}</div>
                </template>
              </q-field>
              <q-field class="col" label="Material" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{cargarNombre('materiales',data.producto.material) }}</div>
                </template>
              </q-field>
            </div>
            <div class="row q-col-gutter-md" v-if="!!data.producto">
              <q-field class="col-2" label="Genero" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{cargarNombre('generos',data.producto.genero) }}</div>
                </template>
              </q-field>
              <q-field class="col-6" label="Descripción" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{data.producto.descripcion}}</div>
                </template>
              </q-field>
              <q-field class="col-2" label="Precio Compra" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">$ {{data.producto.precio_compra}}</div>
                </template>
              </q-field>
              <q-field class="col-2" label="Precio Venta" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">$ {{data.producto.precio_venta}}</div>
                </template>
              </q-field>
            </div>
            <div class="text-center q-mt-lg">
              <q-btn label="Guardar" icon="save" type="submit" color="teal-8"/>
            </div>
            </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-table
      title="Stock de productos"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :loading="loading"
      binary-state-sort
    >
      <template v-slot:top>
        <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn label="Crear Stock" color="teal-8" @click="dialog = true" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="nombre" :props="props">
            <span style="cursor:pointer">{{ props.row.producto.nombre }} <q-tooltip>Editar producto</q-tooltip></span>
            <q-popup-edit v-model="props.row.producto" auto-save v-slot="scope" @save="(v, iv) => { editarStock(v, iv, props.row.id, 'producto') }">
               <q-select
                  v-model="scope.value"
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
                  @keyup.enter="scope.set"
                  :rules="[ val => !!val && val !== '' || 'Escoja un producto' ]"
                />
            </q-popup-edit>
          </q-td>
          <q-td key="categoria" :props="props">
            {{ cargarNombre('categorias',props.row.producto.categoria) }}
          </q-td>
          <q-td key="marca" :props="props">
            {{ cargarNombre('marcas',props.row.producto.marca) }}
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
            <span style="cursor:pointer">{{ props.row.cantidad }} <q-tooltip>Editar cantidad</q-tooltip></span>
            <q-popup-edit v-model="props.row.cantidad" auto-save v-slot="scope" :validate="validacionCantidad" @hide="validacionCantidad" @save="(v, iv) => { editarStock(v, iv, props.row.id, 'cantidad') }">
              <q-input type="number" v-model="scope.value" dense hint="Ingrese valores mayor a 0" @keyup.enter="scope.set" :error="errorCatidad" :error-message="errorMensajeCantidad"/>
            </q-popup-edit>
          </q-td>
          <q-td key="eliminar" :props="props">
            <q-btn flat round color="negative" icon="delete" @click="eliminar(props.row)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { api } from '../boot/axios'
import { useQuasar, QSpinnerGears } from 'quasar'

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
  { name: 'categoria', align: 'center', label: 'Categoria', field: row => row.producto.categoria.nombre, format: val => `${val}`, sortable: true },
  { name: 'marca', align: 'center', label: 'Marca', field: row => row.producto.marca.nombre, format: val => `${val}`, sortable: true },
  { name: 'material', align: 'center', label: 'Material', field: row => row.producto.categoria.nombre, format: val => `${val}`, sortable: true },
  { name: 'genero', align: 'center', label: 'Genero', field: row => row.producto.genero.nombre, format: val => `${val}`, sortable: true },
  { name: 'descripcion', align: 'center', label: 'Descripción', field: row => row.producto.descripcion, format: val => `${val}`, sortable: true },
  { name: 'precio_compra', align: 'center', label: 'Precio Compra', field: row => row.producto.precio_compra, format: val => `${val}`, sortable: true },
  { name: 'precio_venta', align: 'center', label: 'Precio Venta', field: row => row.producto.precio_venta, format: val => `${val}`, sortable: true },
  { name: 'color', align: 'center', label: 'Color', field: row => row.color.nombre, format: val => `${val}`, sortable: true },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad', sortable: true },
  { name: 'eliminar', align: 'center', label: 'Eliminar', field: 'eliminar', sortable: false }
]

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const rows = ref([])
    const quasar = useQuasar()
    const filter = ref('')
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
    const errorCatidad = ref(false)
    const dialog = ref(false)
    const errorMensajeCantidad = ref('')
    const data = reactive({
      producto: null,
      color: null,
      cantidad: null
    })
    function reset () {
      data.producto = null
      data.color = null
      data.cantidad = null
    }
    return {
      reset,
      data,
      quasar,
      catalogos,
      catalogosTmp,
      columns,
      rows,
      filter,
      loading,
      errorCatidad,
      errorMensajeCantidad,
      dialog,
      maximizedToggle: ref(true),
      async onSubmit () {
        quasar.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'white',
          spinnerSize: 140,
          message: 'Guardando Stock ...'
        })
        try {
          const send = {
            producto: data.producto.id,
            color: data.color.id,
            cantidad: data.cantidad
          }
          const res = await api.post('stocks', send)
          rows.value.unshift(res.data)
          reset()
          dialog.value = false
        } catch (e) {
          console.log(e)
          quasar.notify({
            type: 'negative',
            message: "Opps :'( ... Error en el servidor"
          })
        }
        quasar.loading.hide()
      },
      validacionCantidad (val) {
        if (val < 0 || val === '') {
          errorCatidad.value = true
          errorMensajeCantidad.value = 'Ingrese un valor mayor a cero'
          return false
        }
        errorCatidad.value = false
        errorMensajeCantidad.value = ''
        return true
      },
      eliminar (item) {
        quasar.dialog({
          title: 'Atención',
          message: 'Esta seguro de eliminar el producto ' + item.producto.nombre + ' ?',
          ok: {
            push: true,
            color: 'teal-10'
          },
          cancel: {
            push: true,
            color: 'teal-4'
          },
          persistent: true
        }).onOk(async () => {
          try {
            loading.value = true
            await api.delete('stocks/' + item.id)
            const index = rows.value.findIndex(v => v.id === item.id)
            rows.value.splice(index, 1)
          } catch (e) {
            console.log(e)
            quasar.notify({
              type: 'negative',
              message: "Opps :'( ... Error en el servidor"
            })
          }
          loading.value = false
        })
      },
      async editarStock (value, initialValue, id, campo) {
        const data = {}
        data[campo] = value
        loading.value = true
        try {
          await api.put('stocks/' + id, data)
        } catch (e) {
          console.log(e)
          quasar.notify({
            type: 'negative',
            message: "Opps :'( ... Error en el servidor"
          })
        }
        loading.value = false
        return true
      },
      cargarNombre (catalogo, id) {
        if (catalogosTmp[catalogo].length > 0) {
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
      filterFnCategoria (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          catalogos.categorias = catalogosTmp.categorias.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      async getStock () {
        try {
          const res = await api.get('stocks', {
            params: {
              estado: true,
              _sort: 'id:DESC'
            }
          })
          rows.value = res.data
        } catch (e) {
          console.log(e)
          quasar.notify({
            type: 'negative',
            message: "Opps :'( ... Error en el servidor"
          })
        }
        loading.value = false
        return true
      },
      async getCatalogos () {
        Object.keys(catalogos).forEach(async (key) => {
          try {
            const res = await api.get(key, {
              params: {
                estado: true
              }
            })
            catalogos[key] = catalogosTmp[key] = res.data
          } catch (e) {
            console.log(e)
            quasar.notify({
              type: 'negative',
              message: "Opps :'( ... Error en el servidor"
            })
          }
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
