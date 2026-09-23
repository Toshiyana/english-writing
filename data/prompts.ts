import { task1Prompts } from "@/data/task1-prompts";
import type {
  Prompt,
  PromptType,
  Task2Prompt,
  WritingTask,
} from "@/lib/types";

const task2PromptData: Array<Omit<Task2Prompt, "task">> = [
  {
    id: "p01",
    type: "opinion",
    topic: "education",
    title:
      "Some people believe that university students should only study subjects that will be useful for their future careers. Others think they should be free to choose any subject. To what extent do you agree or disagree?",
  },
  {
    id: "p02",
    type: "opinion",
    topic: "technology",
    title:
      "Many people now prefer to shop online rather than in physical stores. Do you think the advantages of this trend outweigh the disadvantages?",
  },
  {
    id: "p03",
    type: "opinion",
    topic: "work",
    title:
      "Employers should be allowed to monitor their employees' online activity during working hours. To what extent do you agree or disagree?",
  },
  {
    id: "p04",
    type: "opinion",
    topic: "environment",
    title:
      "Individuals cannot do much to solve environmental problems, so governments and large companies should take responsibility. To what extent do you agree or disagree?",
  },
  {
    id: "p05",
    type: "opinion",
    topic: "media",
    title:
      "Newspapers and television news should focus more on positive stories than on crime and disasters. To what extent do you agree or disagree?",
  },
  {
    id: "p06",
    type: "discussion",
    topic: "cities",
    title:
      "Some people think governments should spend more money on public transport. Others believe that building new roads is a better solution to traffic problems. Discuss both views and give your own opinion.",
  },
  {
    id: "p07",
    type: "discussion",
    topic: "education",
    title:
      "Some people say that children should begin formal education at a very early age. Others believe they should start school later and spend more time playing. Discuss both views and give your opinion.",
  },
  {
    id: "p08",
    type: "discussion",
    topic: "work",
    title:
      "Some people think that working from home is better for employees. Others believe that working in an office is more effective. Discuss both views and give your own opinion.",
  },
  {
    id: "p09",
    type: "discussion",
    topic: "culture",
    title:
      "Some people believe that museums and art galleries should be free. Others think visitors should pay for admission. Discuss both views and give your opinion.",
  },
  {
    id: "p10",
    type: "discussion",
    topic: "health",
    title:
      "Some people think that healthcare should be funded entirely by the government. Others believe that individuals should pay for their own medical treatment. Discuss both views and give your opinion.",
  },
  {
    id: "p11",
    type: "problem-solution",
    topic: "environment",
    title:
      "In many cities, air pollution has become a serious problem. What are the main causes of this, and what measures can be taken to reduce it?",
  },
  {
    id: "p12",
    type: "problem-solution",
    topic: "health",
    title:
      "More and more people are becoming overweight. What are the reasons for this, and what can be done to solve the problem?",
  },
  {
    id: "p13",
    type: "problem-solution",
    topic: "cities",
    title:
      "Housing in large cities is becoming too expensive for many people. Why is this happening, and what can governments do to address it?",
  },
  {
    id: "p14",
    type: "problem-solution",
    topic: "education",
    title:
      "Many students feel under intense pressure to succeed at school. Why is this the case, and what can be done to reduce this pressure?",
  },
  {
    id: "p15",
    type: "problem-solution",
    topic: "technology",
    title:
      "Young people today spend a large amount of time on social media. What problems can this cause, and how can these problems be solved?",
  },
  {
    id: "p16",
    type: "two-part",
    topic: "work",
    title:
      "In some countries, people are choosing to retire later in life. Why is this happening? Is this a positive or negative development?",
  },
  {
    id: "p17",
    type: "two-part",
    topic: "culture",
    title:
      "International tourism has increased rapidly in recent decades. Why has this happened? What effects has it had on the countries that tourists visit?",
  },
  {
    id: "p18",
    type: "two-part",
    topic: "technology",
    title:
      "Many everyday tasks can now be completed by machines. What kinds of jobs are most affected by this? Do you think this is a positive or negative change?",
  },
  {
    id: "p19",
    type: "two-part",
    topic: "education",
    title:
      "An increasing number of students are choosing to study abroad. Why do they do this? What challenges might they face?",
  },
  {
    id: "p20",
    type: "two-part",
    topic: "media",
    title:
      "People now get most of their news from social media rather than traditional newspapers. Why has this change occurred? What are the consequences?",
  },
  {
    id: "p21",
    type: "opinion",
    topic: "cities",
    title:
      "City centres should be made completely car-free. To what extent do you agree or disagree?",
  },
  {
    id: "p22",
    type: "opinion",
    topic: "health",
    title:
      "Governments should place higher taxes on unhealthy food and drinks. To what extent do you agree or disagree?",
  },
  {
    id: "p23",
    type: "opinion",
    topic: "culture",
    title:
      "Traditional celebrations are becoming less important in modern society. Do you think this is a positive or negative development?",
  },
  {
    id: "p24",
    type: "discussion",
    topic: "environment",
    title:
      "Some people believe that protecting the environment is the responsibility of individuals. Others think it is mainly the responsibility of governments. Discuss both views and give your own opinion.",
  },
  {
    id: "p25",
    type: "discussion",
    topic: "technology",
    title:
      "Some people think artificial intelligence will improve education. Others believe it will have a negative effect on learning. Discuss both views and give your own opinion.",
  },
  {
    id: "p26",
    type: "discussion",
    topic: "media",
    title:
      "Some people believe famous people have a right to complete privacy. Others think the media should be free to report on their private lives. Discuss both views and give your own opinion.",
  },
  {
    id: "p27",
    type: "problem-solution",
    topic: "work",
    title:
      "Many employees find it difficult to maintain a healthy balance between work and personal life. What causes this problem, and what solutions can employers and workers adopt?",
  },
  {
    id: "p28",
    type: "problem-solution",
    topic: "transport",
    title:
      "Public transport in many rural areas is limited or unreliable. What problems does this cause, and how could services be improved?",
  },
  {
    id: "p29",
    type: "problem-solution",
    topic: "culture",
    title:
      "Many traditional crafts are disappearing. Why is this happening, and what can be done to preserve them?",
  },
  {
    id: "p30",
    type: "two-part",
    topic: "health",
    title:
      "More people are using mobile apps to monitor their health and fitness. Why has this become popular? Is it a positive or negative development?",
  },
  {
    id: "p31",
    type: "two-part",
    topic: "environment",
    title:
      "Some countries are investing heavily in renewable energy. Why are they doing this? What difficulties can arise during the transition?",
  },
  {
    id: "p32",
    type: "two-part",
    topic: "cities",
    title:
      "An increasing number of young adults are moving from small towns to large cities. Why is this happening? How does this trend affect small communities?",
  },
];

export const task2Prompts: Task2Prompt[] = task2PromptData.map((prompt) => ({
  ...prompt,
  task: "task2",
}));

export const prompts: Prompt[] = [...task1Prompts, ...task2Prompts];

export function pickPrompt(
  task: WritingTask,
  type: PromptType | "all" = "all",
  excludeId?: string,
): Prompt {
  const pool = prompts.filter(
    (prompt) => prompt.task === task && (type === "all" || prompt.type === type),
  );
  const candidates = pool.filter((prompt) => prompt.id !== excludeId);
  const selectionPool = candidates.length > 0 ? candidates : pool;
  return selectionPool[Math.floor(Math.random() * selectionPool.length)] ?? prompts[0];
}
