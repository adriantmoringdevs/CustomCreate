import React, { useState } from "react";
import styles from "../styles/Dropdown.module.css";

const Dropdown = ({ items, handleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    handleChange(item);
    setIsOpen(false);
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleDropdown} style={styles.button}>
        {selectedItem || "Select an Option"} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <ul style={styles.menu}>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item)}
              style={styles.menuItem}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
