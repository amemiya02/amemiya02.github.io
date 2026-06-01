import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 使用相对路径，这样无论部署到 GitHub Pages 的
// 项目子路径（https://用户名.github.io/仓库名/）还是自定义域名根目录都能正常加载资源。
export default defineConfig({
  base: './',
  plugins: [react()],
});
