// Outline bodies for the posts whose specs give per-heading summaries
// (specs/landing.md T1.9, specs/content.md §2.7). Headings are the live headings; each paragraph is
// the spec's one-line summary, NOT the article prose (see the "read the full article" link).
// Posts without an entry here render their posts.json outline + one-sentence summary.
const B = (f) => `/assets/blog/${f}`

export const BANNER = {
  t: 'img',
  src: B('tUJLrWUiAaxxMQEGHnoT5vE1w.png'),
  w: 800,
  h: 149,
  alt: 'This product is no longer in development. You can access the open source code on GitHub: glassflow/clickhouse-etl. GlassFlow is now building data infra products for AI Agents. Check what’s new at glassflow.ai',
  href: 'https://www.glassflow.ai/',
  external: true,
}

const h2 = (c) => ({ t: 'h2', c })
const h3 = (c) => ({ t: 'h3', c })
const p = (c) => ({ t: 'p', c })

export const POST_BODIES = {
  // /clickstack
  'open-source-observability-clickstack-glassflow': {
    description: 'Open source observability with ClickStack and GlassFlow',
    blocks: [
      BANNER,
      h2('Introduction'),
      p('Teams are caught between costly managed observability vendors and DIY complexity; ClickStack plus GlassFlow is framed as the answer.'),
      h2('Understanding ClickStack as a Complete Observability Platform'),
      p('ClickStack unifies logs, metrics and traces as wide events on ClickHouse.'),
      { t: 'img', src: B('s07Dw6dDDI2JqlU5BZtJBN6r8MI.jpg'), w: 800, h: 484 },
      h2('GlassFlow’s Real-Time ETL Capabilities'),
      p('GlassFlow as the stream processor between Kafka and ClickHouse.'),
      { t: 'h4', c: 'Real-time Deduplication' },
      { t: 'h4', c: 'Temporal Stream Joins' },
      { t: 'h4', c: 'Exactly-Once Semantics' },
      { t: 'h4', c: 'Schema Evolution Handling' },
      h2('Solving Observability Data Challenges: GlassFlow + ClickStack'),
      p('Deduplication, schema evolution, enrichment and data quality problems, and how the pair solves them.'),
      h2('Architecture Patterns and Best Practices'),
      p('A three-layer design: Kafka as the buffer, GlassFlow as the transform, ClickStack as the store.'),
      { t: 'img', src: B('kVGsZWOm65XSmGPNZNHVie8590.jpg'), w: 800, h: 167 },
      h2('Real-World Implementation Examples'),
      p('Production precedents, plus a JSON pipeline config and a SQL schema.'),
      h2('Implementation Guide and Migration Strategy'),
      p('Docker Compose local setup and a phased migration.'),
      {
        t: 'ul',
        items: [
          <strong key="a">Monitoring and Alerting</strong>,
          <strong key="b">Security</strong>,
          <strong key="c">Disaster Recovery</strong>,
          <strong key="d">Performance Validation</strong>,
        ],
      },
      h2('Final Thoughts'),
      p('A summary of the benefits.'),
      h2('References'),
    ],
  },

  // /joins
  'clickhouse-joins': {
    description: 'Learn ClickHouse JOINs step by step: types, examples & best practices.',
    blocks: [
      { t: 'h1q', c: 'Mastering JOINs in ClickHouse' },
      p(<strong>TL;DR: Key Takeaways</strong>),
      {
        t: 'ul',
        items: ['Denormalize First, Join Second', 'Use the Right JOIN for the Job', 'Performance is in Your Hands', 'Know the Algorithms'].map((x) => (
          <strong key={x}>{x}</strong>
        )),
      },
      h2('Why JOINs in a Columnar World?'),
      p('ClickHouse is a columnar OLAP database, so JOINs behave differently than in row stores.'),
      h2('A Refresher on Standard SQL JOINs'),
      p('The basics, with sample tables.'),
      h3('Inner Join'),
      { t: 'img', src: B('M5NeIIAwz6q2OtuL3OiMfnebIcg.png'), w: 800, h: 400 },
      h3('Left Outer Join'),
      { t: 'img', src: B('g2R8mBOVpAcZydsCwIuGTnvCEk.png'), w: 800, h: 400 },
      h3('Right Outer Join'),
      { t: 'img', src: B('HEdg8B9Z8O21Ua22w0smqF687eE.png'), w: 800, h: 400 },
      h3('Full Outer Join'),
      { t: 'img', src: B('MjTjALrSvKUqooOp90MFFrEWpzs.png'), w: 800, h: 400 },
      h3('Why Venn Diagrams Can Be Misleading'),
      p('Venn diagrams depict set operations, not joins.'),
      h2('ClickHouse JOIN'),
      p('ClickHouse extensions to the standard joins.'),
      h3('Strictness Modifiers: ANY and ALL'),
      p(<>
        <code>ALL</code> returns every match, <code>ANY</code> the first match.
      </>),
      h3('Filtering JOIN: SEMI and ANTI'),
      p('Filter one table by another.'),
      h3('Time-Series Magic: ASOF JOIN'),
      p('Nearest-match joins on time.'),
      h3('A Special Case: Unnesting with ARRAY JOIN'),
      p('Unnests array columns.'),
      h3('The Summary of ClickHouse JOIN Toolkit'),
      p('A quick-reference table of the JOIN types.'),
      h2('A Peak Under the Hood at JOIN Algorithms'),
      p('Algorithm choice drives performance.'),
      h3('The Default Workhorse: Hash-Based Joins'),
      h3('Leveraging Order: Merge-Based Join'),
      h3('The Ultimate Speed: Direct Join'),
      { t: 'h4', c: 'Direct Join' },
      { t: 'h4', c: 'Full Sorting Merge Join' },
      { t: 'h4', c: 'Grace Hash Join' },
      { t: 'h4', c: 'Partial Merge Join' },
      h3('Choosing the Right JOIN Algorithm'),
      p('A trade-off between RAM and disk.'),
      h2('Performance Playbook: Optimizing Your ClickHouse JOINs'),
      p('Query-design tips: put the small table on the right, filter early.'),
      h2('Navigating the Limitations'),
      p('Where ClickHouse JOINs struggle.'),
      h2('Conclusion'),
    ],
  },

  // /replacingmergetree-alternative
  'part-3-clickhouse-replacingmergetree-materialized-views-not-enough': {
    description: 'Deep dive on limitations of ReplacingMergeTree and Materialized Views.',
    blocks: [
      BANNER,
      { t: 'h1q', c: 'Part 3: ClickHouse ReplacingMergeTree and Materialized Views are not enough' },
      p('After Parts 1 and 2, this part reviews the ClickHouse-native fixes.'),
      h2('Handling JOIN Performance in ClickHouse'),
      p('Large JOINs hurt real-time analytics.'),
      h3('Using Materialized Views for Pre-Joined Data'),
      p('Precompute the joins.'),
      { t: 'h4', c: 'Limitations of Materialized Views' },
      h3('Denormalization instead of JOINs'),
      p('Store all fields in one table.'),
      h3('Lookups through external Dictionaries'),
      p('Key-value dictionary lookups instead of joins.'),
      h2('Conclusion on solving JOINs directly on ClickHouse'),
      p('Fine for small and mid-sized data; breaks at scale.'),
      h2('Handling Duplicates in ClickHouse'),
      p('Kafka duplicates need handling.'),
      h3('Using ReplacingMergeTree for Deduplication'),
      p('How it works, and its limits.'),
      h2('Conclusion on solving Duplicates directly on ClickHouse'),
      p('Works for small datasets only.'),
      p(
        <a href="https://github.com/glassflow/clickhouse-etl">
          <strong>Try GlassFlow Open Source for ClickHouse on GitHub!</strong>
        </a>,
      ),
      p(<>
        Next part: <a href="/blog/part-4-apache-flink-is-not-the-solution-to-clickhouse-duplications">Part 4: Can Apache Flink be the solution?</a>
      </>),
    ],
  },

  // /vector-dev-alternative
  'when-vector-becomes-your-streaming-engine': {
    description: 'This is what happens when vertical scaling becomes your bottleneck',
    blocks: [
      p(<>
        Most observability stacks don’t start complicated. <a>Vector</a> grows into the streaming engine.
      </>),
      h2('When Scaling Stops Feeling Linear'),
      p('Adding cores stops adding throughput.'),
      h3('A Shared Flow Has Coordination Costs'),
      p('A single topology with bounded channels limits parallelism.'),
      h2('Backpressure and Blast Radius'),
      p('Slow sinks back-pressure every source.'),
      h2('When State Enters the Picture'),
      p('Long-lived state (dedup, joins) strains the model.'),
      h2('ClickHouse Amplifies the Edges'),
      p('Fast inserts hide weaknesses until merges and disk pressure bite.'),
      h2('When Ingestion Becomes Critical Infrastructure'),
      p('The pipeline becomes a tier-1 system.'),
      h2('The Design Envelope'),
      p('Not a critique of tools; this is about design envelopes.'),
      h2('The Questions That Eventually Surface'),
      p('The questions teams end up asking.'),
    ],
  },

  'news-announcing-glassflow-raised-seed-round': {
    leadImage: { t: 'img', src: B('iDO1DdR9JYTIWyDM5r0KAQMqJkI.jpg'), w: 800, h: 544, alt: 'GlassFlow founders' },
  },

  'how-to-debug-an-ai-agent': {
    // live copy bug kept: the description/excerpt field ends with stray front-matter text (content.md §2.7)
    description:
      'How to debug an AI agent in production: find the run, trace it to the first divergence, classify the failure mode, and ship a fix. A step-by-step guide." slug: "blog/what-is-agent-observability',
  },
}
