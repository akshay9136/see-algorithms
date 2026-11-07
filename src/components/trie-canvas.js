import Draggable from './common/draggable';
import { Colors } from '../common/constants';
import { memo } from 'react';

const NODE_R = 18; // node radius
const EMPTY_MSG = 'Insert a word to see the Trie grow';

function nodeColor(node) {
  if (node.highlighted === 'miss') return '#FF6347';
  if (node.highlighted === 'found') return Colors.sorted;
  if (node.highlighted) return Colors.visited;
  if (node.isEnd) return Colors.enqueue;
  if (!node.char) return Colors.vertex;
  return Colors.white;
}

const styles = {
  svg: { width: '100%', height: '100%', overflow: 'visible' },
  circle: { transition: 'fill 0.3s ease, stroke 0.3s ease' },
  edge: { transition: 'stroke 0.3s ease' },
  label: { userSelect: 'none', fontWeight: 600 },
};

function TrieCanvas({ nodes, edges }) {
  const hasNodes = Boolean(nodes?.some((n) => n.char !== ''));

  return (
    <Draggable>
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
              stroke={to.highlighted ? Colors.visited : Colors.stroke}
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
                  stroke={node.highlighted ? color : Colors.stroke}
                  strokeWidth={1.5}
                  style={styles.circle}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={styles.label}
                  fill={Colors.label}
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
    </Draggable>
  );
}

export default memo(TrieCanvas);
