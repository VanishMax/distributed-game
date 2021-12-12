import { defineConfig, loadEnv } from 'vite';
import preact from "@preact/preset-vite";

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [preact()],
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    },
    server: {
      port: parseInt(process.env.VITE_PORT)
    }
  });

}
