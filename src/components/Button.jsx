import Button from "react-bootstrap/Button";

export default function Buttons({ name, onClick, className }) {
  return (
    <section className="body__tableWrapper">
      <div className="body__container">
        <Button
          onClick={onClick}
          className={className}
          style={{ width: "auto", padding: "10px 20px" }}
        >
          {name}
        </Button>
      </div>
    </section>
  );
}
