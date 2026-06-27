import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (env, argv) => {
  const isDevelopment = (argv.mode === "development");
  const mode = isDevelopment ? "development" : "production";
  return {
    mode,
    entry: "./src/index.mjs",
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "bundle.mjs",
      library: {
        type: 'module',
      },
      globalObject: "globalThis",
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: ['.ts', '.mjs', '.js'],
    },
    module: {
    },
    externals: {
    },
  };
};
