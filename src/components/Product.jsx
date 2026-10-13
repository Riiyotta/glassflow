import { A, Shell, TitleBar, DarkButton } from './ui.jsx'

function Badge({ children }) {
  return (
    <span className="inline-block self-start bg-amber p-1 font-mono text-[14px] font-bold leading-[18.2px] text-on-amber">
      {children}
    </span>
  )
}

// Text column: content block vertically centred (Framer "col": padding 64/40/32, justify center),
// copy group (badge, H2, body; gap 32) then actions, gap 64.
function Copy({ badge, title, children, actions, className = '' }) {
  return (
    <div className={`hairline flex flex-col justify-center bg-panel p-8 md:p-10 lg:h-[671px] lg:p-16 ${className}`}>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Badge>{badge}</Badge>
          <h2 className="t-h2">{title}</h2>
          <div className="t-body opacity-80">{children}</div>
        </div>
        <div className="flex gap-2">{actions}</div>
      </div>
    </div>
  )
}

function Shot({ src, alt, className = '' }) {
  return (
    <div className={className}>
      <img src={A(src)} alt={alt} className="block h-[400px] w-full object-cover md:h-[671px]" />
    </div>
  )
}

export function Tares() {
  return (
    <Shell inner="bg-panel">
      <TitleBar label="products" hideLabel />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* mobile: image first; tablet: text first; desktop: text left */}
        <Copy
          className="order-2 md:order-1"
          badge="GlassFlow Tares"
          title="One correlated read over every system your agents touch."
          actions={
            <>
              <DarkButton label="github" href="https://github.com/glassflow/tares" withArrow />
              <DarkButton label="learn_more" href="https://tares.glassflow.ai/" bg="bg-panel" outlined />
            </>
          }
        >
          <p>
            Instead of your agent firing dozens of live tool calls at runtime (slow, expensive,
            inconsistent), <a href="/tares" className="inline-link">GlassFlow Tares</a>
            <a href="https://tares.glassflow.ai/" className="inline-link"> </a>prepares and delivers
            exactly the data each agent needs, already correlated across every source. One clean read
            replaces many brittle ones: less latency, fewer tokens, more reliable decisions.
          </p>
          <p>&nbsp;</p>
          <p>Open source, self-hostable, and built on a production streaming core.</p>
        </Copy>
        <Shot
          className="order-1 md:order-2"
          src="QbnjXbaRacmtUbQLtN9sy4wEKw.png"
          alt="GlassFlow Tares sources dashboard"
        />
      </div>
    </Shell>
  )
}

export function Rius() {
  return (
    <Shell inner="bg-panel">
      <TitleBar label="products" hideLabel />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* mobile: image first; tablet: text first; desktop: image left */}
        <Shot
          className="order-1 md:order-2 lg:order-1"
          src="RBpuXgGdzUNXmLFkFBttmTsnw.jpg"
          alt="GlassFlow Rius metrics dashboard"
        />
        <Copy
          className="order-2 md:order-1 lg:order-2"
          badge="GlassFlow Rius"
          title="Catch and debug agent failures in production."
          actions={
            <>
              <DarkButton
                label="get_started"
                href="https://console.rius-glassflow.com/signin?utm_source=glassflow&utm_medium=homepage&utm_campaign=signup&utm_content=core"
                withArrow
              />
              <DarkButton label="learn_more" href="https://rius.glassflow.ai/" bg="bg-panel" outlined />
            </>
          }
        >
          <p>
            Once agents are live, <a href="/rius" className="inline-link">GlassFlow Rius</a> tells you
            what they did, why they failed, and how quality is changing.{' '}
            <a href="/rius" className="inline-link">Rius</a> is built for any agent, running from short
            chat sessions to long-running agents that span across hours or days. <br />
            Live metrics on running agents (not just the completed minority), heartbeat detection that
            flags a frozen agent instead of hiding it, and bidirectional MCP so Claude Code, Cursor or
            ChatGPT Codex can query a failure and open a PR with the fix. <br />
            <br />
            Every trace kept as long as you need it, not capped at 30 days
          </p>
        </Copy>
      </div>
    </Shell>
  )
}
