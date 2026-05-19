<script setup>
import { ref } from 'vue'
import { store, totalPnL, totalPnLAfterTax, winRate, exportData, importData } from './store.js'
import TradeForm from './components/TradeForm.vue'
import TradeList from './components/TradeList.vue'
import SummaryBar from './components/SummaryBar.vue'

const showForm = ref(false)
const importInput = ref(null)

function handleImport(e) {
  const file = e.target.files[0]
  if (!file) return
  importData(file)
    .then((count) => alert(`${count}件インポートしました`))
    .catch(() => alert('インポートに失敗しました'))
  e.target.value = ''
}
</script>

<template>
  <div class="app">
    <div class="fixed-area">
      <header class="header">
        <h1>トレード日記</h1>
        <div class="header-actions">
          <button
            class="btn-icon"
            title="エクスポート"
            @click="exportData"
          >
            ↓
          </button>
          <button
            class="btn-icon"
            title="インポート"
            @click="importInput.click()"
          >
            ↑
          </button>
          <input
            ref="importInput"
            type="file"
            accept=".json"
            style="display:none"
            @change="handleImport"
          >
        </div>
      </header>

      <SummaryBar
        :total-pnl="totalPnL"
        :total-pnl-after-tax="totalPnLAfterTax"
        :win-rate="winRate"
        :count="store.records.length"
      />

      <button
        v-if="!showForm"
        class="btn-add"
        @click="showForm = true"
      >
        + 新しい取引を記録
      </button>

      <TradeForm
        v-if="showForm"
        @saved="showForm = false"
        @cancel="showForm = false"
      />
    </div>

    <div class="scroll-area">
      <TradeList />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}
.fixed-area {
  flex-shrink: 0;
}
.scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}
.header h1 {
  font-size: 1.4rem;
  margin: 0;
}
.header-actions {
  display: flex;
  gap: 8px;
}
.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-size: 1.1rem;
  cursor: pointer;
}
.btn-add {
  width: 100%;
  padding: 14px;
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: transparent;
  color: var(--accent);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
}
</style>
