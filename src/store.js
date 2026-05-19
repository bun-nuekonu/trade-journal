import { reactive, watch, computed } from 'vue'

const STORAGE_KEY = 'trade-journal-records'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const store = reactive({
  records: load(),
  editingId: null,
})

watch(() => store.records, (val) => save(val), { deep: true })

export function addRecord(record) {
  store.records.unshift({
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  })
}

export function updateRecord(id, data) {
  const idx = store.records.findIndex((r) => r.id === id)
  if (idx !== -1) {
    store.records[idx] = { ...store.records[idx], ...data }
  }
}

export function deleteRecord(id) {
  const idx = store.records.findIndex((r) => r.id === id)
  if (idx !== -1) store.records.splice(idx, 1)
}

export const totalPnL = computed(() =>
  store.records.reduce((sum, r) => sum + (Number(r.pnl) || 0), 0)
)

export const totalPnLAfterTax = computed(() =>
  store.records.reduce((sum, r) => sum + (Number(r.pnlAfterTax) || 0), 0)
)

export const winRate = computed(() => {
  const settled = store.records.filter((r) => r.result !== '未決済')
  const wins = settled.filter((r) => r.result === '勝ち').length
  return settled.length > 0
    ? Math.round((wins / settled.length) * 100)
    : 0
})

export function exportData() {
  const blob = new Blob([JSON.stringify(store.records, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trade-journal-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (Array.isArray(data)) {
          store.records = data
          resolve(data.length)
        } else {
          reject(new Error('Invalid format'))
        }
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsText(file)
  })
}
