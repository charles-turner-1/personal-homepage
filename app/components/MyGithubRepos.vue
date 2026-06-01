<script setup lang="ts">
import LinkCard from "./LinkCard.vue";

const repos = [
  {
    name: "GLODAP_Section_Gridder.jl",
    icons: ["i-vscode-icons-file-type-julia"],
    description: "A toolbox for gridding GLODAP data onto WOCE sections.",
    href: "https://github.com/charles-turner-1/GLODAP_Section_Gridder.jl",
  },
  {
    name: "OrgAlkCalc",
    icons: ["i-vscode-icons-file-type-python"],
    description: "A Python toolbox for calculating organic alkalinity.",
    href: "https://github.com/charles-turner-1/OrgAlkCalc",
  },
  {
    name: "spectrend",
    icons: ["i-vscode-icons-file-type-python"],
    description: "A toolbox for doing phase scrambling in Python.",
    href: "https://github.com/charles-turner-1/spectrend",
  },
  {
    name: "nchash-rs",
    icons: ["i-vscode-icons-file-type-rust", "i-vscode-icons-file-type-python"],
    description:
      "Maturin based rebuild of the NCHash library for learning purposes.",
    href: "https://github.com/charles-turner-1/nchash-rs",
  },
  {
    name: "nchdr",
    icons: ["i-vscode-icons-file-type-rust"],
    description:
      "A dead simple, colourised netCDF file header viewer - written in Rust.",
    href: "https://github.com/charles-turner-1/nchdr",
  },
  {
    name: "xrexpr",
    icons: ["i-vscode-icons-file-type-python"],
    description:
      "XArray accessor for lazy regular expression matching on string coordinates.",
    href: "https://github.com/charles-turner-1/xrexpr",
  },
  {
    name: "pytest-flake-detection",
    icons: ["i-vscode-icons-file-type-python"],
    description: "Continuously runs your tests to detect flaky tests.",
    href: "https://github.com/charles-turner-1/pytest-flake-detection",
  },
];
</script>

<template>
  <div class="font-semibold my-2">
    These aren't serious work projects - just some ideas I started and (mostly)
    never finished.
  </div>
  <div class="text-small mt-2 mb-4 ml-4">
    - If you are interested in any of these, give me a shout!
  </div>
  <div class="grid grid-cols-1 gap-4">
    <LinkCard
      v-for="repo in repos"
      :key="repo.href"
      v-bind="repo"
      :external="true"
    />
  </div>
</template>
