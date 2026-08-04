import React, { useState } from "react";
import styles from "../styles/Dropdown.module.css";

const Dropdown = ({ items, handleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
  setSelectedItem(item);
  handleChange(item);
  console.log(item)
  setIsOpen(false);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>

      <button onClick={toggleDropdown}className={styles.button} type="button">
        {selectedItem || "Select an Option"} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <ul className={styles.menu}>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item)}
              className={styles.menuItem}
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
