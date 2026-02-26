<template>
    <Accordion :value="null">
      <AccordionPanel value="0">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-vue" class="mr-2" />
            <v-icon name="vi-file-type-typescript" class="mr-2" />
          catalog-viewer-spa
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">ACCESS-NRI Intake Catalog Viewer, built (vibe-coded) with Vue.</p>
          <a href="https://github.com/charles-turner-1/catalog-viewer-spa">https://github.com/charles-turner-1/catalog-viewer-spa</a>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-julia" class="mr-2" />
            GLODAP_Section_Gridder.jl
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">A toolbox for gridding GLODAP data onto WOCE sections</p>
          <a href="https://github.com/charles-turner-1/GLODAP_Section_Gridder.jl">https://github.com/charles-turner-1/GLODAP_Section_Gridder.jl</a>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-python" class="mr-2" />
            OrgAlkCalc
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">A Python toolbox for calculating organic alkalinity</p>
          <a href="https://github.com/charles-turner-1/OrgAlkCalc">https://github.com/charles-turner-1/OrgAlkCalc</a>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="3">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-python" class="mr-2" />
          spectrend
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">A toolbox for doing phase scrambling in Python</p>
          <a href="https://github.com/charles-turner-1/spectrend">https://github.com/charles-turner-1/spectrend</a>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="4">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-rust" class="mr-2" />
            <v-icon name="vi-file-type-python" class="mr-2" />
          nchash-rs
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">Maturin based rebuild of the NCHash library for learning purposes</p>
          <a href="https://github.com/charles-turner-1/nchash-rs">https://github.com/charles-turner-1/nchash-rs</a>

        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="5">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-rust" class="mr-2" />
          nchdr
          </span> 
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">A dead simple, colourised netCDF file header viewer - written in Rust</p>
          <a href="https://github.com/charles-turner-1/nchdr">https://github.com/charles-turner-1/nchdr</a>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="6">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-python" class="mr-2" />
            xrexpr
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">A Rust library for regular expression parsing and matching</p>
          <a href="https://github.com/charles-turner-1/xrexpr">https://github.com/charles-turner-1/xrexpr</a>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="7">
        <AccordionHeader>
          <span class="flex items-center justify-start">
            <v-icon name="vi-file-type-python" class="mr-2" />
          pytest-flake-detection
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p class="m-0">Continuously runs your tests to detect flaky tests</p>
          <a href="https://github.com/charles-turner-1/pytest-flake-detection">https://github.com/charles-turner-1/pytest-flake-detection</a>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
</template>


<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
</script>
