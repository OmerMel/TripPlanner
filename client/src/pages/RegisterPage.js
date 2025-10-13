import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormStringInput from "../components/FormStringInput";
import axios from "axios";
import "./style/RegisterPage.css";
import validation from "../utils/validation";


function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  /////////////////////////////////////////////////////////////////
  // Handle form submission
  /////////////////////////////////////////////////////////////////
  async function handleSubmit(event) {
    event.preventDefault();

    // Validation input 
    if (!validation.validateMinLength(firstName, 2)) {
      alert("שם פרטי חייב להכיל לפחות 2 תווים");
      return;
    }

    if (!validation.validateMinLength(lastName, 2)) {
      alert("שם משפחה חייב להכיל לפחות 2 תווים");
      return;
    }

    if (!validation.validateEmail(email)) {
      alert("אנא הזן כתובת אימייל חוקית");
      return;
    }

    if (!validation.validatePassword(password)) {
      alert("הסיסמה חייבת להיות באורך של לפחות 6 תווים");
      return;
    }

    if (!validation.validatePasswordsMatch(password, confirmPassword)) {
      alert("הסיסמאות לא תואמות");
      return;
    }

    try {
      // HTTP POST request - Send registration data to the server 
      const response = await axios.post("/api/users/register", {
        username: `${firstName} ${lastName}`,
        email,
        password,
      });

      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("token", response.data.token); //Save JWT token if received from the server
      console.log("Register success:", response.data);
      alert("הרשמה בוצעה בהצלחה!");

      navigate("/home"); // Navigate to the Home page after successful registration
    } catch (error) {
      console.error("Register error:", error);
      alert("שגיאה בהרשמה, אנא נסה שוב מאוחר יותר");
    }
  }

  return (
    <div dir="rtl" className="register-page">
      <button type="back" className="login-back-btn" onClick={() => navigate("/")}>
          ➔
      </button>
      <h1>הרשמה</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <FormStringInput
          label="שם פרטי:"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FormStringInput
          label="שם משפחה:"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <FormStringInput
          label="אימייל:"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormStringInput
          label="סיסמה:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormStringInput
          label="אימות סיסמה:"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="register-btn">
          הרשמה
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
