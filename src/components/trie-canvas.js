import { Paper } from '@mui/material';
import { memo } from 'react';

const NODE_R = 16; // node radius
const EMPTY_MSG = 'Insert a word to see the Trie grow';

const COLORS = {
  node: '#fff',
  nodeBorder: '#4a90d9',
  root: '#f0f4ff',
  endNode: '#ffd580',
  highlight: '#ff9800',
  highlightMiss: '#ef5350',
  highlightFound: '#42a5f5',
  edge: '#9e9e9e',
  text: '#212121',
  rootText: '#9e9e9e',
};

function nodeColor(node) {
  if (node.highlighted === 'miss') return COLORS.highlightMiss;
  if (node.highlighted === 'found') return COLORS.highlightFound;
  if (node.highlighted) return COLORS.highlight;
  if (node.isEnd) return COLORS.endNode;
  if (!node.char) return COLORS.root;
  return COLORS.node;
}

const styles = {
  svg: { width: '100%', height: '100%' },
  circle: { transition: 'fill 0.3s ease, stroke 0.3s ease' },
  edge: { transition: 'stroke 0.3s ease' },
  label: { userSelect: 'none' },
};

function TrieCanvas({ nodes, edges }) {
  const hasNodes = Boolean(nodes?.some((n) => n.char !== ''));

  return (
    <Paper className="resizable">
      <svg
        // viewBox="0 0 600 400"
        style={styles.svg}
        aria-label="Trie visualization"
        role="img"
      >
        <g>
          {edges?.map(({ from, to }) => (
            <line
              key={`${from.id}-${to.id}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={to.highlighted ? COLORS.highlight : COLORS.edge}
              strokeWidth={to.highlighted ? 2.5 : 2}
              style={styles.edge}
            />
          ))}
        </g>

        <g>
          {nodes?.map((node) => {
            const color = nodeColor(node);
            const isRoot = !node.char;
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R}
                  fill={color}
                  stroke={node.highlighted ? color : COLORS.nodeBorder}
                  strokeWidth={2}
                  className={styles.circle}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.label}
                  fill={isRoot ? COLORS.rootText : COLORS.text}
                  fontSize={14}
                  fontWeight={node.isEnd ? 700 : 500}
                >
                  {isRoot ? 'rt' : node.char.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Empty state ── */}
        {!hasNodes && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#bdbdbd"
            fontSize={14}
          >
            {EMPTY_MSG}
          </text>
        )}
      </svg>
    </Paper>
  );
}

export default memo(TrieCanvas);
