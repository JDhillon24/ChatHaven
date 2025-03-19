import { useState, useEffect } from "react";
import ModalBoilerplate from "../UI/ModalBoilerplate";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onOpenSuccess: () => void;
};

type FriendData = {
  _id: string;
  name: string;
  profilePicture: string;
};

type Form = {
  name: string;
  participants: string[];
};

const CreateRoomModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onOpenSuccess,
}) => {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getData = async () => {
      const response = await axiosPrivate.get("/user/friends");
      setFriends(response.data);
    };

    if (open) {
      getData();
    }
  }, [open]);

  const formik = useFormik<Form>({
    initialValues: {
      name: "",
      participants: [],
    },
    onSubmit: async (values) => {
      try {
        console.log(values);
        const response = await axiosPrivate.post(
          "/chat/createroom",
          JSON.stringify({
            name: values.name,
            participants: values.participants,
          })
        );

        onClose();
        onOpenSuccess();
      } catch (error) {
        console.error(error);
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Room Name is required"),
      participants: Yup.array().min(1, "Please select at least one user"),
    }),
  });

  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="text-center w-56">
        <p className="text-lg font-black text-gray-800">Create New Room</p>
        <div className="mt-5 flex flex-col justify-center">
          <FormikProvider value={formik}>
            <form
              onSubmit={formik.handleSubmit}
              className="w-full pb-10 space-y-8"
            >
              <div className="relative">
                <input
                  type="text"
                  className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
                    formik.errors.name &&
                    formik.touched.name &&
                    formik.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Username"
                />
                <label
                  htmlFor="name"
                  className={`absolute left-0 -top-3.5 ${
                    formik.errors.name &&
                    formik.touched.name &&
                    formik.errors.name
                      ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                      : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
                  }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
                >
                  {formik.errors.name &&
                  formik.touched.name &&
                  formik.errors.name
                    ? formik.errors.name &&
                      formik.touched.name &&
                      formik.errors.name
                    : "Room Name"}
                </label>
              </div>
              <div>
                <div
                  className={`flex flex-col items-center justify-center ${
                    friends.length === 0 ? "" : "hidden"
                  }`}
                >
                  <p className="text-md font-light text-gray-400 text-center">
                    Add some friends first so you can start creating rooms and
                    chatting together!{" "}
                  </p>
                </div>
                <div
                  className={`flex flex-col justify-center ${
                    friends.length === 0 ? "hidden" : ""
                  }`}
                >
                  <p className="text-md font-black text-gray-800 text-center">
                    Add Friends
                  </p>
                  <div className="mt-1 text-red-500 text-sm">
                    {formik.errors.participants &&
                      formik.touched.participants &&
                      formik.errors.participants}
                  </div>
                  <div className="mt-3">
                    <FieldArray name="participants">
                      {({ remove, push }) => (
                        <div className="h-72 overflow-y-auto">
                          {friends.map((item) => {
                            const isChecked = formik.values.participants.some(
                              (i) => i === item._id
                            );

                            return (
                              <div key={item._id}>
                                <label className="cursor-pointer p-2 hover:shadow-xl flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    name="participants"
                                    value={item._id}
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        const idx =
                                          formik.values.participants.findIndex(
                                            (i) => i === item._id
                                          );
                                        remove(idx);
                                      } else {
                                        push(item._id);
                                      }

                                      formik.setFieldTouched(
                                        "participants",
                                        true,
                                        true
                                      );
                                    }}
                                  />
                                  <div className="flex gap-3">
                                    <div className="relative flex items-center justify-center h-12 w-12 rounded-xl">
                                      <img
                                        className="rounded-xl"
                                        src={item.profilePicture}
                                        alt="Profile"
                                      />
                                    </div>
                                  </div>
                                  <p className="text-md font-semibold">
                                    {item.name}
                                  </p>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="font-semibold bg-ChatBlue rounded-full px-8 py-1 text-white transition-all duration-200 active:scale-90 active:bg-ChatBlueLight cursor-pointer"
                    >
                      Create Room
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
    </ModalBoilerplate>
  );
};

export default CreateRoomModal;
