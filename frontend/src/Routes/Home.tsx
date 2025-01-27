import React from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const Home = () => {
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    window.location.reload();
  };
  const { auth } = useAuth();
  return (
    <div>
      {JSON.stringify(auth)}
      <div className="flex justify-center">
        <button
          onClick={signOut}
          className="bg-red-500 rounded-full py-2 px-4 text-white hover:bg-red-400 cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Home;
