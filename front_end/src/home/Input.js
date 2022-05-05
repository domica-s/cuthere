// The program exports default type for input
// PROGRAMMER: Pierson
// The program can be seen used throughout the project as an input type
// Revised on 5/5/2022

import React from "react";

export default ({ placeholder, type, value, handleInput, name }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleInput}
      placeholder={placeholder}
    />
  );
};