import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1px solid",
        cursor: "pointer"
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;
