import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';


const Login = (props) => {
    const [credentials,setCredentials]=useState({email:"",password:""})
    let navigate=useNavigate();
//    let history=useHistory();
    const handleSubmit= async(e)=>{
            e.preventDefault()     //page reload n ho uske liye
            const response = await fetch(`http://localhost:5000/api/auth/login`, {
                method: "POST",
          
                headers: {
                  "Content-Type": "application/json",
                }, body: JSON.stringify({ email:credentials.email ,password:credentials.password }),
          
              });
              const json=await response.json();
              console.log(json)
              if(json.success){

            
             
                //save the authtoken and redirect
                localStorage.setItem('token',json.authtoken);
                navigate("/");
                props.showAlert("logged in Successfully","success")
              }
              else{
                props.showAlert("Invalide Credentials","danger")
              }
              
              
    }

    const onChange=(e)=>{
        
        //spread Operator
        setCredentials({...credentials,[e.target.name]:e.target.value})
      
      
      }

  return (
    <div className='mt-3'> 
      <h2>Login to continue to  iNotebook</h2>
     <form onSubmit={handleSubmit} >
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" id="email"  name="email" value={credentials.email}   aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange}/>
 
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" id="password" name="password" value={credentials.password}  placeholder="Password" onChange={onChange} />
  </div>
 
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default Login
