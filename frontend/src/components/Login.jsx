import { useState, useRef } from "react";
//import { ReactComponent as iconSvg } from '../icon.svg';
import "./register.css";
import {FaMapMarkerAlt, FaRegWindowClose} from "react-icons/fa"
import axios from "axios";
import "./login.css"

export default function Login({setShowLogin, myStorage, setCurrentUser}) {
  
   const [error, setError] = useState(false);
   const nameRef = useRef();
   const passwordRef = useRef();

   const handleSubmit = async (e) => {
      e.preventDefault();
      const user = {
         username: nameRef.current.value,
         password: passwordRef.current.value
      }
      try {
         const res = await axios.post('https://spotolet-server.herokuapp.com/api/users/login', user);
         myStorage.setItem("user", res.data.username);
         setCurrentUser(res.data.username);
         setShowLogin(false);
         setError(false);
      } catch (error) {
         setError(true);
         console.log(error);
      }
   }

   return (
    <div className="loginContainer">
      <div className="logo">
        <FaMapMarkerAlt size={37}/>
        <p className="logotext">spotolet</p>
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Username" ref={nameRef} />
        <input type="password" placeholder="Enter Password" ref={passwordRef} />
        <button className="loginButton">Login</button>
        {error && (<span className="failure">Wrong username or password!</span>)}
      </form>
      <FaRegWindowClose size={25} className="loginCancel" onClick={() => setShowLogin(false)}/>
    </div>
  );
}
