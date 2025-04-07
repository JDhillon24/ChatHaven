import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { AxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import ModalBoilerplate from "../UI/ModalBoilerplate";
import { FaInfoCircle } from "react-icons/fa";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const ChangeUsername: React.FC<ModalProps> = ({ open, onClose }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      name: auth.user?.name,
    },
    onSubmit: async (values) => {
      try {
        await axiosPrivate.put(
          "/user/changeusername",
          JSON.stringify({
            newName: values.name,
          })
        );
        onClose();
        navigate("/EditProfile", { state: { nameSuccess: true } });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 409 &&
            error.response?.data.message === "Username is already taken"
          ) {
            formik.setFieldError("name", error.response.data.message);
          }
        }
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Username is required"),
    }),
  });
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="w-full">
        <FaInfoCircle size={56} className="mx-auto text-ChatBlue" />
        <div className="flex justify-center">
          <p className="text-lg font-black text-gray-800">Change Username</p>
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
              placeholder="Username"
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
                ? formik.errors.name &&
                  formik.touched.name &&
                  formik.errors.name
                : "Username"}
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
    </ModalBoilerplate>
  );
};

export default ChangeUsername;
