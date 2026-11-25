import { number, rangeLabel, shortDate } from './format';
import styles from './dashboard.module.css';

function chartGroups(trend, periods) {
  const days = periods.current.dates.length;
  const groupSize = days > 35 ? 7 : 1;
  const ranges = [periods.current, periods.previous];
  return Array.from({ length: Math.ceil(days / groupSize) }, (_, index) => {
    const start = index * groupSize;
    const end = Math.min(start + groupSize, days);
    return {
      labels: ranges.map(({ dates }) =>
        rangeLabel({ start: dates[start], end: dates[end - 1] }),
      ),
      counts: trend.map((values) => {
        const group = values.slice(start, end);
        return group.includes(null)
          ? null
          : group.reduce((total, value) => total + value, 0);
      }),
    };
  });
}

export default function TrendChart({ trend, periods, label, issue }) {
  const groups = chartGroups(trend, periods);
  const largest = Math.max(0, ...groups.flatMap(({ counts }) => counts));
  const step = Math.max(1, Math.ceil(largest / 4));
  const hasData = groups.some(({ counts }) =>
    counts.some((count) => count !== null),
  );
  return (
    <div className={styles.chart}>
      <div className={styles.legend}>
        <span>
          <i className={styles.currentSwatch} /> Selected period
        </span>
        <span>
          <i className={styles.previousSwatch} /> Previous period
        </span>
        {groups.some(({ counts }) => counts.includes(null)) && (
          <span>
            <i className={styles.missingSwatch} /> Unavailable
          </span>
        )}
      </div>
      {hasData ? (
        <>
          <div
            className={styles.plot}
            role="img"
            aria-label={`${label} by day, selected period and previous period. Exact values follow the chart.`}
          >
            <div className={styles.axes} aria-hidden="true">
              {[4, 3, 2, 1, 0].map((tick) => (
                <span key={tick}>{number(step * tick)}</span>
              ))}
            </div>
            <div className={styles.bars} aria-hidden="true">
              {groups.map(({ counts, labels }) => (
                <div
                  key={labels[0]}
                  className={styles.barPair}
                  title={labels
                    .map((date, index) => `${date} · ${number(counts[index])}`)
                    .join('\n')}
                >
                  {counts.map((count, index) => (
                    <i
                      key={index}
                      className={
                        count === null
                          ? styles.missingSwatch
                          : index === 0
                            ? styles.currentSwatch
                            : styles.previousSwatch
                      }
                      style={
                        count === null
                          ? undefined
                          : { height: `${(100 * count) / (4 * step)}%` }
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className={styles.axisDates} aria-hidden="true">
              <span>{shortDate(periods.current.start)}</span>
              {periods.current.start !== periods.current.end && (
                <span>{shortDate(periods.current.end)}</span>
              )}
            </div>
          </div>
          <details className={styles.chartValues}>
            <summary>View chart values</summary>
            <div className={styles.tableScroll}>
              <table
                className={styles.table}
                aria-label={`${label} chart values`}
              >
                <thead>
                  <tr>
                    <th>Selected dates</th>
                    <th>Count</th>
                    <th>Previous dates</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map(({ labels, counts }) => (
                    <tr key={labels[0]}>
                      <th scope="row">{labels[0]}</th>
                      <td>{number(counts[0])}</td>
                      <td>{labels[1]}</td>
                      <td>{number(counts[1])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p className={styles.empty}>
          {issue || 'Activity is unavailable for these dates.'}
        </p>
      )}
    </div>
  );
}
