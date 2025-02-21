import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { RxCross1 } from "react-icons/rx";
import SuccessModal from "../UI/SuccessModal";

type FriendProps = {
  setAddFriends: () => void;
  open: boolean;
  onOpen: () => void;
};

type ResponseData = {
  _id: string;
  name: string;
  profilePicture: string;
};
const FriendsAdd: React.FC<FriendProps> = ({ setAddFriends, open, onOpen }) => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<ResponseData[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const searchParam = search.trim();
        const response = await axiosPrivate.get(
          `/user/search?name=${searchParam}`
        );
        // console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const delay = setTimeout(() => {
      getData();
    }, 200);

    return () => clearTimeout(delay);
  }, [search, open]);

  const handleSendRequest = async (friend_id: string): Promise<void> => {
    try {
      const response = await axiosPrivate.post(
        "/notifications/sendfriendrequest",
        JSON.stringify({
          receiverId: friend_id,
        })
      );
      onOpen();
    } catch (error) {
      console.error(error);
    }
  };
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Users"
            className="w-full px-2 h-10 rounded-lg bg-gray-200 border-none placeholder:text-sm placeholder:text-center"
          />
        </div>
        <div className="mt-3 w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 max-h-[calc(100vh-146px)] overflow-auto pb-3">
          {data.length === 0 ? (
            <div className="w-full lg:col-span-3 md:col-span-2 flex justify-center items-center">
              <p className="text-lg text-gray-400 text-center">
                Find and connect with friends to make chatting even better!
              </p>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center hover:bg-gray-100 p-3 rounded-xl cursor-pointer shadow-lg"
              >
                <div className="flex items-center">
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                    <img
                      className="rounded-xl"
                      src={item.profilePicture}
                      alt="Profile"
                    />
                  </div>
                  <p className="ml-4 lg:text-lg text-md font-semibold">
                    {item.name}
                  </p>
                </div>
                <div className="flex">
                  <div
                    onClick={() => handleSendRequest(item._id)}
                    className="h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center text-ChatBlue cursor-pointer hover:bg-gray-300"
                  >
                    <IoMdAdd size={20} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsAdd;
