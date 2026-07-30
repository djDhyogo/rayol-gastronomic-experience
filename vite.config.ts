// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mergeConfig, type PluginOption, type UserConfig } from "vite";

const baseConfig = defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

export default async (env: Parameters<typeof baseConfig>[0]) => {
  const config = await baseConfig(env);

  // Remove o plugin legado para evitar warning do Vite 8 e usa resolução nativa.
  const withoutLegacyTsconfigPaths: UserConfig = {
    ...config,
    plugins: (config.plugins ?? []).filter(
      (plugin): plugin is PluginOption =>
        Boolean(plugin) &&
        !(typeof plugin === "object" && "name" in plugin && plugin.name === "vite-tsconfig-paths"),
    ),
  };

  return mergeConfig(withoutLegacyTsconfigPaths, {
    resolve: {
      tsconfigPaths: true,
    },
  });
};
