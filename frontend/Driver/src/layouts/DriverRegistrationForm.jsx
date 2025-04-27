import React, { useState } from "react";

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    address: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    carPlateNumber: "",
    carMake: "",
    carModel: "",
    carYear: "",
    carColor: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // You can send formData to your backend API here
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Driver Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DRIVER INFO */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Driver Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="nationalId"
              placeholder="National ID Number"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="address"
              placeholder="Home Address"
              onChange={handleChange}
              className="input"
            />
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              onChange={handleChange}
              className="input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* CAR INFO */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Car Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="carPlateNumber"
              placeholder="License Plate Number"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="carMake"
              placeholder="Car Make (e.g., Toyota)"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="carModel"
              placeholder="Car Model (e.g., Corolla)"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="number"
              name="carYear"
              placeholder="Car Year (e.g., 2020)"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="carColor"
              placeholder="Car Color (Optional)"
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="text-center">
          <button
            type="submit"
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverRegistrationForm;
