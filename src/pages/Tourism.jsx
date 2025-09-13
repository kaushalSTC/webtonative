import { useRef } from 'react';
import TourismForm from '../components/TourismForm/TourismForm';
import TourismInsta from '../components/TourismInsta/TourismInsta';
import TourismMediaGallery from '../components/TourismMediaGallery/TourismMediaGallery';
import TourismPackage from '../components/TourismPackage/TourismPackage';
import TourismTopBanner from '../components/TourismTopBanner/TourismTopBanner';

const Tourism = () => {
  const formRef = useRef(null);

  return (
    <div className='bg-f2f2f2'>
      <TourismTopBanner />
      <TourismPackage scrollToForm={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <TourismMediaGallery />
      <TourismInsta />
      <div ref={formRef}>
        <TourismForm />
      </div>
    </div>
  )
}

export default Tourism