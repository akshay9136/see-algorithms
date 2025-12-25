module.exports = () => {
  const txy = (id, x, y) => {
    const el = document.querySelector(id);
    if (el !== null) {
      if (x !== null) el.dataset.tx = x;
      if (y !== null) el.dataset.ty = y;
    }
    return Promise.resolve();
  };

  const tx = (id, x) => txy(id, x, null);
  const ty = (id, y) => txy(id, null, y);

  const bgcolor = (id, color) => {
    const el = document.querySelector(id);
    if (el !== null) {
      el.style.backgroundColor = color;
    }
    return Promise.resolve();
  };

  const animate = () => Promise.resolve();

  const cleanup = (node, dx, dy) => {
    if (node) {
      node.x = node.x + dx;
      node.y = node.y - dy;
      txy(node.id, node.x, node.y);
      if (node.parent) {
        const ex = node.x + 25;
        const ey = node.y + 20;
        txy(node.eid, ex, ey);
      }
      cleanup(node.left, dx, dy);
      cleanup(node.right, dx, dy);
    }
  };

  return [null, { txy, tx, ty, bgcolor, animate, cleanup }];
};
