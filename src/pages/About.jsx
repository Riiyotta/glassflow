// /about (specs/content.md §6). The story paragraphs are the spec's three-point outline, not the live prose.
import { useEffect } from 'react'
import AppearText from '../components/AppearText.jsx'
import Quickstart from '../components/Quickstart.jsx'
import { TEXT_EFFECT } from '../components/motion.js'
import TextRollButton from '../components/TextRollButton.jsx'
import { TitleRow } from '../components/ProductSections.jsx'
import { HeroBar, PixelCorner, TwoProductsBand, POST_BG, FRAME_BG, DITHER_BG } from '../components/ContentSections.jsx'
import { A, Shell, Spacer, TitleBar, Dots } from '../components/ui.jsx'

const AB = (f) => A(`about/${f}`)

const VALUES = [
  {
    icon: 'value-simplicity.svg',
    title: 'Simplicity',
    text: 'We believe in making the complex simple. GlassFlow allows engineers to focus on innovation without being bogged down by unnecessary setup or management of data pipelines.',
  },
  {
    icon: 'value-empowerment.svg',
    title: 'Empowerment',
    text: 'GlassFlow is built to empower data engineers and teams to maximize productivity and creativity. We remove technical barriers so that you can focus on developing impactful solutions.',
  },
  {
    icon: 'value-curiosity.svg',
    title: 'Curiosity',
    text: 'In an ever-changing environment, a curious mindset drives us to ask the right questions, explore possibilities, and uncover creative solutions. We are committed to stay curious',
  },
]

// [name, role, photo, photo link, small LinkedIn button link] (live CMS mistakes kept: content-assets.md §2 /about)
const TEAM = [
  ['Armend Avdijaj', 'Founder & CEO', 'EUGyjKzZWaJSrr2zu5746RGlI.png', 'https://www.linkedin.com/in/armend-avdijaj/'],
  ['Vladimir Cutkovic', 'Senior Frontend Engineer', 'a8QrifheqiMQU26hAsZjchuotX4.jpg', 'https://www.linkedin.com/in/vladimir-cutkovic/'],
  ['Kiran Nambiar', 'Senior Backend Engineer', '0Wpq0XXDfDAIb0DiPfPgV2vRRA.png', 'https://www.linkedin.com/company/glassflow-dev', 'https://docs.glassflow.ai/rius/quickstart'],
  ['Petr Nuzhnov', 'Senior Backend Engineer', '8zc9wR0jTofmXo1i8oAe7Xd2MU.png', 'https://www.linkedin.com/in/petrnuzhnov/'],
  ['Meryem Cebeci', 'Project Manager', 'd65NdlroOMtoScH1A8upPTXb8.png', 'https://www.linkedin.com/in/meryem-cebeci-ba52a661/'],
  ['Pablo Pardo Garcia', 'Senior Solution Engineer', 'lpha0IhXSFfoekFa6Hf7oo59g.png', 'https://www.linkedin.com/in/pablo-pardo-garcia/'],
  ['Benjamin Gorski', 'Head of Operations', 'XMHbUNPYeGTlBu1aUXVMArMHbU.png', 'https://www.linkedin.com/in/ben-gorski/'],
  ['Ayaan Islam', 'Accounting & Finance Associate', 'pD35PRSoov4c8UIATVFvGxLrlaM.png', 'https://www.linkedin.com/in/mohammed-ayaan-islam-262989294/'],
  ['Ashish Bagri', 'Founder & CTO', 'DB3bD8VT0ZS16UjkMaAxJLygnY.png', 'https://www.linkedin.com/in/ashishbagri/'],
  ['Markos Sfikas', 'Marketing Lead', 'rtXd2ytZLtaZn27qCwW8CWuEq8U.png', 'https://www.linkedin.com/in/msfikas/'],
  ['Bahareh Darbandi', 'Senior Backend Engineer', 'R7aawS3JnIfXekAPqaHQj2vuM.jpg', 'https://www.linkedin.com/in/bahareh-darbandi/', 'https://www.linkedin.com/in/msfikas/'],
]

const INVESTORS = [
  ['Kevin Zhang', 'Partner at Upfront Ventures', 'JiliIFrGIyU4RGZuTxKeYxh7DQ.png', '4oleiMNaudwxchFVqLImKac0auc.png'],
  ['Martin Möllmann', 'Investor at High-Tech Gründerfonds', 'FoPBrtleqX1ce176xv0YS3j4W0.png', 'CXst4OR2O985lBTM5ibgX12Wtc.png'],
  ['Philipp Moehring', 'Partner at TSIC', '3AGKfdRAKG1v7ccDw0V3EaHWm0.png', '3Cm6ni1BPkx8Q0JymitfQUCCs4.png'],
  ['Robin Haak', 'Partner at Robin Capital', 'uS1znUn97WlyMoFXWFtPGIshyk.png', 'fMBTWzeitdWxIwFBV36LRI5qdo.png'],
  ['Serhii Sokolenko', 'Ex-Snowflake', 'QMtkvlVkrYiybq2CSUSFXF3rJMA.png', 'SjaPDSaCHajUqC3XdU84pW8EOW0.png'],
  ['Kamil Mieczakowski', 'Partner at Notion Capital', 'tLR9h5tUzZiWHO0Los4w2tNstY.png', 'XGAAuzcsFEqYzM3j1LJqYitOak0.png'],
  ['Andrew Tymovskyi', 'Investor at Roosh Ventures', 'H8QJsfhu37466mTH0WMnuNqTeI8.png', '85wU63KCXc4893uYwwvfQ8gxTC0.png'],
  ['Thomas Dohmke', 'CEO at GitHub', 'iUIlmZAduir00xwi2SMlqcX69Jo.png', '2Mw17NBfyrGzcOTrPhI5bl4EyM.png'],
  ['Andrei David', 'Scout at Atomico', 'D0XOroKd1s9H0nt07hqmPB3M.png', '3BqdtlasfD6uaBRyRf5LGk1YCgc.png'],
  ['Roland Fassauer', 'Partner at Fadelia', 'i3ukHgVFY4RTUzCy553BJsGeA.png', 'AiPN40AwXUL8x5AQ0d57nDE3tPY.png'],
  ['Heikki Nousiainen', 'CTO & Co-Founder at aiven', 'cPnCYoQZG8dkiKrpCZbqwqqgK4.png', 'TvUYeSYOO7LtUfaXjkdBmx3os80.png'],
  ['Andres Almansa', 'CEO at Restack', 'ZLIFSkJg706gnwxEV3MkJnOlumc.png', 'Tv7cEjjHcXj4nybHnFTOhLgBw.png'],
  ['Philippe Brule', 'CTO at Restack', 'oiZUe7HfFwDIXMbyfTuimI78PfU.png', 'Tv7cEjjHcXj4nybHnFTOhLgBw.png'],
  ['Jernej Strasner', 'VP Engineering at sentry.io', 'q2AicIpi7Llo1iuEx3aaQ4WBOMs.png', '2k0dUASyTHGBQoL3HA7TL0In8o.png'],
  ['Taimur Rashid', 'Founding AWS sales manager', 'evSnrDo2QYBm78SDfy9ilzBeM3g.png', 'JGPPwh2QXVllCmQldWoIkZBkk.png'],
  ['Enrique Sarap', 'Scout at Sequoia', 'aDo9Hte9NPY53vETjexM8ycuSNM.png', '1K3G4ZQS8rc8i3JFwJcEHSU3vlc.png'],
  ['Eva Spannagl', 'Ex Moss Lead and scout', 'iWA3iPWbeWjyvypf5WdjlqWbG8.png', '1K3G4ZQS8rc8i3JFwJcEHSU3vlc.png'],
  ['Bob van Luijt', 'CEO at Weaviate', 'PstB3qULwi1EcrHHlNCciiYzw.png', 'JGPPwh2QXVllCmQldWoIkZBkk.png'],
  ['Keith Grose', 'Ex Plaid Lead and scout', '7PoRa0Kj0LTzOeqmff8RvcAYQo8.png', 'lxA3Al9BSGFk9PzPQIa0XzooVc.png'],
  ['Mark Maxwell', 'Ex dbt labs and fivetran', 'DDrzHAUMEGcpCT69X3IOvz0eU.png', 'zXa6f2hTb7YXrnlzJBdkJHF1yp8.png'],
  ['Navid Meyer', 'Investor at Lakestar', 'DSYCxCftRcSFmBTyGexvwoTbEk.png', 'mTjI1dfSM1JRjjY8y5D2zABVfo.png'],
]

const DISCOVER = [
  ['careers', 'gheBrKCK3Ciu5xEcHzMBCgSv3o.jpg', 'We are hiring people who want to shape the data streaming future with us.', 'https://join.com/companies/getglassflow'],
  ['blog', 'HzF3suL0qSMigUGajw02x3z6U98.jpg', 'Check the latest news, product updates and best practices.', '/blog'],
]

const P = 'font-inter text-[17px] leading-[23.8px] tracking-[-0.68px] text-white'

function Hero() {
  return (
    <Shell as="section">
      <HeroBar dotsRight />
      <div className="flex flex-col bg-deep lg:h-[557px] lg:flex-row">
        <div className="relative lg:w-[729px] lg:shrink-0">
          <img src={POST_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <PixelCorner />
          <div className="relative flex h-full flex-col justify-center gap-[15px] px-8 py-16">
            {/* Text effect on load (motion.js TEXT_EFFECT): H1 per word, 50ms stagger, y 10 -> 0;
                paragraphs per character, delay = line * 50ms, starting ~50ms after the H1. */}
            <AppearText
              as="h1"
              split="word"
              easing={TEXT_EFFECT.easing}
              className="max-w-[665px] font-display text-[48px] leading-[48px] tracking-[-1.92px] text-cream"
            >
              Developing data infra products for AI agents
            </AppearText>
            <AppearText
              as="div"
              split="char"
              delay={50}
              lineStagger={TEXT_EFFECT.stagger}
              easing={TEXT_EFFECT.easing}
              className="flex max-w-[600px] flex-col gap-5"
            >
              <p className={P}>
                GlassFlow builds the infrastructure AI agents need in production. Agents are only as good as their data, and hard to debug once live.
              </p>
              <p className={P}>
                Two products: <a href="/tares" className="text-amber">Tares</a> feeds agents correlated real-time data;{' '}
                <a href="/rius" className="text-amber">Rius</a> is the observability layer showing what agents do and why they fail.
              </p>
              <p className={P}>The team has built systems at scale at Google, Uber, SumUp, Avira and Mister Spex.</p>
              <p className={P}>
                <a href="https://www.glassflow.ai/about" data-appear="block" className="text-amber underline">
                  Read the full story on glassflow.ai
                </a>
              </p>
            </AppearText>
          </div>
        </div>
        <div className="relative h-[557px] lg:h-auto lg:flex-1">
          <img src={FRAME_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <img src={AB('z5vl4a9tCeiczbox4Aqgzy11Dk.png')} alt="The GlassFlow team" className="relative h-full w-full object-cover" />
        </div>
      </div>
    </Shell>
  )
}

function Values() {
  return (
    <Shell as="section">
      <TitleBar label="" dotsRight />
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="relative flex h-[273px] flex-col items-center overflow-hidden bg-bar p-8 text-center lg:h-[350px] lg:px-6 lg:py-16">
            <img src={DITHER_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <img src={AB(v.icon)} alt="" className="relative h-16 w-16" />
            <div className="relative mt-6 flex flex-col items-center gap-2">
              <h3 className="font-mono text-[18px] font-bold leading-[18.2px] text-cream">{v.title}</h3>
              <p className="max-w-[389px] font-display text-[18px] leading-[27px] tracking-[-0.18px] text-cream">{v.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  )
}

function Team() {
  return (
    <section>
      <TitleRow title="Meet our team" height="h-[168px]" titleClass="text-[40px] leading-[40px]" />
      <Shell inner="grid grid-cols-2 md:gap-1 md:p-1 lg:grid-cols-3">
        {TEAM.map(([name, role, photo, link, btn]) => (
          <div key={name} className="flex min-w-0 flex-col bg-deep">
            <div className="hairline flex h-[38px] items-center bg-deep px-4">
              <Dots tone="page" />
            </div>
            <a href={link} className="block h-[150px] lg:h-[300px]">
              <img src={AB(photo)} alt={name} loading="lazy" className="h-full w-full object-cover" />
            </a>
            <div className="flex h-14 items-stretch">
              <div className="hairline flex min-w-0 flex-1 flex-col justify-center gap-1 py-2 pl-3 pr-2">
                <span className="truncate font-mono text-[14px] font-bold leading-[18.2px] text-amber">{name}</span>
                <span className="truncate font-mono text-[14px] font-bold leading-[18.2px] text-cream">{role}</span>
              </div>
              <a href={btn || link} aria-label={`${name} on LinkedIn`} className="hairline flex w-14 shrink-0 items-center justify-center">
                <img src={AB('linkedin-20.svg')} alt="" className="h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </Shell>
    </section>
  )
}

function Discover() {
  return (
    <Quickstart heading="Discover more" sub={[]} id="discover-more">
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:justify-center">
        {DISCOVER.map(([label, img, text, href]) => (
          <div key={label} className="flex w-full flex-col md:w-[490px]">
            <div className="hairline relative flex h-[42px] items-center justify-center bg-bar">
              <Dots className="absolute left-[14px] top-[18px]" />
              <span className="t-mono text-cream-64">{label}</span>
            </div>
            <img src={AB(img)} alt="" className="h-[280px] w-full object-cover" />
            <div className="hairline flex h-[118px] items-center justify-center bg-panel p-4">
              <h3 className="max-w-[320px] text-center font-inter text-[24px] font-medium leading-[28.8px] tracking-[-0.96px] text-white">{text}</h3>
            </div>
            {/* static on the live site (no hover motion) */}
            <TextRollButton href={href} trigger="none" label="find out more" frame="hairline bg-deep" fill="hairline bg-panel text-cream" />
          </div>
        ))}
      </div>
    </Quickstart>
  )
}

function Investors() {
  return (
    <section>
      <TitleRow title="Backed by the best" height="h-[168px]" titleClass="text-[40px] leading-[40px]" />
      <Shell inner="grid grid-cols-3 md:gap-5 md:p-5 lg:grid-cols-5">
        {INVESTORS.map(([name, firm, photo, badge]) => (
          <div key={name} className="flex min-w-0 flex-col items-center gap-4 text-center">
            <div className="relative aspect-square w-full">
              <img src={AB(photo)} alt={name} loading="lazy" className="h-full w-full object-cover" />
              <img src={AB(badge)} alt="" loading="lazy" className="absolute bottom-[3px] right-1 h-8 w-8 object-cover" />
            </div>
            <div className="flex flex-col gap-px">
              <span className="font-mono text-[13px] font-bold leading-[18.2px] text-cream">{name}</span>
              <span className="font-mono text-[12px] font-bold leading-[14px] text-cream">{firm}</span>
            </div>
          </div>
        ))}
      </Shell>
    </section>
  )
}

export default function About() {
  useEffect(() => {
    document.title = 'About GlassFlow | Infrastructure for AI Agents'
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <Hero />
      <Spacer />
      <Values />
      <Spacer />
      <Team />
      <Spacer />
      <Discover />
      <Spacer />
      <Investors />
      <Spacer />
      <TwoProductsBand variant="pages" />
    </>
  )
}
