/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import { ArtificialTurf, ChangingRoom, DrinkingWater, FloodLights, LockerRoom, Parking, RentalEquipment, SeatingLounge, Washroom } from '../../assets';

function VenueAmenities({ data }) {
  if (Array.isArray(data.data.amenities) && data.data.amenities.length === 0) return null;

  const Amenities = data?.data?.amenities;

  const amenityIcons = {
    'Drinking Water': DrinkingWater,
    'Locker Room': LockerRoom,
    'Parking': Parking,
    'Rental Equipment': RentalEquipment,
    'Seating Lounge': SeatingLounge,
    'Washroom': Washroom,
    'Artificial Turf': ArtificialTurf,
    'Flood Lights': FloodLights,
    'Changing Room': ChangingRoom,
  };

  return (
    <div>
      <div className="w-full h-[10px] bg-f2f2f2 my-7 md:my-12"></div>
      <div className="px-[35px] md:px-12">
        <p className="font-medium font-general text-base text-1c0e0eb3 mb-5 md:mb-7 max-md:text-sm">Amenities</p>
        <div className="max-md:flex-col max-md:items-start w-full flex items-center flex-wrap gap-y-10">
          {Amenities.map((amenity) => {
            const Icon = amenityIcons[amenity] || ArtificialTurf;
            return (
              <div key={nanoid()} className="shrink-0 grow-0 flex-auto w-1/2">
                <div className="flex items-center gap-5">
                  <img src={Icon} alt="share-icon" className="w-5 h-5 mr-2 "/>
                  <p className="font-medium font-general text-base text-383838 max-md:text-sm">{amenity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VenueAmenities;
