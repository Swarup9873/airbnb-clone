import React,{ useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'
import axios from 'axios'
import { UserContext } from '../../contexts/UserContext';

const LoginPage = () => {
  
  const navigate = useNavigate();
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [redirect, setRedirect] = useState(false);
  const {user,setUser}= useContext(UserContext);
  const [failed,setFailed]=useState(false);

  async function loginUser(ev){
    ev.preventDefault();
    try{
      const userInfo= await axios.post('/login', {email,password});
      setUser(userInfo.data);
      alert("Successfully logged in");
      setRedirect(true);
    }
    catch(e){
      setFailed(true);
      if(e.response.status===500)
        alert("DB error");
      else if(e.response.status===404)
        alert("Email adress not found");
      else if(e.response.status===422)
        alert("Wrong Password");
      else
        alert("Login failed");
    };
  };
  
  useEffect(()=>{
    if(user && !redirect){
      navigate('/');
      alert("Already Logged in")
    }
  },[user, redirect, navigate])
  

  useEffect(() => {
    if (redirect) {
      navigate(-1);
    }
  }, [redirect, navigate]);

  return (
    <div className="modal show">
      <div className="modal-content">
        {/* Your login form JSX */}
        <h1 className='loginHeader'>Login</h1>
        {failed &&(
          <span className='tryAgain'>Email address and password dont match! Try again</span>
        )}
        <form className='form' onSubmit={loginUser}>
          <input type="email" placeholder="your@email.com" 
            value={email} 
            onChange={e=>setEmail(e.target.value)}
          />
          <input type="password" placeholder='password' 
            value={password}
            onChange={e=>{setPassword(e.target.value)}}
          />
          <button className="login" type="submit" >Login</button>
          <div className='regRequest'>
            <p>Don't have an account yet?</p>
            <Link className="regLink" to={"/register"}>Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;