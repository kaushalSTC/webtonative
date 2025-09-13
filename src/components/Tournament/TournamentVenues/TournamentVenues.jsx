/* eslint-disable react/prop-types */
import { nanoid } from "nanoid";
import { ChevronIcon, Location, VenueImage } from "../../../assets";
import { Link } from "react-router-dom"; // Use Link for navigation

const TournamentVenues = ({ tournament }) => {
  const { categories } = tournament;
  if (categories.length <= 0) return null;

  const formatHandle = (handle) => {
    return handle
      .toLowerCase()
      .split(" ")
      .filter(Boolean) // Remove empty strings
      .join("-");
  };

  const categoryAddress = (categoryLocation) =>
    `${categoryLocation.address.line1 ?? ""}, ${categoryLocation.address.city ?? ""}, ${categoryLocation.address.state ?? ""}`.trim();

  const uniqueCheck = [];
  const formattedCategories = categories
    .map((category) => {
      if (category?.categoryLocation?.handle) {
        const address = categoryAddress(category.categoryLocation);
        if (!uniqueCheck.includes(address)) {
          uniqueCheck.push(address);
          return category.categoryLocation;
        }
      }
    })
    .filter((x) => x);

  return (
    <div className="w-full bg-white px-6 md:px-20 py-10 pb-8 gap-[18px] flex flex-col mt-[10px]">
      <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
        {formattedCategories.length > 1 ? "Venues" : "Venue"}
      </h2>
      <div className="flex flex-col justify-start items-start gap-2 w-full">
        {formattedCategories.length ? (
          formattedCategories.map((categoryLocation) => {
            const formattedHandle = formatHandle(categoryLocation.handle);

            return (
              <Link
                to={`/venues/${formattedHandle}`}
                key={nanoid()}
                className="w-full flex flex-row gap-2.5 md:gap-5 rounded-r-20 py-3 px-3 md:px-4 border border-f0f0f0 hover:shadow-xl"
                aria-label="Open Venue Details"
              >
                <img
                  src={categoryLocation.venueImage ? categoryLocation.venueImage : VenueImage}
                  alt="Venue Image"
                  className="w-full max-w-[76px] h-auto rounded-lg"
                />
                <div className="flex flex-col w-full gap-1">
                  <div className="flex flex-row w-full justify-between items-center">
                    <p className="font-general font-semibold text-size-18 text-383838 line-clamp-1">
                      {categoryLocation.name}
                    </p>
                    <img
                      src={ChevronIcon}
                      alt="Chevron-icon"
                      className="w-auto h-[7.5px]"
                    />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      src={Location}
                      alt="Location-icon"
                      className="w-auto h-4"
                    />
                    <p className="font-general font-medium text-sm text-383838 opacity-70 text-left line-clamp-1">
                      {categoryAddress(categoryLocation)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div
            className="w-full flex flex-row gap-2.5 md:gap-5 rounded-r-20 py-3 px-3 md:px-4 border border-f0f0f0 hover:shadow-xl"
            aria-label="Open Venue Details"
          >
            To be decided!
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentVenues;
