import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../App.css";
import Layout from "../layout/layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";

const Register = () => {
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [MobileNo, SetMobileNo] = useState("");
  const [photo, SetPhoto] = useState("");
  const [country, setCountry] = useState(""); // Added country state
  const [region, setRegion] = useState(""); // Added region state
  const [Location, setLocation] = useState("");
  const navigate = useNavigate();
  const [Loading, SetLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const Setlocation = () => {
    setLocation(country + " " + region);
  };

  useEffect(() => {
    Setlocation();
  }, [region]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Email", Email);
      formData.append("Password", Password);
      formData.append("Location", Location);
      formData.append("photo", photo);
      formData.append("MobileNo", MobileNo);

      if (Password.length < 6) {
        toast.error("Password length must be more than 6");
        SetLoading(false);
        return;
      }
      const response = await fetch(
        "https://qviptaskbackend.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status === 201) {
        SetLoading(false);

        toast.success("Registration Successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.status === 409) {
        // User already exists
        SetLoading(false);
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      SetLoading(false);
      toast.error(error.message);
    }
  }
  return (
    <Layout>
      <form
        className="d-flex justify-content-center align-items-center FormBackgound"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="registerform ">
          <h1 style={{ margin: "0%" }}>Register</h1>

          <div className=" w-100">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="UserName"
              aria-describedby="emailHelp"
              value={Name}
              onChange={(e) => {
                SetName(e.target.value);
              }}
              required
            />
          </div>

          <div className=" w-100">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Email"
              aria-describedby="emailHelp"
              value={Email}
              onChange={(e) => {
                SetEmail(e.target.value);
              }}
              required
            />
          </div>

          <div className=" w-100">
            <div style={{ display: "flex" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                id="exampleInputPassword1"
                value={Password}
                onChange={(e) => {
                  SetPassword(e.target.value);
                }}
                required
              />
              <button
                className="btn"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className=" w-100 d-flex flex-column  ">
            <CountryDropdown
              value={country}
              onChange={(val) => {
                setCountry(val);
              }}
            />
            <RegionDropdown
              country={country}
              value={region}
              onChange={(val) => {
                setRegion(val);
              }}
            />
          </div>
          <div className=" w-100">
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Mobile Number"
              value={MobileNo}
              onChange={(e) => {
                SetMobileNo(e.target.value);
              }}
              required
            />
          </div>

          <div className="d-flex justify-content-start w-100 border-2">
            <label className="btn border border-3 w-100 btn-outline-primary ">
              {photo ? photo.name : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  SetPhoto(e.target.files[0]);
                }}
                hidden
                required
              ></input>
            </label>
          </div>

          <button type="submit" className="btn btn-dark" disabled={Loading}>
            {Loading ? "Loading..." : " Submit"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Register;
