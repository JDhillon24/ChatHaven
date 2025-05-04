import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { FaMessage } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import MotionWrapper from "../MotionWrapper";
import Spinner from "../UI/Spinner";

type MainProps = {
  setAddFriends: () => void;
  handleRemoveClick: (friend: string) => void;
  open: boolean;
};

type ResponseData = {
  _id: string;
  name: string;
  profilePicture: string;
};

const FriendsMain: React.FC<MainProps> = ({
  setAddFriends,
  handleRemoveClick,
  open,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<ResponseData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //retrieves list of user's friends with an optional search parameter
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const searchParam = search.trim();
        const response = await axiosPrivate.get(
          `/user/friends?name=${searchParam}`
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      getData();
    }, 200);

    return () => clearTimeout(delay);
  }, [search, open]);

  //redirects to private chat with selected friend
  const handleMessageClick = async (id: string) => {
    try {
      //gets the room id of private chat and navigates to that room
      const response = await axiosPrivate.get(`/chat/messagefriend/${id}`);
      navigate("/Home", {
        state: { roomId: response.data.id, privateChat: true },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <MotionWrapper>
        <div className="h-20 flex border-b-2 border-gray-200">
          <div className="lg:w-2/3 w-full mx-auto flex justify-between items-center px-4">
            <p className="text-xl font-semibold">Friends</p>

            {/* Button to render add friends page */}
            <div
              onClick={setAddFriends}
              className="h-8 w-8 rounded-full bg-ChatBlue flex justify-center items-center text-white cursor-pointer hover:bg-ChatBlueLight"
            >
              <IoMdAdd size={20} />
            </div>
          </div>
        </div>
        <div className="mt-3 px-4 lg:w-2/3 w-full mx-auto">
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Friends"
              className="w-full px-2 h-10 rounded-lg bg-gray-200 border-none placeholder:text-sm placeholder:text-center"
            />
          </div>
          {/* List of friends with loading spinner, displays a message if user hasn't added any friends yet */}
          <div className="mt-3 w-full grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-3 max-h-[calc(100vh-146px)] overflow-auto pb-3">
            {data.length === 0 && !loading ? (
              <div className="w-full lg:col-span-3 flex justify-center items-center">
                <p className="text-lg text-gray-400 text-center">
                  No friends yet, start adding some to make connections!
                </p>
              </div>
            ) : loading ? (
              <div className="w-full lg:col-span-3 flex justify-center items-center">
                <Spinner />
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
                    <p className="ml-4 text-sm font-semibold">{item.name}</p>
                  </div>
                  {/* Message and delete buttons */}
                  <div className="flex gap-2">
                    <div
                      onClick={() => handleMessageClick(item._id)}
                      className="h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center text-ChatBlue cursor-pointer hover:bg-gray-300"
                    >
                      <FaMessage size={16} />
                    </div>
                    <div
                      onClick={() => handleRemoveClick(item._id)}
                      className="h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center text-red-500 cursor-pointer hover:bg-gray-300"
                    >
                      <RxCross1 size={20} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
};

export default FriendsMain;
