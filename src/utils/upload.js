import axios from 'axios'
import { getToken } from '@/utils/auth'

export function upload(api, file) {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: { 'Authorization': getToken() }
  }
  return axios.post(api, data, config)
}

export function uploadWithType(api, file, fileType) {
  const data = new FormData()
  data.append('file', file)
  data.append('fileType', fileType)
  const config = {
    headers: { 'Authorization': getToken() }
  }
  return axios.post(api, data, config)
}

