// T4 legacy gated-ebook pages (specs/landing.md T4): /kafka-to-clickhouse-pipeline-guide, /clickhouse-mistakes-guide.
// The HubSpot embed is rebuilt as a local form: it never submits anywhere; a short fake delay then the
// success state is shown in place.
import { useEffect, useState } from 'react'
import LegacyLayout, { L } from '../components/LegacyLayout.jsx'
import { GRADIENT_TEXT } from './Category.jsx'

const GUIDES = {
  kafka: {
    path: '/kafka-to-clickhouse-pipeline-guide',
    title: 'Kafka to ClickHouse: A Practical Guide to Data Pipelines | GlassFlow',
    meta: 'Master Kafka to ClickHouse data pipelines. Learn strategies for handling duplicates, late events, and JOINs with real-world examples. Download your free GlassFlow ebook.',
    pill: 'Free eBook',
    h1: 'A practical guide on how to build Kafka to ClickHouse pipelines',
    lead: (
      <>
        This ebook covers everything you need to know about building dependable <span className="text-white">Kafka → ClickHouse</span> pipelines.
      </>
    ),
    checklist: [
      'Walks you through building a reliable pipeline with strategies for handling duplicates, late events, and JOINs',
      'Gives real-world examples from finance, e-commerce, and observability',
      'Offers practical insights and best practices for both beginners and those looking to improve existing setups',
    ],
    fields: [
      ['firstname', 'First name', 'text', true],
      ['email', 'Email', 'email', true],
    ],
  },
  mistakes: {
    path: '/clickhouse-mistakes-guide',
    title: 'Free Guide: 10 Common ClickHouse Mistakes & How to Fix Them | GlassFlow',
    meta: 'Access the free practical guide covering the 10 most common ClickHouse mistakes in production: deduplication, schema design, sharding, materialized views, disaster recovery and more.',
    pill: 'Free Guide',
    h1: '10 ClickHouse Mistakes That Break Data Pipelines in Production',
    lead: 'This guide covers the 10 most common mistakes teams make when adopting ClickHouse, from the first week of setup to running it at scale in production. Each mistake includes what goes wrong, why it happens, and exactly how to fix it.',
    inside: true,
    checklist: [
      'Why deduplication in ClickHouse doesn’t work the way you expect and how to handle it before it corrupts your analytics',
      'When ClickHouse sharding helps and when it makes everything worse',
      'The disaster recovery gap most self-hosted ClickHouse teams discover too late',
    ],
    fields: [
      ['email', 'Email', 'email', true],
      ['firstname', 'First Name', 'text', false],
      ['lastname', 'Last Name', 'text', false],
    ],
  },
}

function GuideForm({ fields }) {
  const [state, setState] = useState('idle') // idle | sending | done
  if (state === 'done') {
    return (
      <p role="status" className="max-w-[480px] font-sys text-[16px] font-medium leading-[24px] text-white">
        Thanks for submitting the form.
      </p>
    )
  }
  return (
    <form
      className="flex w-full max-w-[480px] flex-col gap-2 md:flex-row md:flex-wrap md:items-end"
      onSubmit={(e) => {
        e.preventDefault()
        setState('sending')
        setTimeout(() => setState('done'), 800)
      }}
    >
      {fields.map(([name, label, type, required]) => (
        <label key={name} className="flex min-w-[150px] flex-1 flex-col gap-[6px]">
          <span className="font-sys text-[14px] font-medium leading-[20px] text-white">
            {label}
            {required && <span className="text-[#FF0000]">*</span>}
          </span>
          <input
            name={name}
            type={type}
            required={required}
            className="h-[43px] rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-6 font-sys text-[16px] text-white outline-none"
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="h-[43px] w-[134px] shrink-0 rounded-xl bg-white px-10 font-sys text-[16px] font-semibold text-black disabled:opacity-60"
      >
        Submit
      </button>
    </form>
  )
}

export default function Guide({ which }) {
  const g = GUIDES[which]
  useEffect(() => {
    document.title = g.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', g.meta)
  }, [g])
  const kafka = which === 'kafka'
  return (
    <LegacyLayout>
      <section className="relative overflow-hidden px-6 pb-64 pt-32 md:min-h-[1011px] md:pb-32">
        {kafka && (
          <img
            src={L('eMUNSXzDARdSsMat78pTslrdn4.png')}
            alt=""
            className="absolute left-1/2 top-[178px] hidden h-[833px] w-[1740px] max-w-none -translate-x-1/2 object-contain md:block"
          />
        )}
        <div
          className="absolute inset-0 bg-[linear-gradient(352deg,rgba(0,0,0,0)_19%,#000000_34%)] md:bg-[linear-gradient(270deg,rgba(0,0,0,0)_49%,#000000_100%)]"
          aria-hidden="true"
        />
        <img src={L('i7Uti49dVPGVtAs2iCwnJBnuWso.png')} alt="" className="absolute right-0 top-0 hidden h-[509px] w-[601px] object-cover md:block" />
        {!kafka && (
          <img
            src={L('4OxP9MgO3bmtsoyWUD8aGGIWXM.png')}
            alt=""
            className="absolute left-[calc(50%+144px)] top-[331px] hidden h-[604px] w-[905px] max-w-none object-cover lg:block"
          />
        )}
        <div className="relative mx-auto flex max-w-[1220px]">
          <div className="flex w-full max-w-[540px] flex-col gap-[33px]">
            <span className="self-start bg-amber px-[10px] py-[6px] font-inter text-[12px] font-medium uppercase leading-[12px] text-deep">
              {g.pill}
            </span>
            <h1 className={`font-inter text-[42px] font-medium leading-[50.4px] tracking-[-1.68px] ${GRADIENT_TEXT}`}>{g.h1}</h1>
            <p className="font-inter text-[18px] leading-[25.2px] tracking-[-0.8px] text-[#A8A3A3] md:text-[20px] md:leading-[28px]">{g.lead}</p>
            {g.inside && <strong className="font-inter text-[20px] font-bold leading-[28px] text-[#FCFAFA]">What’s inside:</strong>}
            <ul className="flex flex-col gap-3">
              {g.checklist.map((c) => (
                <li key={c} className="flex items-start gap-[10px]">
                  <img src={L('k68ifFtfMbT8As7lCeihZaxTO6w.png')} alt="" className="h-6 w-6 shrink-0" />
                  <span className="font-inter text-[16px] leading-[22.4px] tracking-[-0.72px] text-[#A8A3A3] md:text-[18px] md:leading-[25.2px]">{c}</span>
                </li>
              ))}
            </ul>
            <GuideForm fields={g.fields} />
            <a href={`https://www.glassflow.ai${g.path}`} className="font-inter text-[14px] leading-[20px] text-[#A8A3A3] underline">
              Read the full guide page on glassflow.ai
            </a>
          </div>
        </div>
        {/* mobile: the device visual sits below the form */}
        <img
          src={L(kafka ? 'eMUNSXzDARdSsMat78pTslrdn4.png' : '4OxP9MgO3bmtsoyWUD8aGGIWXM.png')}
          alt=""
          className="relative -mx-6 mt-10 h-[301px] w-[calc(100%+48px)] max-w-none object-contain md:hidden"
        />
      </section>
    </LegacyLayout>
  )
}
