import { useNavigate } from 'react-router';

/* eslint-disable react/prop-types */
const ErrorState = ({ message = 'No tournament found', redirectionPath = '' }) => {
  const navigate = useNavigate();

  if (redirectionPath) {
    setTimeout(() => {
      navigate(redirectionPath)
    }, 200);
  }

  return (
    <main className="w-full mx-auto bg-ffffff">
      <div className="max-w-[720px] mx-auto relative">
        <div className="w-full bg-white relative h-[60vh] flex flex-row items-center justify-center">
          <p className="font-general text-xl capitalize font-medium text-383838 opacity-70">{message}</p>
        </div>
      </div>
    </main>
  );
};

export default ErrorState;
