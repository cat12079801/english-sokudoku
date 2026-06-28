import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトページは /<repo-name>/ 配下に配信されるため base を合わせる。
// 環境変数 BASE_PATH があればそれを優先（独自ドメイン等に対応）。
const base = process.env.BASE_PATH ?? '/english-sokudoku/'

export default defineConfig({
  base,
  plugins: [react()],
})
