import React, { useState } from 'react'
import './registerPage.css'
import { Link} from "react-router-dom"
import axios from "axios"
import Verifications from '../../components/Verifications'

const RegisterPage = () => {
  
  const [name, setName]= useState('');
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [isValidEmail, setIsValidEmail]= useState(false);
  const [isValidPass, setIsValidPass]= useState(false);
  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(value));
  };

  const handleChangePass = (e) => {
    setPassword(e.target.value);
    console.log("setPssword");
    setIsValidPass(isPasswordValid(e.target.value));
    console.log("setpassvalid");
  };

  

  const isPasswordValid = (password) => {
    const hasAlphabet = /[a-zA-z]/.test(password);
    const hasSpecialCharacters=/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    return (hasAlphabet && hasSpecialCharacters && hasNumber && isLongEnough)
  };


  function registerUser(ev){
    ev.preventDefault();
    if(!isValidEmail)
      alert("invalid email address")

    else if(!isValidPass)
      alert("invalid password")
    
    else{
      axios.post("/register",{name,email,password})
      .then(()=>{
        alert('Successfully registered. Now you can login')
      })
      .catch((err)=>{
        console.log(err);
        alert('Failed to register');
      })
    }
  }

  return (
    <div className="register">
      <div className="register-content">
        <h1 className='regHeader'>Register</h1>
        <form className='form' onSubmit={registerUser}>
          <input type='text' placeholder="Full Name" 
            value={name}
            onChange={e=>setName(e.target.value)}
          />
          <div className='mb-2'>
            <input id="emailId" type="email" placeholder="your@email.com" 
              value={email} 
              onChange={handleChangeEmail}
            />
          {
            email!=='' &&
            <Verifications stateName={isValidEmail} line1={'Enter valid Email'} line2={"Valid Email"}/>
          }</div>

          <input id="pass" type="password" placeholder='password' 
            value={password}
            onChange={e=>handleChangePass(e)}
          />
          {
          password!=='' &&
          <Verifications stateName={isValidPass} line2={'Password is valid'} line1={'Password must contain at least one alphabet, one number, and be at least 8 characters long'} />
          }
          <button className="reg" type="submit" >Register</button>
        </form>
        <div className='logRequest'>
          <p>Already have an account?</p>
          <Link to="/login" className='logLink'>Go to login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;