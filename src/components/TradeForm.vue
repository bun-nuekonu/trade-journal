<script setup>
import { reactive, watch, computed } from 'vue'
import { addRecord, updateRecord, store } from '../store.js'

const emit = defineEmits(['saved', 'cancel'])

const props = defineProps({
  record: { type: Object, default: null },
})

const form = reactive({
  ticker: '',
  tradeType: '現物買い',
  buyDate: '',
  buyPrice: '',
  sellDate: '',
  sellPrice: '',
  pnl: '',
  pnlAfterTax: '',
  memo: '',
})

if (props.record) {
  Object.assign(form, props.record)
}

const tickerCandidates = computed(() =>
  [...new Set(store.records.map((r) => r.ticker).filter(Boolean))]
)

function deriveResult(pnl) {
  const n = Number(pnl)
  if (!pnl && pnl !== 0 && pnl !== '0') return '未決済'
  if (n > 0) return '勝ち'
  if (n < 0) return '負け'
  return '引き分け'
}

watch(
  () => [form.buyPrice, form.sellPrice],
  ([buy, sell]) => {
    const b = Number(buy)
    const s = Number(sell)
    if (b && s) {
      form.pnl = String(s - b)
      form.pnlAfterTax = String(Math.round((s - b) * 0.79685))
    } else {
      form.pnl = ''
      form.pnlAfterTax = ''
    }
  }
)

function submit() {
  if (!form.ticker) return
  const data = { ...form, result: deriveResult(form.pnl) }
  if (props.record) {
    updateRecord(props.record.id, data)
  } else {
    addRecord(data)
  }
  emit('saved')
}
</script>

<template>
  <form
    class="trade-form"
    @submit.prevent="submit"
  >
    <div class="form-group">
      <label>銘柄</label>
      <input
        v-model="form.ticker"
        type="text"
        list="ticker-list"
        placeholder="例: 7203 トヨタ"
        required
      >
      <datalist id="ticker-list">
        <option
          v-for="t in tickerCandidates"
          :key="t"
          :value="t"
        />
      </datalist>
    </div>

    <div class="form-group">
      <label>取引種別</label>
      <select v-model="form.tradeType">
        <option>現物買い</option>
        <option>現物売り</option>
        <option>信用買い</option>
        <option>信用売り</option>
      </select>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>購入日</label>
        <input
          ref="buyDateRef"
          v-model="form.buyDate"
          type="date"
          @click="$refs.buyDateRef.showPicker?.()"
        >
      </div>
      <div class="form-group">
        <label>購入額</label>
        <input
          v-model="form.buyPrice"
          type="number"
          placeholder="円"
        >
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>決済日</label>
        <input
          ref="sellDateRef"
          v-model="form.sellDate"
          type="date"
          @click="$refs.sellDateRef.showPicker?.()"
        >
      </div>
      <div class="form-group">
        <label>決済額</label>
        <input
          v-model="form.sellPrice"
          type="number"
          placeholder="円"
        >
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>確定損益</label>
        <input
          v-model="form.pnl"
          type="number"
          placeholder="自動計算"
        >
      </div>
      <div class="form-group">
        <label>税抜利益</label>
        <input
          v-model="form.pnlAfterTax"
          type="number"
          placeholder="自動計算"
        >
      </div>
    </div>

    <div class="form-group">
      <label>メモ</label>
      <textarea
        v-model="form.memo"
        rows="3"
        placeholder="振り返りや反省点など"
      />
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn-secondary"
        @click="emit('cancel')"
      >
        キャンセル
      </button>
      <button
        type="submit"
        class="btn-primary"
      >
        {{ record ? '更新' : '保存' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.trade-form {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.form-group {
  margin-bottom: 12px;
  flex: 1;
}
.form-group label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-weight: 600;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.95rem;
  box-sizing: border-box;
}
.form-group input[type="date"] {
  -webkit-appearance: none;
  appearance: none;
  min-height: 42px;
  cursor: pointer;
  position: relative;
}
.form-group input[type="date"]::-webkit-date-and-time-value {
  text-align: left;
}
.form-group textarea {
  resize: vertical;
}
.form-row {
  display: flex;
  gap: 8px;
}
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-secondary {
  background: var(--card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
</style>
