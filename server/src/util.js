export const round = number =>
  parseFloat(Math.round(number * 100) / 100).toFixed(2);

export default {
  round,
};
