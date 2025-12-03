<template>
  <div>
    <h2>Реестр справочников</h2>

    <reference-search-form
      :value="searchQuery"
      @update:type="searchQuery.type = $event"
      @update:name="searchQuery.name = $event"
      @update:code="searchQuery.code = $event"
      @search="searchReferences"
      @clear="clearForm"
    />

    <div class="controls-panel">
      <div class="table-settings">
        <input type="checkbox" id="tableSettings" v-model="showExtraSettings">
        <label for="tableSettings">Настройка таблицы</label>
      </div>

      <div v-if="showExtraSettings" class="actions-dropdown">
        <select v-model="selectedAction">
          <option disabled value="">Выбор действия...</option>
          <option value="viewContent">Просмотреть справочник</option>
          <option value="viewProperties">Просмотреть свойства справочника</option>
        </select>
        <button @click="executeAction" :disabled="!selectedAction || selectedReferences.length !== 1">
          Выполнить
        </button>
      </div>
    </div>
    <small v-if="showExtraSettings && selectedReferences.length !== 1" class="action-hint">
      Для выполнения действия выберите ровно один справочник.
    </small>

    <reference-table
      :references="references"
      :loading="loading"
      :selected-items="selectedReferences"
      :show-extra-columns="showExtraSettings"
    @toggle-select="toggleReferenceSelection"
    @toggle-select-all="toggleAllReferences"
    />

    <p v-if="selectedReferences.length > 0" class="selection-info">
      Выбрано справочников: {{ selectedReferences.length }}
    </p>

    <div v-if="!loading && totalItems > 0" class="pagination-controls">
      <div class="items-per-page">
        <label for="itemsPerPage">Элементов на странице:</label>
        <select id="itemsPerPage" v-model.number="itemsPerPage">
          <option value="4">4</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
      <div class="page-navigation">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          &lt;
        </button>
        <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          &gt;
        </button>
      </div>
      <div class="total-items">
        Всего записей: {{ totalItems }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import ReferenceSearchForm from '@/components/ReferenceSearchForm.vue'
import ReferenceTable from '@/components/ReferenceTable.vue'

export default {
  name: 'RegistryView',
  components: {
    ReferenceSearchForm,
    ReferenceTable
  },
  data () {
    return {
      references: [],
      searchQuery: {
        code: '',
        name: '',
        type: ''
      },
      loading: false,
      currentPage: 1,
      itemsPerPage: 4,
      totalItems: 0,
      selectedReferences: [],
      showExtraSettings: false,
      selectedAction: ''
    }
  },
  computed: {
    totalPages () {
      if (this.totalItems === 0) return 1
      return Math.ceil(this.totalItems / this.itemsPerPage)
    }
  },
  watch: {
    searchQuery: {
      handler () {
        this.currentPage = 1
        this.fetchReferences()
      },
      deep: true
    },
    itemsPerPage () {
      this.currentPage = 1
      this.fetchReferences()
    }
  },
  methods: {
    async fetchReferences () {
      this.loading = true
      try {
        const params = {
          ...this.searchQuery,
          page: this.currentPage,
          limit: this.itemsPerPage
        }
        Object.keys(params).forEach(key => {
          if (!params[key]) {
            delete params[key]
          }
        })
        const response = await api.getReferences(params)
        this.references = response.data.items
        this.totalItems = response.data.total
      } catch (error) {
        console.error('Ошибка при загрузке справочников:', error)
        alert('Не удалось загрузить данные. Проверьте, запущен ли бэкенд.')
      } finally {
        this.loading = false
      }
    },
    searchReferences () {
      this.currentPage = 1
      this.fetchReferences()
    },
    clearForm () {
      this.searchQuery = { code: '', name: '', type: '' }
    },
    viewReference (code) {
      this.$router.push({ name: 'ReferenceContent', params: { code } })
    },
    changePage (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchReferences()
      }
    },
    toggleReferenceSelection (code) {
      const index = this.selectedReferences.indexOf(code)
      if (index > -1) {
        this.selectedReferences.splice(index, 1)
      } else {
        this.selectedReferences.push(code)
      }
    },
    toggleAllReferences () {
      const visibleCodes = this.references.map(ref => ref.code)
      const allSelected = visibleCodes.every(code => this.selectedReferences.includes(code))

      if (allSelected) {
        this.selectedReferences = this.selectedReferences.filter(
          code => !visibleCodes.includes(code)
        )
      } else {
        visibleCodes.forEach(code => {
          if (!this.selectedReferences.includes(code)) {
            this.selectedReferences.push(code)
          }
        })
      }
    },
    executeAction () {
      if (this.selectedReferences.length !== 1) {
        alert('Выберите ровно один справочник для выполнения действия.')
        return
      }
      const selectedCode = this.selectedReferences[0]

      if (this.selectedAction === 'viewContent') {
        this.$router.push({
          name: 'ReferenceContent',
          params: { code: selectedCode }
        })
      } else if (this.selectedAction === 'viewProperties') {
        this.$router.push({
          name: 'ReferenceProperties',
          params: { code: selectedCode }
        })
      }
    }
  },
  created () {
    this.fetchReferences()
  }
}
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #dee2e6;
}
.page-navigation {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-navigation button {
  width: 35px;
  height: 35px;
}
.items-per-page select {
  width: auto;
  padding: 5px;
}
.total-items {
  font-size: 14px;
  color: #6c757d;
}
</style>
