// Route table for every page in the original's sitemap other than "/".
// Pages are added here as they are built; unbuilt paths fall through to <Pending />.
// `bare: true` routes render their own legacy chrome: App hides the global Navbar and Footer.
import { Navigate } from 'react-router-dom'
import Tares from './pages/Tares.jsx'
import Rius from './pages/Rius.jsx'
import RiusPricing from './pages/RiusPricing.jsx'
import Alternatives from './pages/Alternatives.jsx'
import Calculator from './pages/Calculator.jsx'
import BlogIndex from './pages/BlogIndex.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Category from './pages/Category.jsx'
import { CaseStudiesIndex, CaseStudy } from './pages/CaseStudies.jsx'
import About from './pages/About.jsx'
import Contact, { ContactSuccess } from './pages/Contact.jsx'
import { Terms, Privacy, Imprint } from './pages/Legal.jsx'
import Guide from './pages/Guide.jsx'

export const ROUTES = [
  { path: '/tares', element: <Tares /> },
  { path: '/rius', element: <Rius /> },
  { path: '/rius/pricing', element: <RiusPricing /> },
  { path: '/rius/alternatives/arize', element: <Alternatives key="arize" vendor="arize" /> },
  { path: '/rius/alternatives/langfuse', element: <Alternatives key="langfuse" vendor="langfuse" /> },
  { path: '/rius/calculator-building-your-own-agent-observability', element: <Calculator /> },
  { path: '/product', element: <Navigate to="/" replace /> },
  { path: '/integrations', element: <Navigate to="/" replace /> },
  { path: '/proof-of-concept', element: <Navigate to="/" replace /> },
  { path: '/enterprise', element: <Navigate to="/rius/pricing" replace /> },
  { path: '/blog', element: <BlogIndex /> },
  { path: '/case-studies', element: <CaseStudiesIndex /> },
  { path: '/case-studies/nubrain', element: <CaseStudy key="nubrain" slug="nubrain" /> },
  { path: '/case-studies/restack', element: <CaseStudy key="restack" slug="restack" /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/contact/success', element: <ContactSuccess /> },
  { path: '/terms-of-service', element: <Terms /> },
  { path: '/privacy-policy', element: <Privacy /> },
  { path: '/imprint', element: <Imprint /> },
  { path: '/kafka-to-clickhouse-pipeline-guide', element: <Guide key="kafka" which="kafka" />, bare: true },
  { path: '/clickhouse-mistakes-guide', element: <Guide key="mistakes" which="mistakes" />, bare: true },
  { path: '/newsletter', element: <Navigate to="/blog" replace /> },
  { path: '/categories/comparisons', element: <Navigate to="/blog" replace /> },
  { path: '/categories/engineering', element: <Navigate to="/blog" replace /> },
  { path: '/kafka-to-clickhouse-connector', element: <Navigate to="/blog" replace /> },
  { path: '/cookie-policy', element: <Navigate to="/privacy-policy" replace /> },
  { path: '/imprint-old', element: <Navigate to="/imprint" replace /> },
  { path: '/use-cases/real-time-observability-pipelines', element: <Navigate to="/case-studies" replace /> },
  { path: '/clickstack', element: <Navigate to="/blog/open-source-observability-clickstack-glassflow" replace /> },
  { path: '/joins', element: <Navigate to="/blog/clickhouse-joins" replace /> },
  { path: '/replacingmergetree-alternative', element: <Navigate to="/blog/part-3-clickhouse-replacingmergetree-materialized-views-not-enough" replace /> },
  { path: '/vector-dev-alternative', element: <Navigate to="/blog/when-vector-becomes-your-streaming-engine" replace /> },
  { path: '/blog/:slug', element: <BlogPost /> },
  { path: '/categories/:slug', element: <Category />, bare: true },
]
