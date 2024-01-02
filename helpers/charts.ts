export const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);

const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF9F40'];
export const staticColorPalette = colorPalette;

export const getRandomColor = () => {
  const index = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[index];
};
