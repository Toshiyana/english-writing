import type { Prompt, QuestionType } from "@/lib/types";

export const prompts: Prompt[] = [
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
];

export function pickPrompt(type?: QuestionType | "all"): Prompt {
  const pool =
    type && type !== "all"
      ? prompts.filter((prompt) => prompt.type === type)
      : prompts;
  return pool[Math.floor(Math.random() * pool.length)] ?? prompts[0];
}
