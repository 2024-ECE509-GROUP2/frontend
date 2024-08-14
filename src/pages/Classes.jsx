import React from "react";
import { Link } from "react-router-dom";
import "../styles/classes.css";
import book from "../../assets/book.png";

// Moved from /components/classes/

const Classes = () => {
  return (
    <>
      <section>
        <div className="left">
          <ul>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/submissions">Submissions</Link>
            <Link to="/classes" className="active">
              Classes
            </Link>
            <Link to="/forum">Forum</Link>
          </ul>
        </div>
        <div className="right classes-page">
          <div className="header">
            <div className="box">
              <p>
                Course : <b>ECE</b>
              </p>
              <p>
                Level: <b>500</b>
              </p>
            </div>
            <div className="box week">
              <h2>Week 6</h2>
              <p>Wednesday, 23rd July 2024</p>
            </div>
            <div className="div">
              <h4>John Iluyemi</h4>
              <p>U2018/3020***</p>
            </div>
          </div>
          <div className="bar">
            <p>ECE 507</p>
            <p className="active">ECE 508</p>
            <p>ECE 509</p>
            <p>ECE 510</p>
            <p>ECE 517</p>
            <p>ECE 518</p>
          </div>
          <div className="group">
            <p>
              Class is currently <span className="live">live</span>
            </p>
            <button>Join</button>
          </div>
          <div className="assignments">
            <div className="one">
              <h4>Assignments Submission</h4>
              <p>
                Status: <span>ongoing</span>
              </p>
              <p>
                Deadline: <span>5 days</span>
              </p>
            </div>
            <div className="two">
              <button>Submit</button>
            </div>
          </div>
          <div className="materials">
            <h4>Course Materials</h4>
            <div className="books">
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
              <img src={book} alt="book" />
            </div>
            <div className="btn-container">
              <button>Download all</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Classes;
