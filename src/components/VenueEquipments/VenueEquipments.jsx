/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import { Balls, FirstAid, Paddles, Shoes } from '../../assets';

function VenueEquipments({ data }) {
  if (Array.isArray(data.data.equipments) && data.data.equipments.length === 0) return null;

  const Equipments = data?.data?.equipments;

  const equipmentIcons = {
    'Balls': Balls,
    'First Aid Box': FirstAid,
    'Shoes': Shoes,
    'Paddles': Paddles,
  };
  return (
    <div>
      <div className="w-full h-[10px] bg-f2f2f2 my-7 md:my-12"></div>
      <div className="px-[35px] md:px-12">
        <p className="font-medium font-general text-base text-1c0e0eb3 mb-5 md:mb-7 max-md:text-sm">Equipments</p>
        <div className="max-md:flex-col max-md:items-start w-full flex items-center flex-wrap">
          {Equipments.map((equipment, index) => {
            const Icon = equipmentIcons[equipment] || Paddles;
            return (
              <div key={nanoid()} className="shrink-0 grow-0 flex-auto w-1/2">
                <div className="flex items-center gap-5 mb-8">
                  <img src={Icon} alt="share-icon" className="w-5 h-5 mr-2 "/>
                  <p className="font-medium font-general text-base text-383838 max-md:text-sm">{equipment}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VenueEquipments;
