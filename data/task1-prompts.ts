import type { Task1Prompt, Task1VisualType } from "@/lib/types";

const instruction =
  "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";

function visual(
  id: string,
  alt: string,
): Task1Prompt["visual"] {
  return {
    src: `/task1/${id}.svg`,
    alt,
    width: 1000,
    height: 620,
  };
}

function task1Prompt(
  id: string,
  type: Task1VisualType,
  topic: string,
  description: string,
  alt: string,
): Task1Prompt {
  return {
    id,
    task: "task1",
    type,
    topic,
    title: `The ${description}. ${instruction}`,
    visual: visual(id, alt),
  };
}

export const task1Prompts: Task1Prompt[] = [
  task1Prompt(
    "t1-01",
    "bar",
    "transport",
    "bar chart shows the percentage of commuters using four forms of transport in five cities in 2025",
    "Grouped bar chart comparing car, bus, rail and bicycle commuting in Alder, Brook, Cedar, Dover and Elm",
  ),
  task1Prompt(
    "t1-02",
    "bar",
    "culture",
    "bar chart compares monthly library visits by four age groups in 2015 and 2025",
    "Bar chart comparing library visits by people aged 15 to 24, 25 to 44, 45 to 64, and 65 plus in 2015 and 2025",
  ),
  task1Prompt(
    "t1-03",
    "line",
    "environment",
    "line graph shows the share of electricity generated from renewable sources in four countries between 2000 and 2025",
    "Line graph showing renewable electricity percentages for Norland, Estia, Pelago and Varen from 2000 to 2025",
  ),
  task1Prompt(
    "t1-04",
    "line",
    "culture",
    "line graph compares visitor numbers at three museums over one year",
    "Line graph of monthly visitors in thousands to the City, Science and Maritime museums from January to December",
  ),
  task1Prompt(
    "t1-05",
    "pie",
    "finance",
    "pie charts compare average household spending in one country in 1995 and 2025",
    "Two pie charts comparing household spending on housing, food, transport, leisure and other items in 1995 and 2025",
  ),
  task1Prompt(
    "t1-06",
    "pie",
    "energy",
    "pie charts show the sources used to generate electricity in two countries in 2025",
    "Two pie charts comparing coal, gas, nuclear, hydro and wind generation in Eastland and Westland",
  ),
  task1Prompt(
    "t1-07",
    "table",
    "education",
    "table gives the number of university graduates and their employment rates in five subject areas in 2024",
    "Table listing graduate numbers and employment rates for engineering, business, health, arts and science",
  ),
  task1Prompt(
    "t1-08",
    "table",
    "transport",
    "table compares public transport use and punctuality in five cities in 2015 and 2025",
    "Table comparing annual passenger journeys and services arriving on time in five cities in 2015 and 2025",
  ),
  task1Prompt(
    "t1-09",
    "process",
    "environment",
    "diagram illustrates how used glass bottles are recycled and returned to shops",
    "Eight-stage circular process for collecting, sorting, crushing, melting, remoulding, filling and delivering glass bottles",
  ),
  task1Prompt(
    "t1-10",
    "process",
    "water",
    "diagram shows how rainwater is collected and reused in a residential building",
    "Process diagram showing rainwater moving from a roof through a filter and tank for toilet and garden use",
  ),
  task1Prompt(
    "t1-11",
    "map",
    "cities",
    "maps show how a harbour area changed between 2000 and 2025",
    "Two maps comparing a harbour in 2000 and 2025, including changes to warehouses, ferry terminal and public spaces",
  ),
  task1Prompt(
    "t1-12",
    "map",
    "education",
    "maps compare a university campus before and after redevelopment",
    "Two campus plans showing changes to teaching blocks, accommodation, paths, green space and sports facilities",
  ),
  task1Prompt(
    "t1-13",
    "mixed",
    "cities",
    "charts compare population and household water use in four cities in 2025",
    "Combined bar and line chart comparing population in millions and daily household water use per person in four cities",
  ),
  task1Prompt(
    "t1-14",
    "mixed",
    "education",
    "table and pie chart give information about university student accommodation in 2025",
    "Table of accommodation costs and travel times with a pie chart showing student satisfaction levels",
  ),
];
