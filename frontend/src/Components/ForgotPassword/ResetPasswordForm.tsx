import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";

type FormProps = {
  onOpenError: () => void;
};

const ResetPasswordForm: React.FC<FormProps> = ({ onOpenError }) => {
  const navigate = useNavigate();

  // reset token from params in url
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  // state variable for showing and hiding passwords
  const [passView, setPassView] = useState(false);
  const [confirmPassView, setConfirmPassView] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.patch(
          `/user/resetpassword/${resetToken}`,
          JSON.stringify({
            newPassword: values.password,
            confirmPassword: values.confirm_password,
          })
        );

        // navigates to login with a success modal pop up
        resetForm();
        navigate("/Login", { state: { passwordReset: true } });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }

        // opens error modal if the token is missing or invalid
        resetForm();
        onOpenError();
      }
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Please choose a stronger password"
        ),
      confirm_password: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
  });
  return (
    <div className="w-2/3 mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-8 pb-10">
        <div className={`relative flex gap-2`}>
          <input
            type={!passView ? "password" : "text"}
            className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
              formik.errors.password &&
              formik.touched.password &&
              formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Password"
          />
          <span
            onClick={() => setPassView((prev) => !prev)}
            className="cursor-pointer translate-y-1/4"
          >
            {!passView ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
          </span>
          <label
            htmlFor="password"
            className={`absolute left-0 -top-3.5 ${
              formik.errors.password &&
              formik.touched.password &&
              formik.errors.password
                ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
            }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
          >
            {formik.errors.password &&
            formik.touched.password &&
            formik.errors.password
              ? formik.errors.password &&
                formik.touched.password &&
                formik.errors.password
              : "Password"}
          </label>
        </div>
        <div className={`relative flex gap-2`}>
          <input
            type={!confirmPassView ? "password" : "text"}
            className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
              formik.errors.confirm_password &&
              formik.touched.confirm_password &&
              formik.errors.confirm_password
                ? "border-red-500"
                : "border-gray-300"
            }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
            name="confirm_password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm Password"
          />
          <span
            onClick={() => setConfirmPassView((prev) => !prev)}
            className="cursor-pointer translate-y-1/4"
          >
            {!confirmPassView ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
          </span>
          <label
            htmlFor="confirm_password"
            className={`absolute left-0 -top-3.5 ${
              formik.errors.confirm_password &&
              formik.touched.confirm_password &&
              formik.errors.confirm_password
                ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
            }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
          >
            {formik.errors.confirm_password &&
            formik.touched.confirm_password &&
            formik.errors.confirm_password
              ? formik.errors.confirm_password &&
                formik.touched.confirm_password &&
                formik.errors.confirm_password
              : "Confirm Password"}
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="cursor-pointer w-full transition-all duration-200 active:scale-90 active:bg-ChatBlueLight text-white font-bold py-2 px-4 rounded-full bg-ChatBlue"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
