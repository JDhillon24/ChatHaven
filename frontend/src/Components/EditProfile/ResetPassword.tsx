import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalBoilerplate from "../UI/ModalBoilerplate";
import { FaInfoCircle } from "react-icons/fa";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const ResetPassword: React.FC<ModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [currentPassView, setCurrentPassView] = useState(false);
  const [newPassView, setNewPassView] = useState(false);
  const [confirmPassView, setConfirmPassView] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axiosPrivate.put(
          "/user/updatepassword",
          JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          })
        );
        resetForm();
        onClose();
        navigate("/EditProfile", { state: { passSuccess: true } });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 400 &&
            error.response?.data.message === "Current password is incorrect"
          ) {
            formik.setFieldError(
              "currentPassword",
              error.response?.data.message
            );
          }
        }
      }
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Please choose a stronger password"
        ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
  });
  return (
    <ModalBoilerplate open={open} onClose={onClose}>
      <div className="w-full">
        <FaInfoCircle size={56} className="mx-auto text-ChatBlue" />
        <div className="flex justify-center">
          <p className="text-lg font-black text-gray-800">Reset Password</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-5 space-y-8 pb-10">
          <div className={`relative flex gap-2`}>
            <input
              type={!currentPassView ? "password" : "text"}
              className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
                formik.errors.currentPassword &&
                formik.touched.currentPassword &&
                formik.errors.currentPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
              name="currentPassword"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Current Password"
            />
            <span
              onClick={() => setCurrentPassView((prev) => !prev)}
              className="cursor-pointer translate-y-1/4"
            >
              {!currentPassView ? (
                <FaEye size={24} />
              ) : (
                <FaEyeSlash size={24} />
              )}
            </span>
            <label
              htmlFor="currentPassword"
              className={`absolute left-0 -top-3.5 ${
                formik.errors.currentPassword &&
                formik.touched.currentPassword &&
                formik.errors.currentPassword
                  ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                  : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
              }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
            >
              {formik.errors.currentPassword &&
              formik.touched.currentPassword &&
              formik.errors.currentPassword
                ? formik.errors.currentPassword &&
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                : "Current Password"}
            </label>
          </div>
          <div className={`relative flex gap-2`}>
            <input
              type={!newPassView ? "password" : "text"}
              className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
                formik.errors.newPassword &&
                formik.touched.newPassword &&
                formik.errors.newPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="New Password"
            />
            <span
              onClick={() => setNewPassView((prev) => !prev)}
              className="cursor-pointer translate-y-1/4"
            >
              {!newPassView ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
            </span>
            <label
              htmlFor="newPassword"
              className={`absolute left-0 -top-3.5 ${
                formik.errors.newPassword &&
                formik.touched.newPassword &&
                formik.errors.newPassword
                  ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                  : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
              }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
            >
              {formik.errors.newPassword &&
              formik.touched.newPassword &&
              formik.errors.newPassword
                ? formik.errors.newPassword &&
                  formik.touched.newPassword &&
                  formik.errors.newPassword
                : "New Password"}
            </label>
          </div>
          <div className={`relative flex gap-2`}>
            <input
              type={!confirmPassView ? "password" : "text"}
              className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
                formik.errors.confirmPassword &&
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm Password"
            />
            <span
              onClick={() => setConfirmPassView((prev) => !prev)}
              className="cursor-pointer translate-y-1/4"
            >
              {!confirmPassView ? (
                <FaEye size={24} />
              ) : (
                <FaEyeSlash size={24} />
              )}
            </span>
            <label
              htmlFor="confirmPassword"
              className={`absolute left-0 -top-3.5 ${
                formik.errors.confirmPassword &&
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword
                  ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                  : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
              }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
            >
              {formik.errors.confirmPassword &&
              formik.touched.confirmPassword &&
              formik.errors.confirmPassword
                ? formik.errors.confirmPassword &&
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                : "Confirm Password"}
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-ChatBlue rounded-full px-8 py-1 text-white transition-all duration-200 active:scale-90 active:bg-ChatBlueLight cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </ModalBoilerplate>
  );
};

export default ResetPassword;
