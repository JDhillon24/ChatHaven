import { HiDotsVertical } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";

type InfoProps = {
  onBack: () => void;
};

const Info: React.FC<InfoProps> = ({ onBack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative h-full w-full">
      <div className="h-20 flex justify-between items-center border-b-2 border-gray-200">
        <p className="text-xl font-semibold ml-8">Info</p>
        <div
          ref={menuRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-8 w-8 mr-8 rounded-full bg-ChatBlue flex justify-center items-center text-white cursor-pointer hover:bg-ChatBlueLight"
        >
          <HiDotsVertical size={20} />
        </div>
        {isOpen && (
          <div className="absolute top-14 right-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
            <ul className="py-1 text-sm text-gray-700">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Add Member
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Leave Room
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 ml-4">
            <p className="text-sm font-semibold">Room Members</p>
            <p className="text-sm font-semibold py-1 px-2 rounded-xl bg-gray-200">
              2
            </p>
          </div>
          <div className="mt-3 ml-5 mr-5 flex flex-col">
            <div className="flex gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-100">
              <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                <img
                  className="rounded-xl"
                  src="/images/pfp/cool-anime-pfp-07.jpg"
                  alt="Profile"
                />
              </div>
              <p className="text-md font-semibold">Roronoa Zoro</p>
            </div>
            <div className="flex gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-100">
              <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                <img
                  className="rounded-xl"
                  src="/images/pfp/cool-anime-pfp-30.jpg"
                  alt="Profile"
                />
              </div>
              <p className="text-md font-semibold">Jotaro Kujo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
