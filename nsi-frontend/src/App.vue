<template>
  <div id="app">
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f4f6f9;
  color: #333;
}

#app {
  padding: 20px;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #e3edf4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

button {
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #e9ecef;
  font-size: 14px;
}

button:hover {
  background-color: #dee2e6;
}

.btn-primary {
  background-color: #e9ecef;
  border: 1px solid #ccc;
}
.btn-primary:hover {
  background-color: #dee2e6;
}

input[type="text"], select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

table {
  border: 2px solid #000000;
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 2px solid #000000;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #e7e7e7;
}

tr:nth-child(even) {
  background-color: #e3edf4;
}
</style>
