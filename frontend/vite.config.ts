import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},  // 👈 This prevents the crash
  },
  build: {
    rollupOptions: {
      input: './index.html'
    }
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       input: './index.html'
//     }
//   }
// })
