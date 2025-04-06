import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../api/axios";
import { AxiosError } from "axios";

type FormProps = {
  onOpenSuccess: () => void;
};

const ForgotPasswordForm: React.FC<FormProps> = ({ onOpenSuccess }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = axios.post(
          "/user/forgotpassword",
          JSON.stringify({
            email: values.email,
          })
        );
        resetForm();
        onOpenSuccess();
      } catch (error) {
        // console.error(error);
        resetForm();
        onOpenSuccess();
      }
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
    }),
  });

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
        <div className="flex justify-center">
          <button
            type="submit"
            className="cursor-pointer w-full transition-all duration-200 active:scale-90 active:bg-ChatBlueLight text-white font-bold py-2 px-4 rounded-full bg-ChatBlue"
          >
            Send reset link
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
