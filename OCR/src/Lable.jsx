import React from "react";
import './App.css'

export default function Lable({label, value}){

    function capitalizeFirstLetter(str) {
        return `${str[0].toUpperCase()}${str.slice(1)}`;
      }
      

    return(
    <div  className="result">
          <label htmlFor="input" className="result-label">
            {capitalizeFirstLetter(label)}
          </label>
          <input id="input" className="result-field"
            type="text"
            value={value}
            readOnly ={true}
          />
        </div>
    )
} 