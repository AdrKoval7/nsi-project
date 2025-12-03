<template>
  <div>
    <div class="header-actions">
      <h2>Свойства справочника: {{ code }}</h2>
      <button @click="goBack">Назад к реестру</button>
    </div>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="properties-form">
      <div class="form-group">
        <label>Тип справочника</label>
        <input type="text" :value="properties.type" readonly>
      </div>
      <div class="form-group">
        <label>Наименование справочника</label>
        <input type="text" :value="properties.name" readonly>
      </div>
      <div class="form-group">
        <label>Код справочника</label>
        <input type="text" :value="properties.code" readonly>
      </div>
      <div class="form-group">
        <label>Дата начала действия</label>
        <input type="text" :value="properties.date_start" readonly>
      </div>
      <div class="form-group">
        <label>Дата окончания действия</label>
        <input type="text" :value="properties.date_end" readonly>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'ReferencePropertiesView',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      properties: {},
      loading: false,
      error: null
    }
  },
  methods: {
    async fetchProperties () {
      this.loading = true
      try {
        const response = await api.getReferenceMetadata(this.code)
        this.properties = response.data
      } catch (e) {
        this.error = 'Не удалось загрузить свойства справочника.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    goBack () {
      this.$router.push({ name: 'Registry' })
    }
  },
  created () {
    this.fetchProperties()
  }
}
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.properties-form {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  background-color: #e3edf4;
  padding: 20px;
  border-radius: 8px;
}
.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}
input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>
