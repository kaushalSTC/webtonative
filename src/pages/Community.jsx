import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { CommunityPageImg } from "../assets";

const Community = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [communityUrl, setCommunityUrl] = useState(null);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("*");
      return;
    }

    const fetchCommunityAccess = async () => {
      try {
        console.log(import.meta.env.VITE_DEV_URL);
        console.log(import.meta.env.VITE_CIRCLE_OAUTH_CLIENT_ID);
        console.log(import.meta.env.VITE_CIRCLE_API_URL);

        const response = await fetch(
          `${import.meta.env.VITE_DEV_URL}/oauth/authorize?client_id=${
            import.meta.env.VITE_CIRCLE_OAUTH_CLIENT_ID
          }&redirect_uri=${
            import.meta.env.VITE_CIRCLE_API_URL
          }/oauth2/callback&response_type=code`,
          {
            method: "GET",
            credentials: "include", // sends cookies
            redirect: "follow", // allows following 302s
          }
        );

        const data = await response.json();

        if (data.status === "success" && data.data.redirect) {
          setCommunityUrl(data.data.redirectUrl);
        } else {
          setError("Unable to access community at this time.");
        }
      } catch (err) {
        console.log(err);
        setError("Something went wrong. Cannot access community.");
      }
    };

    fetchCommunityAccess();
  }, [auth.isLoggedIn]);

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  const handleOpenCommunity = () => {
    navigate('/');
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-center pt-[70px]">
        <div className="max-w-[150px] mb-5">
          <img src={CommunityPageImg} alt="community-icon" className="w-full h-auto object-cover" />
        </div>
        <p className="font-author font-medium text-383838 text-[34px] max-w-[289px] mb-2 text-center leading-none">Your Community Access is ready!</p>
        <p className="font-author font-medium text-383838 text-sm md:text-base max-w-[289px] mb-2 text-center">Become a part of the Picklebay community</p>
        <a
          href={communityUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpenCommunity}
          className="cursor-pointer font-general font-medium text-sm md:text-base bg-244cb4 rounded-[20px] py-2 px-5 text-center text-white inline-block"
        >
          Explore Now
        </a>
      </div>
    </div>
  );
};

export default Community;