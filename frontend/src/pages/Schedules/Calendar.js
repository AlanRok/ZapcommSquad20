import React from 'react';
import './Calendar.css';

const Calendar = () => {
  return (
    <div className="calendar-container">
      <aside className="sidebar">
        <div className="logo">Zapcomm</div>
        <nav className="menu">
          <ul>
            <li>📅</li>
            <li>📨</li>
            <li>📈</li>
            <li>⚙️</li>
          </ul>
        </nav>
        <div className="calendar-info">
          <div className="month-header">
            <button className="month-nav">{'<'}</button>
            <span>Setembro 2024</span>
            <button className="month-nav">{'>'}</button>
          </div>
          <div className="events">
            <h3>HOJE 27/09/2024</h3>
            <ul>
              <li>8:30 - 9:00 AM - Monthly catch-up</li>
              <li>8:30 - 9:00 AM - Quarterly review</li>
            </ul>
          </div>
        </div>
      </aside>
      <main className="calendar">
        <header className="calendar-header">
          <div className="view-selector">
            <button>Dia</button>
            <button className="active">Semana</button>
            <button>Mês</button>
            <button>Ano</button>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Buscar" />
          </div>
        </header>
        <div className="week-view">
          <div className="day">
            <span>Dom 23</span>
          </div>
          <div className="day">
            <span>Seg 24</span>
            <div className="event">8:00 AM - Monday Wake-Up Hour</div>
          </div>
          <div className="day">
            <span>Ter 25</span>
            <div className="event">9:00 AM - All-Team Kickoff</div>
          </div>
          <div className="day">
            <span>Qua 26</span>
            <div className="event">9:00 AM - Coffee Chat</div>
          </div>
          <div className="day">
            <span>Qui 27</span>
            <div className="event">10:00 AM - Health Benefits Walkthrough</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;