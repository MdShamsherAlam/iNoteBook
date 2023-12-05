
import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials,setCredentials]=useState({name:"",email:"",password:"",cpassword:""})
    let navigate=useNavigate();
    const handleSubmit = async (e) => {
       //page reload n ho uske liye
        e.preventDefault()  
           const{name,email,password,cpassword  }=credentials;
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                //edited credentials
            }, body: JSON.stringify({ name,email,password }),

        });
        const json = await response.json();
        console.log(json)
        if(json.success){
            //save the authtoken and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Account Created Successfully","success")
        }
        
        else{
            
            
        
    }
}
   

    const onChange = (e) => {

        //spread Operator
        setCredentials({ ...credentials, [e.target.name]: e.target.value })


    }
    return (
        <div className="container mt-3">
              <h2>Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit} >
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" placeholder="Enter name"  />
                    
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email" />

                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} placeholder="Password" minLength={5} required />
                </div>
                <div className="form-group">
                    <label htmlFor="ConfirmexampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} placeholder=" Confirm Password" minLength={5} required  />
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Signup
