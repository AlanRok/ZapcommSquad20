import React, { useState, useEffect } from "react";
import moment from "moment";
import { i18n } from "../../translate/i18n";
const styles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
  navButtons: {
    display: "flex",
    alignItems: "center",
  },
  navButton: {
    backgroundColor: "#dcdcdc",
    color: "#6B7280",
    border: "none",
    padding: "5px 20px",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px",
    margin: "0 1px",
  },
  navButtonHover: {
    color: "#fff",
    backgroundColor: "#0C2454",
  },
  viewButtons: {
    display: "flex",
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#fff",
    color: "#6B7280",
    border: "none",
    padding: "5px 12px",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px",
    margin: "0 5px",
    transition: "background-color 0.3s",
  },
  viewButtonHover: {
    backgroundColor: "#0C2454",
    color: "#fff",
  },
  viewButtonActive: {
    backgroundColor: "#0C2454",
    color: "#fff",
  },
  currentMonth: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
};

const CustomToolbar = ({ date, onNavigate, onViewChange, view }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredNavButton, setHoveredNavButton] = useState(null);
  const [activeButton, setActiveButton] = useState(view); // inicializa com a visualização atual
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");

  useEffect(() => {
    if (view === "day") {
      setCurrentDateDisplay(moment(date).format("DD MMMM YYYY"));
    } else if (view === "week") {
      const startOfWeek = moment(date).startOf("week");
      const endOfWeek = moment(date).endOf("week");
      setCurrentDateDisplay(
        `${startOfWeek.format("MMMM D")} – ${endOfWeek.format("D")}`
      );
    } else if (view === "month") {
      setCurrentDateDisplay(moment(date).format("MMMM YYYY"));
    }
    else if (view === "agenda") {
      const startOfAgenda = moment(date);
      const endOfAgenda = moment(date).add(30, "days");
      setCurrentDateDisplay(
        `${startOfAgenda.format("DD/MM/YYYY")} – ${endOfAgenda.format("DD/MM/YYYY")}`
      );
    }
  }, [date, view]);
  const goToBack = () => {
    onNavigate("PREV");
    setActiveButton("back");
  };
  const goToNext = () => {
    onNavigate("NEXT");
    setActiveButton("next");
  };

  const goToToday = () => {
    onNavigate("TODAY");
    setActiveButton("today");
  };

  useEffect(() => {
    setActiveButton(view);
  }, [view]);

  const handleNavigationClick = (action) => {
    if (action === "today") {
      onNavigate("TODAY");
      setActiveButton("today");
    } else if (action === "back") {
      onNavigate("PREV");
      setActiveButton("back");
    } else if (action === "next") {
      onNavigate("NEXT");
      setActiveButton("next");
    }
  };


  const handleViewChange = (view) => {
    onViewChange(view);
    setActiveButton(view);
  };

  return (
    <div className="rbc-toolbar" style={styles.toolbar}>
      <div style={styles.navButtons}>
        <button
          type="button"
          onClick={() => handleNavigationClick("back")}
          style={{
            ...styles.navButton,
            ...(hoveredNavButton === "back" ? styles.navButtonHover : {}),
            ...(activeButton === "back" ? styles.viewButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredNavButton("back")}
          onMouseLeave={() => setHoveredNavButton(null)}
        >
          {"<"}
        </button>
        <button
          type="button"
          onClick={() => handleNavigationClick("today")}
          style={{
            ...styles.navButton,
            ...(hoveredNavButton === "today" ? styles.navButtonHover : {}),
            ...(activeButton === "today" ? styles.viewButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredNavButton("today")}
          onMouseLeave={() => setHoveredNavButton(null)}
        >
          {i18n.t(`Toolbaroptions.today`)}
        </button>
        <button
          type="button"
          onClick={() => handleNavigationClick("next")}
          style={{
            ...styles.navButton,
            ...(hoveredNavButton === "next" ? styles.navButtonHover : {}),
            ...(activeButton === "next" ? styles.viewButtonActive : {}),
          }}
          onMouseEnter={() => setHoveredNavButton("next")}
          onMouseLeave={() => setHoveredNavButton(null)}
        >
          {">"}
        </button>
      </div>
      <div style={styles.currentMonth}> {currentDateDisplay.charAt(0).toUpperCase() + currentDateDisplay.slice(1)}</div>

      <div style={styles.viewButtons}>
        {['day' , "week", "month", "agenda"].map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => handleViewChange(view)}
            style={{
              ...styles.viewButton,
              ...(hoveredButton === view ? styles.viewButtonHover : {}),
              ...(activeButton === view ? styles.viewButtonActive : {}),
            }}
            onMouseEnter={() => setHoveredButton(view)}
            onMouseLeave={() => setHoveredButton(null)}
          > 
            {i18n.t(`Toolbaroptions.${view}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomToolbar;




