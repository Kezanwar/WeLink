type ConditionalClass = string | undefined | null | boolean;

const cc = (classes: ConditionalClass[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default cc;
