import AboutBottomSection from '../components/AboutBottomSection/AboutBottomSection'
import AboutUsGreenBanner from '../components/AboutUsGreenBanner/AboutUsGreenBanner'
import AboutUsTopBanner from '../components/AboutUsTopBanner/AboutUsTopBanner'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import KeyVerticals from '../components/KeyVerticals/KeyVerticals'
import MissionVision from '../components/MissionVision/MissionVision'
import OurFounder from '../components/OurFounder/OurFounder'
import OurTeam from '../components/OurTeam/OurTeam'
import PicklebayInIndia from '../components/PicklebayInIndia/PicklebayInIndia'
import PicklebayInTheNews from '../components/PicklebayInTheNews/PicklebayInTheNews'

const AboutUs = () => {

  return (
    <div className='bg-f2f2f2 w-full'>
        <div className='max-w-[720px] mx-auto'>
            <AboutUsTopBanner />
            <MissionVision />
            <AboutUsGreenBanner />
            <HowItWorks />
            <OurFounder />
            <OurTeam />
            <KeyVerticals/>
            <PicklebayInIndia/>
            <PicklebayInTheNews/>
            <AboutBottomSection/>
        </div>
    </div>
  )
}

export default AboutUs