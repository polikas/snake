import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  const handleSourceCode = () => {
    const tripAppUrl = "https://github.com/polikas/snake";
    window.open(tripAppUrl, "_blank");
  };

  return (
    <footer className="footer--pin">
      &copy; 2024 Developed by Stavros Charitos. Available source code on{" "}
      <a
        href="#"
        onClick={handleSourceCode}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <GitHubIcon sx={{ fontSize: 40 }} />
      </a>
    </footer>
  );
};

export default Footer;
