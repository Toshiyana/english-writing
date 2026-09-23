export type DiffPart = {
  type: "equal" | "added" | "removed";
  words: string[];
};

function words(text: string): string[] {
  return text.trim().match(/\S+/g) ?? [];
}

export function diffWords(before: string, after: string): DiffPart[] {
  const left = words(before);
  const right = words(after);
  const matrix = Array.from(
    { length: left.length + 1 },
    () => new Uint16Array(right.length + 1),
  );

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      matrix[leftIndex][rightIndex] =
        left[leftIndex - 1] === right[rightIndex - 1]
          ? matrix[leftIndex - 1][rightIndex - 1] + 1
          : Math.max(
              matrix[leftIndex - 1][rightIndex],
              matrix[leftIndex][rightIndex - 1],
            );
    }
  }

  const reversed: Array<{ type: DiffPart["type"]; word: string }> = [];
  let leftIndex = left.length;
  let rightIndex = right.length;

  while (leftIndex > 0 || rightIndex > 0) {
    if (
      leftIndex > 0 &&
      rightIndex > 0 &&
      left[leftIndex - 1] === right[rightIndex - 1]
    ) {
      reversed.push({ type: "equal", word: left[leftIndex - 1] });
      leftIndex -= 1;
      rightIndex -= 1;
    } else if (
      rightIndex > 0 &&
      (leftIndex === 0 ||
        matrix[leftIndex][rightIndex - 1] >
          matrix[leftIndex - 1][rightIndex])
    ) {
      reversed.push({ type: "added", word: right[rightIndex - 1] });
      rightIndex -= 1;
    } else {
      reversed.push({ type: "removed", word: left[leftIndex - 1] });
      leftIndex -= 1;
    }
  }

  const parts: DiffPart[] = [];
  for (const item of reversed.reverse()) {
    const last = parts.at(-1);
    if (last?.type === item.type) {
      last.words.push(item.word);
    } else {
      parts.push({ type: item.type, words: [item.word] });
    }
  }
  return parts;
}
