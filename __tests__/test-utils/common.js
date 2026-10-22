export const Numbers = {
  sortAsc: (arr) => [...arr].sort((a, b) => a - b),
  sortDesc: (arr) => [...arr].sort((a, b) => b - a),
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
};
