import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";
import { AxiosError } from "axios";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [passView, setPassView] = useState(false);
  const [confirmPassView, setConfirmPassView] = useState(false);

  const handleClick = () => {
    if (passView) {
      setPassView(false);
    } else {
      setPassView(true);
    }
  };

  const handleConfirmClick = () => {
    if (confirmPassView) {
      setConfirmPassView(false);
    } else {
      setConfirmPassView(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "/user/register",
          JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          })
        );

        resetForm();
        navigate("/Login");
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 409 &&
            error.response?.data.message === "This email is already in use!"
          ) {
            formik.setFieldError("email", error.response?.data.message);
          }

          if (
            error.response?.status === 409 &&
            error.response?.data.message === "This username is already taken!"
          ) {
            formik.setFieldError("name", error.response?.data.message);
          }
        }
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Username is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Please choose a stronger password"
        ),
      confirm_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
  });

  return (
    <div className="w-2/3 mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-8 pb-10">
        <div className="flex flex-col gap-10">
          <div className="relative">
            <input
              type="text"
              className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }  text-gray-900 focus:outline-none focus:border-ChatBlue`}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className={`absolute left-0 -top-3.5 ${
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
                  ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                  : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
              }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
            >
              {formik.errors.email &&
              formik.touched.email &&
              formik.errors.email
                ? formik.errors.email &&
                  formik.touched.email &&
                  formik.errors.email
                : "Email"}
            </label>
          </div>
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
              onClick={handleClick}
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
              onClick={handleConfirmClick}
              className="cursor-pointer translate-y-1/4"
            >
              {!confirmPassView ? (
                <FaEye size={24} />
              ) : (
                <FaEyeSlash size={24} />
              )}
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
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
