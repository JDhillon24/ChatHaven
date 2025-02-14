import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";
import { AxiosError } from "axios";

const LoginForm = () => {
  const { auth, setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();

  const [passView, setPassView] = useState(false);

  const handleClick = () => {
    if (passView) {
      setPassView(false);
    } else {
      setPassView(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      persist: false,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "/user/login",
          JSON.stringify({
            email: values.email,
            password: values.password,
          })
        );

        setAuth({
          isAuthenticated: true,
          user: {
            name: response.data.name,
            email: response.data.email,
            profilePicture: response.data.profilePicture,
            accessToken: response.data.accessToken,
          },
        });
        resetForm();
        navigate("/Home");
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            formik.setFieldError("password", "Incorrect password");
          }
        } else {
          console.log(error);
        }
      }
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
      password: Yup.string().required("Password is required"),
    }),
  });

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return (
    <div className="w-2/3 mx-auto flex flex-col">
      <form onSubmit={formik.handleSubmit} className="space-y-8 pb-10">
        <div className="relative">
          <input
            type="text"
            className={`peer h-10 w-full border-0 border-b-2 placeholder-transparent ${
              formik.errors.email && formik.touched.email && formik.errors.email
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
              formik.errors.email && formik.touched.email && formik.errors.email
                ? "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
                : "text-gray-600 peer-focus:text-gray-600 peer-placeholder-shown:text-gray-400"
            }  text-sm transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:cursor-default peer-placeholder-shown:cursor-text pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-2`}
          >
            {formik.errors.email && formik.touched.email && formik.errors.email
              ? formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
              : "Email"}
          </label>
        </div>
        <div className="relative">
          <div
            className={`flex gap-2 ${
              formik.errors.password &&
              formik.touched.password &&
              formik.errors.password === "Incorrect password"
                ? "animate-[shake_0.5s_ease-in-out]"
                : ""
            } `}
          >
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
          <div className="mt-3 w-full flex items-center">
            <div className="w-full">
              <div className="form-control flex justify-start items-start">
                <label htmlFor="persist" className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="persist"
                    checked={persist}
                    onChange={togglePersist}
                    onBlur={formik.handleBlur}
                    className="w-3 h-3"
                  />
                  <span className="label-text text-xs">Trust This Device</span>
                </label>
              </div>
            </div>
            <div className="w-full cursor-pointer flex justify-end">
              <p className="text-xs text-gray-600 hover:underline">
                Forgot password?
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="cursor-pointer w-full transition-all duration-200 active:scale-90 active:bg-ChatBlueLight text-white font-bold py-2 px-4 rounded-full bg-ChatBlue"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
