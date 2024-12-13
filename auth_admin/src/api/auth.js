import request from '@/utils/request.js'

export const authPageListService = ({ pageSize, currentPage }) =>
  request.get('/api/v1/authinfo', { params: { pageSize, currentPage } })

export const authQuaryListService = ({ deviceCode, tokenCode }) =>
  request.get('/api/v1/authinfo', { params: { deviceCode, tokenCode } })

export const authAddService = ({ deviceCode, tokenCode, expiryTime, isBanned, extra_info }) =>
  request.post('/api/v1/authinfo', { deviceCode, tokenCode, expiryTime, isBanned, extra_info })

export const authUpdateService = ({ id, deviceCode, tokenCode, expiryTime, isBanned, extra_info }) =>
  request.put('/api/v1/authinfo', { id, deviceCode, tokenCode, expiryTime, isBanned, extra_info })

export const authDeleteService = (ids) => request.delete('/api/v1/authinfo', { params: { ids } })
