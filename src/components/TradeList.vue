<script setup>
import { ref, computed } from 'vue'
import { store, deleteRecord } from '../store.js'
import TradeForm from './TradeForm.vue'

const editingId = ref(null)

function latestDate(r) {
  const dates = [r.buyDate, r.sellDate].filter(Boolean)
  return dates.length > 0 ? dates.sort().pop() : ''
}

const sortedRecords = computed(() =>
  [...store.records].sort((a, b) => latestDate(b).localeCompare(latestDate(a)))
)

function fmt(n) {
  return Number(n).toLocaleString('ja-JP')
}

function confirmDelete(id) {
  if (confirm('この取引記録を削除しますか？')) {
    deleteRecord(id)
  }
}
</script>

<template>
  <div class="trade-list">
    <div
      v-if="store.records.length === 0"
      class="empty"
    >
      まだ取引記録がありません
    </div>

    <div
      v-for="record in sortedRecords"
      :key="record.id"
      class="trade-card"
    >
      <TradeForm
        v-if="editingId === record.id"
        :record="record"
        @saved="editingId = null"
        @cancel="editingId = null"
      />
      <template v-else>
        <div class="card-header">
          <div class="ticker">
            {{ record.ticker }}
          </div>
          <span
            class="badge"
            :class="{
              win: record.result === '勝ち',
              lose: record.result === '負け',
              draw: record.result === '引き分け',
              open: record.result === '未決済',
            }"
          >
            {{ record.result }}
          </span>
        </div>

        <div class="card-meta">
          <span class="trade-type">{{ record.tradeType }}</span>
        </div>

        <div class="card-dates">
          <div class="date-row">
            <span class="date-label">購入</span>
            <span>{{ record.buyDate || '-' }}</span>
            <span class="price">{{ record.buyPrice ? fmt(record.buyPrice) + '円' : '-' }}</span>
          </div>
          <div class="date-row">
            <span class="date-label">決済</span>
            <span>{{ record.sellDate || '-' }}</span>
            <span class="price">{{ record.sellPrice ? fmt(record.sellPrice) + '円' : '-' }}</span>
          </div>
        </div>

        <div class="card-pnl">
          <div>
            <span class="pnl-label">確定損益</span>
            <span :class="Number(record.pnl) >= 0 ? 'positive' : 'negative'">
              {{ record.pnl ? (Number(record.pnl) >= 0 ? '+' : '') + fmt(record.pnl) + '円' : '-' }}
            </span>
          </div>
          <div>
            <span class="pnl-label">税抜利益</span>
            <span :class="Number(record.pnlAfterTax) >= 0 ? 'positive' : 'negative'">
              {{ record.pnlAfterTax ? (Number(record.pnlAfterTax) >= 0 ? '+' : '') + fmt(record.pnlAfterTax) + '円' : '-' }}
            </span>
          </div>
        </div>

        <div
          v-if="record.memo"
          class="card-memo"
        >
          {{ record.memo }}
        </div>

        <div class="card-actions">
          <button
            class="btn-sm"
            @click="editingId = record.id"
          >
            編集
          </button>
          <button
            class="btn-sm btn-danger"
            @click="confirmDelete(record.id)"
          >
            削除
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.trade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 32px;
}
.empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
}
.trade-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.ticker {
  font-weight: 700;
  font-size: 1.05rem;
}
.badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}
.badge.win {
  background: rgba(0, 200, 100, 0.15);
  color: var(--green);
}
.badge.lose {
  background: rgba(230, 60, 60, 0.15);
  color: var(--red);
}
.badge.draw {
  background: rgba(150, 150, 150, 0.15);
  color: var(--text-secondary);
}
.badge.open {
  background: rgba(74, 108, 247, 0.15);
  color: var(--accent);
}
.card-meta {
  margin-bottom: 8px;
}
.trade-type {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: 4px;
}
.card-dates {
  font-size: 0.85rem;
  margin-bottom: 8px;
}
.date-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}
.date-label {
  color: var(--text-secondary);
  width: 36px;
}
.price {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}
.card-pnl {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
  font-size: 0.9rem;
}
.card-pnl > div {
  text-align: center;
}
.pnl-label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-bottom: 2px;
}
.positive { color: var(--green); font-weight: 700; }
.negative { color: var(--red); font-weight: 700; }
.card-memo {
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: var(--bg);
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  white-space: pre-wrap;
}
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.btn-sm {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
}
.btn-sm.btn-danger {
  color: var(--red);
  border-color: var(--red);
}
</style>
