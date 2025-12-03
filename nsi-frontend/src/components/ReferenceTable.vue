<template>
  <div>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="!references || references.length === 0">Нет доступных данных.</div>
    <table v-else>
      <thead>
      <tr>
        <th class="checkbox-column">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
            title="Выбрать все на странице"
          >
        </th>
        <th>Код справочника</th>
        <th>Тип справочника</th>
        <th>Наименование справочника</th>
        <th v-if="showExtraColumns">Дата начала действия</th>
        <th v-if="showExtraColumns">Дата окончания действия</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="ref in references" :key="ref.code">
        <td class="checkbox-column">
          <input
            type="checkbox"
            :checked="selectedItems.includes(ref.code)"
            @change="toggleSelect(ref.code)"
          >
        </td>
        <td>{{ ref.code }}</td>
        <td>{{ ref.type }}</td>
        <td>{{ ref.name }}</td>
        <td v-if="showExtraColumns">{{ ref.date_start }}</td>
        <td v-if="showExtraColumns">{{ ref.date_end }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ReferenceTable',
  props: {
    references: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    showExtraColumns: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isAllSelected () {
      if (this.references.length === 0) return false
      const visibleCodes = this.references.map(ref => ref.code)
      return visibleCodes.every(code => this.selectedItems.includes(code))
    }
  },
  methods: {
    toggleSelect (code) {
      this.$emit('toggle-select', code)
    },
    toggleSelectAll () {
      this.$emit('toggle-select-all')
    }
  }
}
</script>

<style scoped>
.checkbox-column {
  width: 40px;
  text-align: center;
}
</style>
