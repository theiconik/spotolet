import { useState, useRef } from "react";
//import { ReactComponent as iconSvg } from '../icon.svg';
import "./register.css";
import {FaMapMarkerAlt, FaRegWindowClose} from "react-icons/fa"
import axios from "axios";

export default function Register({setShowRegister}) {
  
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState(false);
   const nameRef = useRef();
   const emailRef = useRef();
   const passwordRef = useRef();

   const handleSubmit = async (e) => {
      e.preventDefault();
      const newUser = {
         username: nameRef.current.value,
         email: emailRef.current.value,
         password: passwordRef.current.value
      }
      try {
         await axios.post('https://spotolet-server.herokuapp.com/api/users/register', newUser);
         setError(false);
         setSuccess(true);
      } catch (error) {
         setError(true);
         console.log(error);
      }
   }

   return (
    <div className="registerContainer">
      <div className="logo">
        <FaMapMarkerAlt size={37}/>
        <p className="logotext">spotolet</p>
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Username" ref={nameRef} />
        <input type="email" placeholder="Enter Email" ref={emailRef} />
        <input type="password" placeholder="Enter Password" ref={passwordRef} />
        <button className="registerButton">Register</button>
        {success && (<span className="success">Successfully Registered. You can login now!</span>) }
        {error && (<span className="failure">Something went wrong!</span>)}
      </form>
      <FaRegWindowClose size={25} className="registerCancel" onClick={() => setShowRegister(false)}/>
    </div>
  );
}
