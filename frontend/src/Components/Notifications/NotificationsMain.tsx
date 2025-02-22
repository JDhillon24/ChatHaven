import { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { RxCross1 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";
import useSocket from "../../hooks/useSocket";
import { SocketContext } from "../../context/SocketProvider";

type ResponseData = {
  type: "friend_request" | "accept_request";
  sender: { _id: string; name: string; profilePicture: string };
  createdAt: string;
};

type ResponseDataGroup = {
  type: "group_invite";
  sender: { _id: string; name: string; profilePicture: string };
  room: { _id: string; name: string };
  createdAt: string;
};

function isResponseDataGroup(
  data: ResponseData | ResponseDataGroup
): data is ResponseDataGroup {
  return (data as ResponseDataGroup).room !== null;
}

const NotificationsMain = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<(ResponseData | ResponseDataGroup)[]>([]);
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("SocketContext must be used within a provider!");
  }

  const { notifications, setNotifications } = socketContext;

  useEffect(() => {
    try {
      const getData = async () => {
        const response = await axiosPrivate.get("/notifications/getall");
        console.log(response.data);
        setNotifications(response.data);
      };

      getData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDeclineRequest = async (friend_id: string): Promise<void> => {
    try {
      const response = await axiosPrivate.post(
        "/notifications/declinefriendrequest",
        JSON.stringify({
          senderId: friend_id,
        })
      );

      setNotifications((prev) =>
        prev.filter(
          (noti) =>
            !(noti.type === "friend_request" && noti.sender._id === friend_id)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRequest = async (friend_id: string): Promise<void> => {
    try {
      const response = await axiosPrivate.post(
        "/notifications/acceptfriendrequest",
        JSON.stringify({
          senderId: friend_id,
        })
      );

      setNotifications((prev) =>
        prev.filter(
          (noti) =>
            !(noti.type === "friend_request" && noti.sender._id === friend_id)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full">
      <div className="h-20 flex border-b-2 border-gray-200">
        <div className="lg:w-2/3 w-11/12 mx-auto flex justify-between items-center">
          <p className="text-xl font-semibold">Notifications</p>
          <div className="rounded-full bg-ChatBlue flex justify-center items-center px-4 py-2 text-white cursor-pointer transition-all duration-200 active:scale-90 active:bg-ChatBlueLight">
            Clear
          </div>
        </div>
      </div>
      <div className="mt-3 px-4 lg:w-2/3 w-full mx-auto">
        <div className="mt-3 w-full max-h-[calc(100vh-146px)] overflow-auto pb-3">
          {notifications.length === 0 ? (
            <div className="w-full flex justify-center items-center">
              <p className="text-lg text-gray-400 text-center">
                No Notifications
              </p>
            </div>
          ) : (
            data &&
            notifications.map((item, index) =>
              isResponseDataGroup(item) ? (
                <div
                  key={index}
                  className="flex justify-between items-center hover:bg-gray-100 p-3 rounded-xl cursor-pointer shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                      <img
                        className="rounded-xl"
                        src={item.sender.profilePicture}
                        alt="Profile"
                      />
                    </div>
                    <p className="ml-4 lg:text-lg text-xs font-semibold">
                      {item.sender.name} has added you to{" "}
                      <b>{item.room?.name}</b>
                    </p>
                  </div>
                </div>
              ) : item.type === "friend_request" ? (
                <div
                  key={index}
                  className="flex justify-between items-center hover:bg-gray-100 p-3 rounded-xl cursor-pointer shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                      <img
                        className="rounded-xl"
                        src={item.sender.profilePicture}
                        alt="Profile"
                      />
                    </div>
                    <p className="ml-4 lg:text-lg text-xs font-semibold">
                      {`${item.sender.name} has sent you a friend request`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div
                      onClick={() => handleAcceptRequest(item.sender._id)}
                      className="h-8 w-8 rounded-full bg-green-500 flex justify-center items-center text-white cursor-pointer hover:bg-green-400"
                    >
                      <FaCheck size={16} />
                    </div>
                    <div
                      onClick={() => handleDeclineRequest(item.sender._id)}
                      className="h-8 w-8 rounded-full bg-red-500 flex justify-center items-center text-white cursor-pointer hover:bg-red-400"
                    >
                      <RxCross1 size={20} />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex justify-between items-center hover:bg-gray-100 p-3 rounded-xl cursor-pointer shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                      <img
                        className="rounded-xl"
                        src={item.sender.profilePicture}
                        alt="Profile"
                      />
                    </div>
                    <p className="ml-4 lg:text-lg text-xs font-semibold">
                      {`${item.sender.name} has accepted your friend request!`}
                    </p>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsMain;
