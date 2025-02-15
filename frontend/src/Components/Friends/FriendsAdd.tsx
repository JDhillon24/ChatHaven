import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { RxCross1 } from "react-icons/rx";

type FriendProps = {
  setAddFriends: () => void;
};
const FriendsAdd: React.FC<FriendProps> = ({ setAddFriends }) => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  return (
    <div className="w-full">
      <div className="h-20 flex border-b-2 border-gray-200">
        <div className="lg:w-2/3 w-full mx-auto flex justify-between items-center px-4">
          <p className="text-xl font-semibold">Add Friends</p>
          <div
            onClick={setAddFriends}
            className="h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center text-red-500 cursor-pointer hover:bg-gray-300"
          >
            <RxCross1 size={20} />
          </div>
        </div>
      </div>
      <div className="mt-3 px-4 lg:w-2/3 w-full mx-auto">
        <div>
          <input
            type="text"
            placeholder="Search Users"
            className="w-full h-10 rounded-lg bg-gray-200 border-none placeholder:text-sm placeholder:text-center"
          />
        </div>
        <div className="mt-3 w-full grid lg:grid-cols-3 grid-cols-1 gap-3 max-h-[calc(100vh-146px)] overflow-auto ">
          {Array.from({ length: 40 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-gray-100 p-3 rounded-xl cursor-pointer shadow-lg"
            >
              <div className="flex items-center">
                <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                  <img
                    className="rounded-xl"
                    src="/images/pfp/cool-anime-pfp-07.jpg"
                    alt="Profile"
                  />
                </div>
                <p className="ml-4 lg:text-lg text-md font-semibold">
                  Roronoa Zoro
                </p>
              </div>
              <div className="flex ">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center text-ChatBlue cursor-pointer hover:bg-gray-300">
                  <IoMdAdd size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsAdd;
