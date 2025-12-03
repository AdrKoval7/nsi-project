import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  getReferences (params) {
    return apiClient.get('/references', { params })
  },
  getReferenceContent (code, params) {
    return apiClient.get(`/references/${code}`, { params })
  },
  getReferenceMetadata (code) {
    return apiClient.get(`/references/meta/${code}`)
  }
}
