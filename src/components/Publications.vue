<template>
    <Accordion :value="null">
      <AccordionPanel value="0">
        <AccordionHeader>
          Decomposing oceanic temperature and salinity change using ocean
          carbon change
          </AccordionHeader
        >
        <AccordionContent>
          <p class="m-0">
            <a href="https://os.copernicus.org/articles/18/523/2022">https://os.copernicus.org/articles/18/523/2022</a>
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader
          >Remineralisation changes dominate oxygen variability in the North
          Atlantic</AccordionHeader
        >
        <AccordionContent>
          <p class="m-0">
            <a href="https://os.copernicus.org/articles/22/225/2026/os-22-225-2026.html">https://os.copernicus.org/articles/22/225/2026/os-22-225-2026.html</a>
          </p>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="2">
        <AccordionHeader
          >OrgAlkCalc: Estimation of organic alkalinity quantities and acid-base properties with proof of concept in Dublin Bay
          </AccordionHeader
        >
        <AccordionContent>
          <p class="m-0">
            <a href="https://www.sciencedirect.com/science/article/pii/S0304420323000300">https://www.sciencedirect.com/science/article/pii/S0304420323000300</a>
          </p>
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
