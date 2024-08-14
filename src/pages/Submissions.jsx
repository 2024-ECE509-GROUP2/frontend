import React from "react";
import { Link } from "react-router-dom";


// Moved from /components/dashboard/

const Submissions = () => {
  return (
    <>
      <section>
        <div className="left">
          <ul>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/submissions" className="active">
              Submissions
            </Link>
            <Link to="/classes">Classes</Link>
            <Link to="/forum">Forum</Link>
          </ul>
        </div>
        <div className="right">
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
          <div className="table">
            <table>
              <tr>
                <th>Course</th>
                <th>Date/Time submitted</th>
              </tr>
              <tr>
                <td>ECE 509 - Software Engineering</td>
                <td> 25/07/2024 05:40:15 PM</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Submissions;
