import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type Props = {
  onClose: () => void;
  handleSuccess: () => void;
  roomName: string | undefined;
};

const EditName: React.FC<Props> = ({ onClose, handleSuccess, roomName }) => {
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const { roomId } = location.state || {
    roomId: localStorage.getItem("roomId"),
  };

  const formik = useFormik({
    initialValues: {
      name: roomName,
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (roomId) {
          const response = await axiosPrivate.put(
            `/chat/changename/${roomId}`,
            JSON.stringify({
              newName: values.name,
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
    validationSchema: Yup.object({
      name: Yup.string().required("Room Name is required"),
    }),
  });

  return (
    <div>
      <div className="flex justify-center">
        <p className="text-md font-black text-gray-800">Change Room Name</p>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="mt-5 flex flex-col space-y-8"
      >
        <div className="relative">
          <input
            type="text"
            className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
              formik.errors.name && formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "border-gray-300"
            }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Room Name"
          />
          <label
            htmlFor="name"
            className={`absolute left-0 -top-3.5 ${
              formik.errors.name && formik.touched.name && formik.errors.name
                ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
            }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
          >
            {formik.errors.name && formik.touched.name && formik.errors.name
              ? formik.errors.name && formik.touched.name && formik.errors.name
              : "Room Name"}
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="font-semibold bg-ChatBlue rounded-full px-8 py-1 text-white transition-all duration-200 active:scale-90 active:bg-ChatBlueLight cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditName;
