import { useTheme } from "../../hooks/useTheme";

import { FaAdjust } from "react-icons/fa";

import "./styles.scss";

export function ThemeSwitcher() {
  const { toggleTheme } = useTheme();
  return (
    <button className="switcher" onClick={toggleTheme}>
      <FaAdjust />
    </button>
  );
}
