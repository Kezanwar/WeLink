export const capitalizeWord = (word: string) => {
  const capital = word.charAt(0).toUpperCase();
  return capital + word.slice(1);
};
