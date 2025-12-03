<template>
  <div class="search-form">
    <div class="form-row">
      <div class="form-group">
        <label>Тип справочника</label>
        <select :value="value.type" @change="$emit('update:type', $event.target.value)">
          <option value="">Все</option>
          <option value="Пользовательский">Пользовательский</option>
          <option value="Технологический">Технологический</option>
          <option value="Защищенный">Защищенный (классификатор)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Наименование справочника</label>
        <input
          type="text"
          :value="value.name"
          @input="$emit('update:name', $event.target.value)"
          placeholder="Введите наименование..."
        >
      </div>
      <div class="form-group">
        <label>Код справочника</label>
        <input
          type="text"
          :value="value.code"
          @input="$emit('update:code', $event.target.value)"
          placeholder="Введите код..."
        >
      </div>
    </div>
    <div class="form-actions">
      <button @click="$emit('clear')">ОЧИСТИТЬ ФОРМУ</button>
      <button @click="$emit('search')" class="btn-primary">ПОИСК</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReferenceSearchForm',
  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.search-form {
  background-color: #e3edf4;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}
.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}
</style>
