import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";
import { AxiosError } from "axios";

const LoginForm = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [passView, setPassView] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
            accessToken: response.data.accessToken,
          },
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            formik.setFieldError("email", "Incorrect email/password");
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

  return <div>LoginForm</div>;
};

export default LoginForm;
