// T2 legal with TOC sidebar (/terms-of-service, /privacy-policy) and T3 single column (/imprint)
// (specs/landing.md T2, T3). Sections are the live headings with the spec's one-line summaries,
// not the legal text; each page ends with a link to the full original.
import { useEffect } from 'react'
import { Shell, Spacer } from '../components/ui.jsx'

const SECTION_H = 'font-inter text-[24px] leading-[28.8px] tracking-[-0.96px] text-[#FAFAFA]'
const BODY = 'font-inter text-[16px] font-light leading-[24px] tracking-[-0.32px] text-cream'

const TERMS = {
  path: '/terms-of-service',
  docTitle: 'GlassFlow | Terms & Conditions',
  meta: "GlassFlow's Terms & Conditions: the terms governing your use of our platform and services.",
  h1: 'Terms and conditions',
  tocHeader: 'Terms and Conditions',
  metaLines: [
    ['Version', '1.0'],
    ['Release Date', '09.09.2026'],
  ],
  // [toc label, anchor id, heading, summary]; the first is outside the numbered list on live
  lead: ['1. Introduction', 'introduction', '1. Introduction', "Glassflow GmbH's ToS govern the SaaS platform under German/EU law and GDPR, with a plain-language summary of the contract; self-serve checkout versus an enterprise Order Form."],
  sections: [
    ['2. Definitions', 'Definitions', 'Definitions', 'User, Consumer (§13 BGB), Business Customer, Client Data, Client Personal Data, and the other defined terms.'],
    ['3. Eligibility', 'Eligibility', 'Eligibility', 'Users must be 18+ or of legal majority.'],
    ['4. Service Access and Availability', 'Service Access and Availability', 'Service Access and Availability', 'Worldwide access with local variation; Free Tier terms; releases and updates of the Solution.'],
    ['5. Account Registration and Responsibilities', 'Account Registration and Responsibilities', 'Account Registration and Responsibilities', 'Accurate information and credential security.'],
    ['6. Subscription Plans and Payments', 'Subscription Plans and Payments', 'Subscription Plans and Payments', 'The in-product checkout is the Order Form; billing, renewals and fees.'],
    ['7. User Obligations', 'User Obligations', 'User Obligations', 'Lawful use, no misuse.'],
    ['8. Data Protection and Privacy', 'Data Protection and Privacy', 'Data Protection and Privacy', 'GDPR processing and the DPA.'],
    ['9. Intellectual Property', 'Intellectual Property', 'Intellectual Property', 'Glassflow keeps its IP; the client owns its data.'],
    ['10. Service Levels (Custom Only)', 'service-levels-', 'Service Levels (Custom Only)', 'SLAs apply only to enterprise / Order Form clients.'],
    ['11. Liability Limitation', 'Liability Limitation', 'Liability Limitation', 'Governed by §§309/310 BGB; consumer statutory rights are preserved.'],
    ['12. Right of Withdrawal (Consumers Only)', 'right-of-withdrawal', 'Right of Withdrawal (Consumers Only)', '14-day withdrawal.'],
    ['13. Termination and Data Retrieval', 'Termination and Data Retrieval', 'Termination and Data Retrieval', 'Ending the contract and exporting data.'],
    ['14. Dispute Resolution', 'Dispute Resolution', 'Dispute Resolution', 'Governing law and venue.'],
    ['15. Force Majeure', 'Force Majeure', 'Force Majeure', ''],
    ['16. Modifications to Terms', 'Modifications to Terms', 'Modifications to Terms', "30 days' notice; you can leave with a refund."],
  ],
  closing: (
    <em>
      For any questions or concerns, please email <strong className="font-normal">help@glassflow.ai</strong>
    </em>
  ),
}

const PRIVACY = {
  path: '/privacy-policy',
  docTitle: 'GlassFlow | Privacy Policy',
  meta: 'Learn how GlassFlow protects your privacy and keeps your data secure.',
  h1: 'Privacy Policy',
  tocHeader: 'Table of contents',
  intro: "This privacy notice for GlassFlow GmbH ('we', 'us', or 'our'), describes how and why we might collect, store, use, and/or share…",
  lead: [null, 'Summary of key points', 'Summary of key points', 'A bullet summary of the notice, with links to the sections.'],
  // TOC entries as live (5 missing, 8 points at the wrong anchor); body sections 1-15
  toc: [
    ['1. What information do we collect?', 'What information do we collect?'],
    ['2. How do we process your information', 'How do we process your information?'],
    ['3. What legal bases do we rely on to process your information?', 'What legal bases do we rely on to process your information?'],
    ['4. When and with whom do we share your personal information?', 'When and with whom do we share your personal information?'],
    ['6. How do we handle your social logins?', 'How do we handle your social logins?'],
    ['7. How long do we keep your information?', 'How long do we keep your information?'],
    ['8. How do we keep your information safe?', 'How long do we keep your information?'],
    ['9. Do we collect information from minors?', 'Do we collect information from minors?'],
    ['10. What are your privacy rights?', 'What are your privacy rights?'],
    ['11. Controls for do-not-track features', 'Controls for Do-Not-Track Features'],
    ['12. Do United States residents have specific privacy rights?', 'Do United States residents have specific privacy rights?'],
    ['13. Do we make updates to this notice?', 'Do we make updates to this notice?'],
    ['14. How can you contact us about this notice?', 'How can you contact us about this notice?'],
    ['15. How can you review, update, or delete the data we collect from you?', 'how-can-you-review-update-or-delete-the-data-we-collect-from-you'],
  ],
  sections: [
    [null, 'What information do we collect?', 'What information do we collect?', 'Data you provide, plus product telemetry.'],
    [null, 'How do we process your information?', 'How do we process your information?', 'To provide and improve the services, communicate, for security and for legal compliance.'],
    [null, 'What legal bases do we rely on to process your information?', 'What legal bases do we rely on to process your information?', 'GDPR / UK bases (consent, contract, legal obligation, legitimate interests) and Canada.'],
    [null, 'When and with whom do we share your personal information?', 'When and with whom do we share your personal information?', 'Business transfers and service providers.'],
    [null, 'Do we use cookies and other tracking technologies?', 'Do we use cookies and other tracking technologies?', 'Cookies and trackers.'],
    [null, 'How do we handle your social logins?', 'How do we handle your social logins?', 'Data received from social providers.'],
    [null, 'How long do we keep your information?', 'How long do we keep your information?', 'Retention as long as necessary.'],
    [null, 'How do we keep your information safe?', 'How do we keep your information safe?', 'Organisational and technical measures.'],
    [null, 'Do we collect information from minors?', 'Do we collect information from minors?', 'No under-18s.'],
    [null, 'What are your privacy rights?', 'What are your privacy rights?', 'EEA / UK / CH / CA rights, withdrawing consent, account information.'],
    [null, 'Controls for Do-Not-Track Features', 'Controls for Do-Not-Track Features', 'DNT signals are not honoured (there is no standard).'],
    [
      null,
      'Do United States residents have specific privacy rights?',
      'Do United States residents have specific privacy rights?',
      'California, Colorado and Virginia.',
      [
        'What categories of personal information do we collect?',
        'Category Examples Collected',
        'How do we use and share your personal information?',
        'Will your information be shared with anyone else?',
        'CCPA Privacy Notice',
        'Right to request deletion of the data - Request to delete',
      ],
    ],
    [null, 'Do we make updates to this notice?', 'Do we make updates to this notice?', 'The notice is updated as needed.'],
    [null, 'How can you contact us about this notice?', 'How can you contact us about this notice?', 'Contact details.'],
    [null, 'how-can-you-review-update-or-delete-the-data-we-collect-from-you', 'How can you review, update, or delete the data we collect from you?', 'The data-subject request process.'],
  ],
}

function FullLink({ path }) {
  return (
    <p className={BODY}>
      <a href={`https://www.glassflow.ai${path}`} className="text-amber underline">
        Read the full text on glassflow.ai
      </a>
    </p>
  )
}

function Toc({ doc }) {
  const items = doc.toc || [[doc.lead[0], doc.lead[1]], ...doc.sections.map(([label, id]) => [label, id])]
  return (
    <aside className="hidden w-[306px] shrink-0 flex-col shadow-[inset_-1px_0_0_theme(colors.line)] lg:flex">
      <div className="line-b h-[65px] px-4 py-6 font-mono text-[14px] font-bold leading-[16.8px] text-cream">{doc.tocHeader}</div>
      <div className="line-b h-[49px] bg-cream p-4 font-mono text-[14px] font-bold leading-[16.8px] text-deep">Summary of key points</div>
      {items
        .filter(([label]) => label)
        .map(([label, id]) => (
          <a
            key={label}
            href={`${doc.path}#${encodeURIComponent(id)}`}
            className="line-b p-4 font-mono text-[14px] leading-[16.8px] text-[rgba(242,240,225,0.8)] transition-colors duration-[400ms] ease-[var(--ease-spring-b02-d04)] hover:text-cream motion-reduce:transition-none"
          >
            <strong className="font-bold">{label}</strong>
          </a>
        ))}
    </aside>
  )
}

function Section({ id, heading, summary, subs, inShort, num }) {
  return (
    <div id={id} className="flex flex-col gap-6">
      <h1 className={SECTION_H}>
        {num != null && (
          <span className="absolute left-0 whitespace-nowrap" aria-hidden="true">
            {num}.
          </span>
        )}
        {heading}
      </h1>
      {summary && (
        <p className={BODY}>
          {inShort && <strong className="font-normal">In Short: </strong>}
          {summary}
        </p>
      )}
      {subs?.map((s) => (
        <h2 key={s} className="font-inter text-[20px] leading-[24px] tracking-[-0.8px] text-[#FAFAFA]">
          {s}
        </h2>
      ))}
    </div>
  )
}

function LegalDoc({ doc }) {
  useEffect(() => {
    document.title = doc.docTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', doc.meta)
  }, [doc])
  const [, leadId, leadHeading, leadSummary] = doc.lead
  return (
    <>
      <Shell inner="flex">
        <Toc doc={doc} />
        <div className="flex flex-1 justify-center px-8 pb-16 pt-16 lg:px-0">
          <article className="flex w-full max-w-[620px] flex-col gap-16">
            <header className="flex flex-col gap-6">
              <h1 className="font-inter text-[46px] leading-[55.2px] tracking-[-1.84px] text-[#FAFAFA]">{doc.h1}</h1>
              {doc.metaLines && (
                <div className="font-inter text-[16px] leading-[24px] tracking-[-0.32px] text-cream">
                  {doc.metaLines.map(([k, v]) => (
                    <p key={k}>
                      <strong className="font-normal">{k}</strong> {v}
                    </p>
                  ))}
                </div>
              )}
              {doc.intro && <p className={BODY}>{doc.intro}</p>}
            </header>
            <Section id={leadId} heading={leadHeading} summary={leadSummary} />
            {/* real <h1>s in a numbered <ol> as on live; numbers sit at the column edge, items 1-9 indented 30px, 10+ 45px */}
            <ol className="flex list-none flex-col gap-16" start={doc.toc ? 1 : 2}>
              {doc.sections.map(([, id, heading, summary, subs], i) => {
                const num = i + (doc.toc ? 1 : 2)
                return (
                  <li key={id + heading} className={`relative ${num < 10 ? 'pl-[30px]' : 'pl-[45px]'}`}>
                    <Section id={id} heading={heading} summary={summary} subs={subs} inShort={!!doc.toc} num={num} />
                  </li>
                )
              })}
            </ol>
            <div className="flex flex-col gap-6">
              {doc.closing && <p className={BODY}>{doc.closing}</p>}
              <FullLink path={doc.path} />
            </div>
          </article>
        </div>
      </Shell>
      <Spacer />
    </>
  )
}

export function Terms() {
  return <LegalDoc doc={TERMS} />
}

export function Privacy() {
  return <LegalDoc doc={PRIVACY} />
}

const IMPRINT = [
  [
    'Information according to §5 TMG (Telemedia Act)',
    [
      ['GlassFlow GmbH, Prinzessinnenstraße 19/20, 10969 Berlin'],
      ['VAT ID: DE361405627', 'Tax number: 37/308/50336'],
      ['Represented by Armend Avdijaj and Ashish Bagri'],
      [
        <>
          E-mail: <a href="mailto:info@glassflow.dev">info@glassflow.dev</a>
        </>,
      ],
    ],
  ],
  [
    'Further Information',
    [
      ['§2 Service Information Regulation; German law applies, venue Berlin.'],
      [
        <>
          EU online dispute resolution platform: <a href="http://ec.europa.eu/odr">http://ec.europa.eu/odr</a>
        </>,
      ],
    ],
  ],
  ['Liability', [['Responsibility for own content under the Telemedia Act; external links.']]],
  ['Copyright Notice', [['Site content is protected; no unauthorised use.']]],
]

export function Imprint() {
  useEffect(() => {
    document.title = 'Imprint | GlassFlow'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Legal notice for GlassFlow, including company details, registered address, management and contact information as required under German law (§5 DDG).',
      )
  }, [])
  const body = 'font-inter text-[16px] font-light leading-[24px] tracking-[-0.32px] text-[#FAFAFA]'
  return (
    <>
      <Shell inner="flex justify-center px-8 pb-16 pt-16 lg:px-0">
        <article className="flex w-full max-w-[620px] flex-col gap-8">
          <h1 className="font-inter text-[46px] leading-[55.2px] tracking-[-1.84px] text-[#FAFAFA]">Imprint</h1>
          {IMPRINT.map(([h, blocks]) => (
            <section key={h} className="flex flex-col gap-7">
              <h2 className="font-inter text-[20px] leading-[28px] tracking-[-0.8px] text-white">{h}</h2>
              <div className="flex flex-col gap-8">
                {blocks.map((lines, i) => (
                  <div key={i} className={body}>
                    {lines.map((l, j) => (
                      <p key={j}>{l}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
          <p className={body}>
            <a href="https://www.glassflow.ai/imprint" className="text-amber underline">
              Read the full text on glassflow.ai
            </a>
          </p>
        </article>
      </Shell>
      <Spacer />
    </>
  )
}
