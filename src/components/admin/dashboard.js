import { useRef, useState } from 'react';
import { number, perHundred, rangeLabel, signed } from './format';
import {
  BarChartRounded,
  CalendarTodayOutlined,
  CheckCircleOutlineRounded,
  PlayCircleOutlineRounded,
  ReportProblemOutlined,
  AutoAwesomeOutlined,
} from '@mui/icons-material';
import TrendChart from './trend-chart';
import Link from 'next/link';
import styles from './dashboard.module.css';

const visualMetrics = {
  starts: 'Runs started',
  finishes: 'Runs finished',
  validations: 'Validation events',
  views: 'Visualizer page views',
};

const featureMetrics = {
  charges: [
    'AI summaries charged',
    'Firestore credit-usage records. One record per charge.',
  ],
  saves: [
    'Saved visualizations',
    'Firestore saves created during the period and still present.',
  ],
  requests: [
    'AI requests',
    'GA4 events fired when an AI summary request is sent.',
  ],
  successes: [
    'AI successes',
    'GA4 events fired after the browser finishes reading a summary.',
  ],
  failures: [
    'AI failures',
    'GA4 events for reported request failures, excluding aborted requests.',
  ],
  blocked: [
    'Feature blocks',
    'GA4 events when sign-in or credits block an action. Includes AI and saving.',
  ],
};

function diff(values) {
  return values.includes(null) ? null : values[0] - values[1];
}

function Delta({ values, suffix = '', showPrevious = true }) {
  const change = diff(values);
  if (change === null)
    return <span className={styles.muted}>Comparison unavailable</span>;
  return (
    <span className={styles.delta}>
      {signed(change)}
      {suffix}
      {showPrevious && ` vs ${number(values[1])}`}
    </span>
  );
}

function DateControls({ periods, timeZone, usingUtcFallback }) {
  const { current, previous, latest, error } = periods;
  return (
    <section className={styles.datePanel} aria-label="Reporting period">
      <div className={styles.dateSummary}>
        <div className={styles.calendar}>
          <CalendarTodayOutlined fontSize="small" />
        </div>
        <div>
          <strong>{rangeLabel(current)}</strong>
          <div className={styles.muted}>
            Compared with {rangeLabel(previous)}
          </div>
        </div>
      </div>
      <div className={styles.dateTools}>
        <div className={styles.presets} aria-label="Date presets">
          {[7, 14, 30, 90].map((days) => (
            <a
              key={days}
              href={`/admin?days=${days}`}
              aria-current={
                days === current.dates.length && current.end === latest
                  ? 'true'
                  : undefined
              }
              aria-label={`Last ${days} complete days`}
            >
              {days}d
            </a>
          ))}
        </div>
        <form className={styles.dateForm} action="/admin" method="get">
          <label>
            From{' '}
            <input
              type="date"
              name="start"
              defaultValue={current.start}
              max={latest}
              required
            />
          </label>
          <label>
            Through{' '}
            <input
              type="date"
              name="end"
              defaultValue={current.end}
              max={latest}
              required
            />
          </label>
          <button className={styles.primaryButton} type="submit">
            Apply
          </button>
        </form>
      </div>
      <p className={styles.dateNote}>
        {current.dates.length} {current.dates.length === 1 ? 'day' : 'days'} ·{' '}
        {timeZone}
        {usingUtcFallback
          ? ' · GA4 time zone unavailable'
          : ' · GA4 activity can take time to appear'}
      </p>
      {error && (
        <p className={styles.notice} role="alert">
          {error} Showing the last 14 complete days.
        </p>
      )}
    </section>
  );
}

function MetricCard({ label, values, icon: Icon, definition, suffix }) {
  const unavailable = values[0] === null;
  return (
    <article className={styles.metricCard}>
      <div className={styles.metricTitle}>
        <Icon fontSize="small" />
        {label}
      </div>
      <div
        className={unavailable ? styles.unavailableValue : styles.metricValue}
      >
        {number(values[0])}
      </div>
      <Delta values={values} suffix={suffix} />
      <p>{definition}</p>
    </article>
  );
}

function MetricSelect({ label, value, onChange, options }) {
  return (
    <label className={styles.selectLabel}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function MovementList({
  visualizers,
  metric,
  heading,
  onSelect,
  increasesOnly,
}) {
  const scores = visualizers
    .map((item) => ({ ...item, change: diff(item.totals[metric]) }))
    .filter(({ change }) => change !== null);
  const movers = scores
    .filter(({ change }) => (increasesOnly ? change > 0 : change !== 0))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 3);
  return (
    <div className={styles.movementList}>
      <h3>{heading}</h3>
      {movers.length ? (
        movers.map(({ id, name, change, totals }) => (
          <div key={id} className={styles.movementRow}>
            <div>
              <button
                className={styles.textButton}
                type="button"
                onClick={() => onSelect(id)}
              >
                {name}
              </button>
              <div className={styles.muted}>
                {number(totals[metric][1])} to {number(totals[metric][0])}
              </div>
            </div>
            <span className={styles.delta}>{signed(change)}</span>
          </div>
        ))
      ) : (
        <p className={styles.muted}>
          {scores.length
            ? increasesOnly
              ? 'No visualizer logged more validation events.'
              : 'Run starts held steady across visualizers.'
            : 'Comparison unavailable for these dates.'}
        </p>
      )}
    </div>
  );
}

function VisualizerTable({ visualizers, selected, onSelect }) {
  const [category, setCategory] = useState('all');
  const [rank, setRank] = useState('starts');
  const [showAll, setShowAll] = useState(false);
  const categories = Object.fromEntries(
    [...new Set(visualizers.map((item) => item.category))].map((name) => [
      name,
      name,
    ]),
  );
  const score = (item) => {
    if (rank !== 'change') return item.totals[rank][0] ?? -1;
    const change = diff(item.totals.starts);
    return change === null ? -1 : Math.abs(change);
  };
  const rows = visualizers
    .filter((item) => category === 'all' || item.category === category)
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeading}>
        <div>
          <h3>Compare visualizers</h3>
          <p>
            Open a visualizer to see its daily activity and device breakdown.
          </p>
        </div>
        <div className={styles.filters}>
          <MetricSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={{ all: 'All categories', ...categories }}
          />
          <MetricSelect
            label="Rank by"
            value={rank}
            onChange={setRank}
            options={{
              starts: 'Run starts',
              change: 'Largest change in starts',
              views: 'Page views',
              validations: 'Validation events',
            }}
          />
        </div>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table} aria-label="Visualizer activity">
          <thead>
            <tr>
              <th scope="col">Visualizer</th>
              <th scope="col">Views</th>
              <th scope="col">Starts</th>
              <th scope="col">Change in starts</th>
              <th scope="col">Finishes / 100 starts</th>
              <th scope="col">Validation events</th>
              <th scope="col">Validations / 100 views</th>
            </tr>
          </thead>
          <tbody>
            {(showAll ? rows : rows.slice(0, 8)).map(
              ({ id, name, category: group, totals }) => {
                const [views] = totals.views;
                const [starts] = totals.starts;
                return (
                  <tr key={id} data-selected={id === selected}>
                    <th scope="row">
                      <button
                        className={styles.textButton}
                        type="button"
                        aria-pressed={id === selected}
                        onClick={() => onSelect(id)}
                      >
                        {name}
                      </button>
                      <div className={styles.muted}>{group}</div>
                    </th>
                    <td>{number(views)}</td>
                    <td>{number(starts)}</td>
                    <td>
                      <Delta values={totals.starts} showPrevious={false} />
                    </td>
                    <td>{number(perHundred(totals.finishes[0], starts))}</td>
                    <td>{number(totals.validations[0])}</td>
                    <td>{number(perHundred(totals.validations[0], views))}</td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 8 && (
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show top 8' : `Show all ${rows.length} visualizers`}
        </button>
      )}
    </div>
  );
}

function VisualizerDetail({ selected, detailRef, periods, issue }) {
  const [metric, setMetric] = useState('starts');
  const { name, path, trend, totals, devices } = selected;
  return (
    <div
      className={styles.detail}
      tabIndex={-1}
      ref={detailRef}
      aria-label={`Details for ${name}`}
    >
      <div className={styles.detailHeading}>
        <h3>{name}</h3>
        <a href={path}>Open visualizer</a>
      </div>
      <div className={styles.detailFacts}>
        {[
          ['finishes', 'Runs finished'],
          ['edits', 'Input edits'],
          ['loads', 'Inputs loaded'],
          ['shares', 'Share events'],
        ].map(([key, label]) => (
          <div key={key}>
            <span>{label}</span>
            <strong>{number(totals[key][0])}</strong>
            <Delta values={totals[key]} />
          </div>
        ))}
      </div>
      <div className={styles.split}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <h4>Visualizer activity</h4>
            <MetricSelect
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={visualMetrics}
            />
          </div>
          <TrendChart
            trend={trend[metric]}
            periods={periods}
            label={visualMetrics[metric]}
            issue={issue}
          />
        </section>
        <section className={styles.panel}>
          <h4>Input friction by device</h4>
          <p className={styles.muted}>
            Validation events per 100 page views on each device, with event
            counts for context.
          </p>
          {devices.length ? (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Device</th>
                    <th scope="col">Views</th>
                    <th scope="col">Events</th>
                    <th scope="col">Per 100 views</th>
                    <th scope="col">Previous per 100</th>
                  </tr>
                </thead>
                <tbody>
                  {[...devices]
                    .sort((a, b) => b.views[0] - a.views[0])
                    .map(({ label, views, validations }) => (
                      <tr key={label}>
                        <th scope="row" className={styles.device}>
                          {label}
                        </th>
                        <td>{number(views[0])}</td>
                        <td>{number(validations[0])}</td>
                        <td>{number(perHundred(validations[0], views[0]))}</td>
                        <td>{number(perHundred(validations[1], views[1]))}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.empty}>
              {issue || 'No device activity was recorded.'}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function FeatureActivity({ features, periods, visualizers, onSelect }) {
  const [metric, setMetric] = useState('charges');
  const { trend, issue } = features[metric];
  const charges = new Map(
    features.charges.byAlgorithm.map(({ id, totals }) => [id, totals]),
  );
  const saves = new Map(
    features.saves.byAlgorithm.map(({ id, totals }) => [id, totals]),
  );
  const rows = [...new Set([...charges.keys(), ...saves.keys()])]
    .map((id) => ({
      id,
      name:
        visualizers.find((item) => item.id === id)?.name || 'Other visualizers',
      charges:
        charges.get(id) || (features.charges.issue ? [null, null] : [0, 0]),
      saves: saves.get(id) || (features.saves.issue ? [null, null] : [0, 0]),
    }))
    .sort(
      (a, b) =>
        b.charges[0] - a.charges[0] ||
        b.saves[0] - a.saves[0] ||
        a.name.localeCompare(b.name),
    );
  const [showAll, setShowAll] = useState(false);
  const options = Object.fromEntries(
    Object.entries(featureMetrics).map(([key, [label]]) => [key, label]),
  );

  return (
    <>
      <div className={styles.featureGrid}>
        {Object.entries(featureMetrics).map(([key, [label, description]]) => (
          <button
            key={key}
            type="button"
            className={styles.featureMetric}
            aria-pressed={key === metric}
            onClick={() => setMetric(key)}
          >
            <span>{label}</span>
            <strong>{number(features[key].totals[0])}</strong>
            <Delta values={features[key].totals} />
            <small>{description}</small>
          </button>
        ))}
      </div>
      <div className={styles.split}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <h3>{options[metric]} over time</h3>
          </div>
          <TrendChart
            trend={trend}
            periods={periods}
            label={options[metric]}
            issue={issue}
          />
        </section>
        <section className={styles.panel}>
          <h3>Charges and saves by visualizer</h3>
          <p className={styles.muted}>
            Firestore records. Each cell shows the selected and previous period.
          </p>
          {rows.length ? (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Visualizer</th>
                    <th scope="col">AI charges</th>
                    <th scope="col">Saves still present</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? rows : rows.slice(0, 6)).map(
                    ({ id, name, charges, saves }) => (
                      <tr key={id ?? 'other'}>
                        <th scope="row">
                          {id ? (
                            <button
                              className={styles.textButton}
                              onClick={() => onSelect(id)}
                            >
                              {name}
                            </button>
                          ) : (
                            name
                          )}
                        </th>
                        <td>
                          {number(charges[0])}
                          <div className={styles.muted}>
                            {number(charges[1])} previously
                          </div>
                        </td>
                        <td>
                          {number(saves[0])}
                          <div className={styles.muted}>
                            {number(saves[1])} previously
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.empty}>
              {features.charges.issue ||
                features.saves.issue ||
                'No charges or saves were recorded in either period.'}
            </p>
          )}
          {rows.length > 6 && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show top 6' : `Show all ${rows.length}`}
            </button>
          )}
        </section>
      </div>
    </>
  );
}

export default function Dashboard({
  periods,
  timeZone,
  usingUtcFallback,
  trackingStart,
  visual,
  features,
}) {
  const { overall, visualizers, issue } = visual;
  const [metric, setMetric] = useState('starts');
  const [selectedId, setSelectedId] = useState(null);
  const detailRef = useRef(null);
  const selected =
    visualizers.find(({ id }) => id === selectedId) ||
    visualizers.reduce((top, item) =>
      item.totals.starts[0] > top.totals.starts[0] ? item : top,
    );
  const { starts, finishes, validations } = overall.totals;
  const finishRate = finishes.map((count, index) =>
    perHundred(count, starts[index]),
  );
  const chooseVisualizer = (id) => {
    setSelectedId(id);
    requestAnimationFrame(() => detailRef.current?.focus());
  };
  const issues = [
    ...new Set(
      [
        issue,
        ...Object.values(features).map((feature) => feature.issue),
      ].filter(Boolean),
    ),
  ];
  const trackingDate = rangeLabel({ start: trackingStart, end: trackingStart });

  return (
    <div className={styles.dashboard}>
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <Link href="/" className={styles.brand}>
            <BarChartRounded aria-hidden="true" />
            See Algorithms
          </Link>
          <nav aria-label="Analytics sections">
            <a href="#overview">Overview</a>
            <a href="#visualizers">Visualizers</a>
            <a href="#features">Features</a>
          </nav>
        </div>
      </header>
      <main className={styles.main} id="overview">
        <h1>Product analytics</h1>
        <p className={styles.intro}>
          See which visualizers people use, where inputs get blocked, and what
          changes over time.
        </p>
        <DateControls
          periods={periods}
          timeZone={timeZone}
          usingUtcFallback={usingUtcFallback}
        />
        {issues.map((message) => (
          <p className={styles.notice} key={message} role="status">
            {message}
          </p>
        ))}
        {!issue && periods.previous.start < trackingStart && (
          <p className={styles.notice}>
            GA4 product event coverage begins {trackingDate}. Event totals are
            unavailable for periods that start earlier.
          </p>
        )}
        <div className={styles.metrics}>
          <MetricCard
            label="Runs started"
            values={starts}
            icon={PlayCircleOutlineRounded}
            definition="GA4 start events on catalog visualizer pages."
          />
          <MetricCard
            label="Finishes per 100 starts"
            values={finishRate}
            icon={CheckCircleOutlineRounded}
            suffix=" pp"
            definition="GA4 finishes ÷ starts × 100. Includes repeat runs."
          />
          <MetricCard
            label="Validation events"
            values={validations}
            icon={ReportProblemOutlined}
            definition="GA4 input and operation checks that blocked or stopped a run."
          />
          <MetricCard
            label="AI summaries charged"
            values={features.charges.totals}
            icon={AutoAwesomeOutlined}
            definition={featureMetrics.charges[1]}
          />
        </div>
        <div className={styles.overview}>
          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Visualizer activity</h2>
                <p>
                  {periods.current.dates.length > 35
                    ? 'Groups up to seven aligned days into each pair of bars.'
                    : 'Aligns each day with its counterpart in the previous period.'}
                </p>
              </div>
              <MetricSelect
                label="Metric"
                value={metric}
                onChange={setMetric}
                options={visualMetrics}
              />
            </div>
            <TrendChart
              trend={overall.trend[metric]}
              periods={periods}
              label={visualMetrics[metric]}
              issue={issue}
            />
          </section>
          <section className={styles.panel}>
            <h2>What changed</h2>
            <MovementList
              visualizers={visualizers}
              metric="starts"
              heading="Largest shifts in starts"
              onSelect={chooseVisualizer}
            />
            <MovementList
              visualizers={visualizers}
              metric="validations"
              heading="Largest increases in validation events"
              onSelect={chooseVisualizer}
              increasesOnly
            />
          </section>
        </div>
        <section className={styles.section} id="visualizers">
          <h2>Visualizers</h2>
          <p>
            GA4 counts on catalog pages, including their embedded versions. A
            visit can generate several runs and validation events.
          </p>
          <VisualizerTable
            visualizers={visualizers}
            selected={selected.id}
            onSelect={chooseVisualizer}
          />
          <VisualizerDetail
            selected={selected}
            detailRef={detailRef}
            periods={periods}
            issue={issue}
          />
        </section>
        <section className={styles.section} id="features">
          <h2>AI summaries and saves</h2>
          <p>
            Firestore records reflect completed charges and retained saves. GA4
            reflects what consenting browsers reported.
          </p>
          <FeatureActivity
            features={features}
            periods={periods}
            visualizers={visualizers}
            onSelect={chooseVisualizer}
          />
        </section>
        <footer className={styles.footer}>
          <details>
            <summary>How to read these numbers</summary>
            <ul>
              <li>
                GA4 figures count events from analytics-enabled browsers. Page
                views, runs and failures can include repeated actions.
              </li>
              <li>
                Finishes per 100 starts compares two event totals within a
                period. A run can start and finish on different days. Rates
                require a positive denominator.
              </li>
              <li>
                Feature blocks can overlap AI failures. Charges, requests and
                successes come from different recording points, so each is
                displayed as its own count.
              </li>
              <li>
                Zero means a report returned no recorded activity. Unavailable
                covers reporting errors, missing coverage or an undefined ratio.
              </li>
              <li>
                Custom product event coverage starts on {trackingDate}. Period
                totals require coverage for every selected day.
              </li>
            </ul>
          </details>
        </footer>
      </main>
    </div>
  );
}
