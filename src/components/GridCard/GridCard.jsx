import { GridCard as GridCardImage } from '../../assets';
import { NavLink } from 'react-router';

function GridCard() {
  return (
    <div>
      <NavLink to="/pages/contactUs" className="group relative">
        <img src={GridCardImage} alt="grid-card" className="w-full h-auto object-cover cursor-pointer " />
      </NavLink>
    </div>
  )
}

export default GridCard