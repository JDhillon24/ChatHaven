import { IoMdAdd } from "react-icons/io";

const Conversations = () => {
  return (
    <div className="h-full w-full border-r-2 border-gray-200">
      <div className="h-24 flex justify-between items-center border-b-2 border-gray-200">
        <p className="text-xl font-semibold ml-8">Messages</p>
        <div className="h-8 w-8 mr-8 rounded-full bg-ChatBlue flex justify-center items-center text-white cursor-pointer hover:bg-ChatBlueLight">
          <IoMdAdd size={20} />
        </div>
      </div>
      <div className="mt-3 ml-8 mr-8">
        <input
          type="text"
          placeholder="Search Messages"
          className="w-full h-10 rounded-lg bg-gray-200 border-none placeholder:text-sm placeholder:text-center"
        />
        <div className="mt-3 flex-1 max-h-[calc(100vh-160px)] overflow-y-auto ">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between hover:bg-gray-100 p-3 rounded-xl cursor-pointer"
            >
              <div className="flex">
                <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                  <img
                    className="rounded-xl"
                    src="/images/pfp/cool-anime-pfp-07.jpg"
                    alt="Profile"
                  />
                </div>
                <div className="ml-4 flex flex-col">
                  <p className="text-sm font-semibold">Roronoa Zoro {index}</p>
                  <p className="text-xs font-light text-gray-400">
                    Lmaooo that's nuts
                  </p>
                </div>
              </div>
              <div className="flex">
                <p className="text-sm text-gray-400">12m</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
