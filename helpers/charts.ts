function* randomColorGenerator() {
  yield '#4CB140';
  yield '#F445CF';
  yield '#06C';
  yield '#F4C145';
  while (true) {
    yield (
      '#' +
      ((Math.random() * 0xffffff) << 0).toString(16) +
      '000000'
    ).slice(0, 7);
  }
}

const randomColor = randomColorGenerator();

const colors: string[] = [];

export function getColor(index: number) {
  if (colors[index]) {
    return colors[index];
  }
  const color = randomColor.next().value as string;
  colors.push(color);
  return color;
}
