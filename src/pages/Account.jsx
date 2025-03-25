import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import "../styles/account.css";
import PagesHeader from "../components/PagesHeader.jsx";
import Footer from "../components/Footer.jsx";
import BottomBar from "../components/BottomBar.jsx";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoWH2Gto7VNu7yFXxy2877aqRPC3QIV4k",
  authDomain: "tea-page.firebaseapp.com",
  projectId: "tea-page",
  storageBucket: "tea-page.appspot.com",
  messagingSenderId: "988473315460",
  appId: "1:988473315460:web:df93179059b27269d272d1",
  measurementId: "G-YMRWW60R7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Google provider

function Account() {
  const [animationKey, setAnimationKey] = useState(0);
  const [custName, setcustName] = useState("");
  const [custPassword, setCustPassword] = useState("");
  const [email, setEmail] = useState("");
  const [custNameValid, setcustNameValid] = useState(true);
  const [custPasswordValid, setcustPasswordValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState(null); // State to track login errors

  function triggerAnimation() {
    setAnimationKey((prevKey) => prevKey + 1);
  }

  function validateForm() {
    console.log("Validating form...");
    let isValid = true;

    if (!custName.trim()) {
      setcustNameValid(false);
      isValid = false;
    } else {
      setcustNameValid(true);
    }

    if (!custPassword.trim()) {
      setcustPasswordValid(false);
      isValid = false;
    } else {
      setcustPasswordValid(true);
    }

    if (!email.trim() || !email.includes("@")) {
      setEmailValid(false);
      isValid = false;
    } else {
      setEmailValid(true);
    }

    if (!isValid) {
      triggerAnimation();
    }

    return isValid;
  }

  function order(submit) {
    submit.preventDefault();
    if (validateForm()) {
      signInWithEmailAndPassword(auth, email, custPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed in:", user);
          setFormSubmitted(true);
          setLoginError(null); // Clear any login errors on success
        })
        .catch((error) => {
          console.error("Login failed:", error.message);
          setLoginError("Login failed. Please check your credentials.");
          setFormSubmitted(false);
        });
    } else {
      setFormSubmitted(false);
    }
  }

  // Google sign-in function
  function googleSignIn() {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log("User signed in with Google:", user);
        setFormSubmitted(true);
        setLoginError(null);
      })
      .catch((error) => {
        console.error("Google Sign-In failed:", error.message);
        setLoginError("Google Sign-In failed. Please try again.");
      });
  }

  return (
    <div className="account-container">
      <PagesHeader />

      <form onSubmit={order} className="contact-form">
        <input
          id="custname"
          key={`custName-${animationKey}`}
          type="text"
          name="custname"
          className={custNameValid ? "" : "contact-error-input"}
          value={custName}
          onChange={(e) => setcustName(e.target.value)}
          autoComplete="name"
          placeholder="Your Name"
        />

        <input
          id="email"
          key={`email-${animationKey}`}
          type="email"
          name="email"
          className={emailValid ? "" : "contact-error-input"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Email"
        />

        <input
          id="custpassword"
          key={`custPassword-${animationKey}`}
          type="password"
          name="custpassword"
          className={custPasswordValid ? "" : "contact-error-input"}
          onChange={(e) => setCustPassword(e.target.value)}
          placeholder="Password"
        />

        <input type="submit" value="Sign In" />

        {formSubmitted && (
          <span className={`thanks ${formSubmitted ? "visible" : ""}`}>
            Welcome back, {custName}
          </span>
        )}

        {loginError && <p className="login-error">{loginError}</p>}
      </form>

      <div className="google-signin">
        <button onClick={googleSignIn} className="google-button">
          Sign in with Google
        </button>
      </div>

      <Footer />
      <BottomBar />
    </div>
  );
}

export default Account;
