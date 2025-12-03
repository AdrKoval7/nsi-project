<template>
  <div>
    <div class="header-actions">
      <h2>Наполнение справочника: {{ config.title }}</h2>
      <button @click="goBack">Назад к реестру</button>
    </div>

    <div class="search-form">
      <div v-for="column in config.columns" :key="column.key" class="form-group">
        <label>{{ column.label }}</label>
        <input type="text" v-model="searchQuery[column.key]" @keyup.enter="search">
      </div>
      <div class="form-actions">
        <button @click="clearSearch">Очистить</button>
        <button @click="search" class="btn-primary">Поиск</button>
      </div>
    </div>

    <div v-if="loading">Загрузка содержимого...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="items.length === 0">В справочнике нет данных.</div>
    <div v-else>
      <table>
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
          <th v-for="column in config.columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td class="checkbox-column">
            <input
              type="checkbox"
              :checked="selectedItems.includes(item._id)"
              @change="toggleItemSelection(item._id)"
            >
          </td>
          <td v-for="column in config.columns" :key="column.key">
            {{ item[column.key] }}
          </td>
        </tr>
        </tbody>
      </table>

      <p v-if="selectedItems.length > 0" class="selection-info">
        Выбрано элементов: {{ selectedItems.length }}
      </p>

      <div class="pagination-controls">
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
  </div>
</template>

<script>
import api from '@/services/api'
import referenceConfigs from '@/services/reference.config.js'

export default {
  name: 'ReferenceContentView',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      items: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 4,
      totalItems: 0,
      selectedItems: [],
      searchQuery: {}
    }
  },
  computed: {
    config () {
      return referenceConfigs[this.code] || referenceConfigs._default
    },
    totalPages () {
      if (this.totalItems === 0) return 1
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    isAllSelected () {
      if (this.items.length === 0) return false
      const visibleIds = this.items.map(item => item._id)
      return visibleIds.every(id => this.selectedItems.includes(id))
    }
  },
  watch: {
    itemsPerPage () {
      this.currentPage = 1
      this.fetchContent()
    }
  },
  methods: {
    initializeSearchQuery () {
      const newQuery = {}
      if (this.config && this.config.columns) {
        this.config.columns.forEach(column => {
          newQuery[column.key] = ''
        })
      }
      this.searchQuery = newQuery
    },
    async fetchContent () {
      this.loading = true
      this.error = null
      try {
        const params = {
          page: this.currentPage,
          limit: this.itemsPerPage
        }
        for (const key in this.searchQuery) {
          if (this.searchQuery[key]) {
            params[`q_${key}`] = this.searchQuery[key]
          }
        }

        const response = await api.getReferenceContent(this.code, params)

        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Ответ от API имеет неверный формат или отсутствует.')
        }

        this.items = response.data.items
        this.totalItems = response.data.total
      } catch (error) {
        console.error('ОШИБКА ПОЙМАНА В БЛОКЕ CATCH:', error)
        this.error = 'Не удалось загрузить содержимое справочника. См. консоль для деталей.'
      } finally {
        this.loading = false
      }
    },
    search () {
      this.currentPage = 1
      this.fetchContent()
    },
    clearSearch () {
      this.initializeSearchQuery()
      this.search()
    },
    goBack () {
      this.$router.push({ name: 'Registry' })
    },
    changePage (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchContent()
      }
    },
    toggleItemSelection (itemId) {
      const index = this.selectedItems.indexOf(itemId)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      } else {
        this.selectedItems.push(itemId)
      }
    },
    toggleSelectAll () {
      if (this.isAllSelected) {
        const visibleIds = this.items.map(item => item._id)
        this.selectedItems = this.selectedItems.filter(
          id => !visibleIds.includes(id)
        )
      } else {
        const visibleIds = this.items.map(item => item._id)
        visibleIds.forEach(id => {
          if (!this.selectedItems.includes(id)) {
            this.selectedItems.push(id)
          }
        })
      }
    }
  },
  created () {
    this.initializeSearchQuery()
    this.fetchContent()
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
