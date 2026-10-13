import Hero from '../components/Hero.jsx'
import Testimonial from '../components/Testimonial.jsx'
import { Tares, Rius } from '../components/Product.jsx'
import Quickstart from '../components/Quickstart.jsx'
import Faq from '../components/Faq.jsx'
import { Spacer } from '../components/ui.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Testimonial />
      <Spacer />
      <Tares />
      <Spacer />
      <Rius />
      <Spacer />
      <Quickstart />
      <Spacer />
      <Faq />
    </>
  )
}
