import "./DropdownContent.css";

const DropdownContent = ({ children, open, onClick }) => {
  return (
    <div
      className={`dropdown-content ${open ? "content-open" : null}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default DropdownContent;
