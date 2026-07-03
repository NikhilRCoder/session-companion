import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outfile: "app.js",
  format: "iife",
  minify: true,
  jsx: "automatic",
  target: "es2020",
  logLevel: "info",
  define: { "process.env.NODE_ENV": '"production"' },
};

if (watch) {
  const ctx = await esbuild.context({ ...options, minify: false });
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(options);
}
