import { useState, useEffect } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type UserType = {
  _id: string;
  name: string;
  profilePicture: string;
};

type Props = {
  onClose: () => void;
  handleSuccess: () => void;
  participants: UserType[] | undefined;
};

type Form = {
  participants: string[];
};
const InviteMembers: React.FC<Props> = ({
  onClose,
  handleSuccess,
  participants,
}) => {
  const [potentialParticipants, setPotentialParticipants] = useState<
    UserType[]
  >([]);
  const location = useLocation();
  const { roomId } = location.state || {
    roomId: localStorage.getItem("roomId"),
  };
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosPrivate.get("/user/friends");
        const filteredParticipants = response.data.filter(
          (p: UserType) => !participants?.some((pa) => pa._id === p._id)
        );

        setPotentialParticipants(filteredParticipants);
      } catch (error) {
        console.error(error);
      }
    };

    if (participants) {
      getData();
    }
  }, [participants, roomId]);

  const formik = useFormik<Form>({
    initialValues: {
      participants: [],
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (roomId) {
          const response = await axiosPrivate.post(
            `/chat/newinvites/${roomId}`,
            JSON.stringify({
              participants: values.participants,
            })
          );
          resetForm();
          onClose();
          handleSuccess();
        }
      } catch (error) {
        console.error(error);
      }
    },
    validationSchema: Yup.object().shape({
      participants: Yup.array().min(1, "Please select at least one user"),
    }),
  });
  return (
    <div>
      <div className="flex justify-center">
        <p className="text-md font-black text-gray-800">Add Users</p>
      </div>
      <div
        className={`${
          potentialParticipants.length === 0 ? "" : "hidden"
        } flex justify-center items-center`}
      >
        <p className="text-gray-400 text-lg font-light">
          All your friends are here! Add more to keep the conversation going!
        </p>
      </div>
      <div
        className={`${
          potentialParticipants.length === 0 ? "hidden" : ""
        } flex flex-col justify-center`}
      >
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            className="w-full pb-10 space-y-8"
          >
            <div>
              <div className="flex flex-col justify-center">
                <div className="mt-1 text-red-500 text-sm">
                  {formik.errors.participants &&
                    formik.touched.participants &&
                    formik.errors.participants}
                </div>
                <div className="mt-3">
                  <FieldArray name="participants">
                    {({ remove, push }) => (
                      <div className="h-72 overflow-y-auto">
                        {potentialParticipants.map((item) => {
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
                    Add Users
                  </button>
                </div>
              </div>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default InviteMembers;
