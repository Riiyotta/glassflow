// /contact (specs/content.md §7) and /contact/success (§8).
// The form never submits to HubSpot or anywhere else: a short fake delay, then client-side navigation
// to /contact/success. With all of First/Last/E-Mail empty it shows the error state instead
// (stand-in for HubSpot rejecting the POST; live has no client-side validation).
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Quickstart from '../components/Quickstart.jsx'
import { LogoStrip } from '../components/Hero.jsx'
import { TwoProductsBand, DITHER_BG } from '../components/ContentSections.jsx'
import { A, SVG, Shell, Spacer, TitleBar, Dots } from '../components/ui.jsx'

const CT = (f) => A(`contact/${f}`)
const FAKE_DELAY = 900

const FIELD = 'w-full rounded-none border-0 bg-white px-4 text-[14px] text-deep placeholder:text-deep/[0.64] focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-line'
const LABEL = 'mb-[10px] block text-[14px] leading-[1.3] text-cream'

const TEXT_FIELDS = [
  ['firstname', 'gf-firstname', 'First Name', 'text', 'e.g. John'],
  ['lastname', 'gf-lastname', 'Last Name', 'text', 'e.g. Doe'],
  ['email', 'gf-email', 'E-Mail', 'email', 'e.g. john@example.com'],
]
const SOLUTIONS = [
  ['Tares', 'GlassFlow Tares'],
  ['Rius', 'GlassFlow Rius'],
]

// pixel tick inside the 20px radio box (glyph not captured on live; drawn from the check-24 tick)
function Tick() {
  return (
    <svg viewBox="5 6 14 12" className="h-3 w-[14px]" aria-hidden="true">
      <path d="M10.5 16.5H9V15h1.5zM9 15H7.5v-1.5H9zM12 13.5V15h-1.5v-1.5zM7.5 13.5H6V12h1.5zM13.5 13.5H12V12h1.5zM15 12h-1.5v-1.5H15zM16.5 10.5H15V9h1.5zM18 9h-1.5V7.5H18z" fill="#492400" />
    </svg>
  )
}

function ContactForm() {
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [solution, setSolution] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setSending(true)
    setError('')
    setTimeout(() => {
      setSending(false)
      if (!['firstname', 'lastname', 'email'].some((k) => String(data.get(k) || '').trim())) {
        setError('Something went wrong')
        return
      }
      navigate('/contact/success')
    }, FAKE_DELAY)
  }

  return (
    <form noValidate onSubmit={onSubmit} className="w-full font-mono text-[14px]">
      <div className="flex flex-col gap-4">
        {TEXT_FIELDS.map(([name, id, label, type, ph]) => (
          <div key={name}>
            <label htmlFor={id} className={LABEL}>
              {label}
            </label>
            <input id={id} name={name} type={type} placeholder={ph} required className={`h-[43px] ${FIELD}`} />
          </div>
        ))}
        <fieldset>
          <legend className={LABEL}>Which GlassFlow Solution are you interested in?</legend>
          <div className="flex gap-2">
            {SOLUTIONS.map(([label, value]) => {
              const on = solution === value
              return (
                <label
                  key={value}
                  className={`inline-flex h-[34px] cursor-pointer items-center gap-2 border px-2 py-[6px] text-[14px] leading-none has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-amber ${
                    on ? 'border-amber bg-amber text-page' : 'border-line bg-deep text-cream'
                  }`}
                >
                  <input
                    type="radio"
                    name="which_glassflow_solution_are_you_interested_in"
                    value={value}
                    checked={on}
                    onChange={() => setSolution(value)}
                    className="sr-only"
                  />
                  <span className={`flex h-5 w-5 items-center justify-center border ${on ? 'border-page' : 'border-line'}`}>
                    <span className={on ? 'block' : 'invisible'}>
                      <Tick />
                    </span>
                  </span>
                  {label}
                </label>
              )
            })}
          </div>
        </fieldset>
        <div>
          <label htmlFor="gf-message" className={LABEL}>
            Message
          </label>
          {/* live textarea is inline: 4px baseline gap below it */}
          <textarea
            id="gf-message"
            name="message"
            placeholder="Your message..."
            className={`${FIELD} mb-1 block h-[139px] resize-none px-4 py-[14px] leading-[1.5]`}
          />
        </div>
      </div>
      <div className="mt-4 flex h-[52px]">
        <button
          type="submit"
          disabled={sending}
          className="gf-submit flex-1 bg-amber text-[14px] leading-[normal] text-deep shadow-[inset_0_0_0_4px_#FFAC00,inset_0_0_0_5px_#5F3E1F] disabled:opacity-60"
        >
          <span className="opacity-90">{sending ? 'sending' : 'submit'}</span>
        </button>
        <span
          aria-hidden="true"
          className={`flex h-[52px] w-[52px] items-center justify-center bg-amber shadow-[inset_0_0_0_4px_#FFAC00,inset_0_0_0_5px_#5F3E1F] ${sending ? 'opacity-60' : ''}`}
        >
          <img src={SVG('arrow')} alt="" className="h-[14px] w-4" />
        </span>
      </div>
      {error && (
        <div role="alert" className="mt-3 text-[12px] text-line">
          {error}
        </div>
      )}
    </form>
  )
}

function Founders() {
  const people = [
    ['WAFKEfbmGfI9qoFOrWqjmuTXaA.png', 'Armend Avdijaj', 'Founder & CEO'],
    ['XBoPSI1HguCHrjBDJQJk79wM7oU.png', 'Ashish Bagri', 'Founder & CTO'],
  ]
  return (
    <div className="grid w-full max-w-[800px] grid-cols-2">
      {people.map(([img, name, role]) => (
        <div key={name} className="flex h-14 items-center gap-2 bg-deep p-1">
          <img src={CT(img)} alt={name} className="h-12 w-12 object-cover" />
          <div className="flex min-w-0 flex-col gap-[2px] whitespace-nowrap font-mono text-[14px] font-bold leading-[18.2px]">
            <span className="text-cream">{name}</span>
            <span className="text-cream-64">{role}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Calendar() {
  return (
    <Quickstart
      id="calendar"
      heading={
        <>
          Stuck on something?
          <br />
          Let&apos;s talk.
        </>
      }
      sub={["Sometimes the docs don't cut it. That's what the founder's calendar is for. Grab 30 minutes below."]}
    >
      <div className="flex w-full flex-col items-center">
        {/* live: 42px bar flush with the frame, then a 4px-padded 560px box around the 552px embed */}
        <div className="flex w-full max-w-[800px] flex-col">
          <div className="hairline relative flex h-[42px] items-center justify-center bg-bar">
            <Dots className="absolute left-[14px] top-[18px]" />
            {/* live desktop label box sits 7.5px left of centre */}
            <span className="t-mono text-cream-64 lg:-translate-x-[7.5px]">calendar-app</span>
          </div>
          <div className="bg-panel p-1">
            <iframe
              title="Book an intro call with the founders"
              src="https://app.cal.com/armend-glassflow/engineering-intro-call-with-founder/embed?layout=month_view"
              loading="lazy"
              className="block h-[552px] w-full border-0 bg-white"
            />
          </div>
        </div>
        <Founders />
      </div>
    </Quickstart>
  )
}

// Left hero panel shared by /contact and /contact/success: dithered image with centred text, then extras.
// pad: live /contact steps 32/40/64 by breakpoint; /contact/success keeps 64 everywhere.
function SignalPanel({ imageH, pad = 'p-8 md:p-10 lg:p-16', children, below }) {
  return (
    <div className="flex flex-col bg-bar">
      <div className={`relative flex flex-col items-center justify-center gap-16 overflow-hidden text-center ${pad} ${imageH}`}>
        <img src={DITHER_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* live copy column is a fixed 408px, centred and allowed to overflow the clipped panel on phones */}
        <div className="relative flex w-[408px] shrink-0 flex-col items-center gap-3">{children}</div>
      </div>
      {below}
    </div>
  )
}

export default function Contact() {
  useEffect(() => {
    document.title = 'GlassFlow | Contact'
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <Shell as="section">
        <TitleBar label="" />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <SignalPanel imageH="lg:h-[564px]" below={<LogoStrip inPanel />}>
            <h1 className="font-display text-[48px] leading-[48px] text-amber">
              Send us
              <br />a signal
            </h1>
            <div className="font-display text-[21px] leading-[31.5px] tracking-[-0.18px] text-cream">
              <p className="md:hidden">Four plans, priced per trace, not per seat. Start free, pay for what you actually send.</p>
              {/* live: one paragraph with <br>s and an empty line before the last sentence (5 x 31.5px) */}
              <p className="hidden md:block">
                Two products, one platform.
                <br />
                Feed your agents the right data with Tares, see what they did in production with Rius.
                <br />
                <br />
                Tell us what you&apos;re building.
              </p>
            </div>
          </SignalPanel>
          <div className="bg-deep md:p-6 lg:p-10">
            <div className="bg-panel p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </Shell>
      <Spacer />
      <Calendar />
      <Spacer />
      <TwoProductsBand variant="pages" />
    </>
  )
}

const NEXT = [
  ['Tares on GitHub ↗', 'https://github.com/glassflow/tares', 'Open source. Feed your agents the right data clone it, run it, drop a star.'],
  ['Read the Blog', '/blog', 'How we think about agent observability and long-running agents.'],
  // no href on live
  ['Rius guides ↗', null, 'Wire up traces, MCP, and retention: from first span to production.'],
]

export function ContactSuccess() {
  useEffect(() => {
    document.title = 'AI Agent Observability & Data Infrastructure | GlassFlow'
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <Shell as="section">
        <TitleBar label="" />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <SignalPanel
            imageH="h-[367px] md:h-[417px]"
            pad="p-16"
            below={
              <div className="flex flex-col">
                {NEXT.map(([title, href, text]) => {
                  const Tag = href ? 'a' : 'div'
                  return (
                    <Tag key={title} href={href || undefined} className="hairline flex min-h-[71px] items-center gap-3 px-8 py-4">
                      <img src={SVG('check-24')} alt="" className="h-6 w-6 shrink-0" />
                      <span className="flex flex-col gap-1">
                        <span className="t-mono text-cream">{title}</span>
                        <span className="font-display text-[14px] leading-[16.8px] text-cream">{text}</span>
                      </span>
                    </Tag>
                  )
                })}
              </div>
            }
          >
            <h1 className="font-display text-[48px] leading-[48px] text-cream">Thanks for reaching out!</h1>
            <p className="t-lead">We&apos;ve got your message. One of our engineers or founders will get back to you shortly.</p>
            <p className="t-lead">In the meantime, here&apos;s where to poke around:</p>
          </SignalPanel>
          {/* live shows the photo column on desktop only */}
          <div className="relative hidden h-[630px] p-10 lg:block">
            <img src={CT('rEJrzUhJOm30gvdjvFesntLyB0k.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </Shell>
    </>
  )
}
