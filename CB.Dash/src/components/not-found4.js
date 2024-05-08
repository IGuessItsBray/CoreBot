import React from "react";

import PropTypes from "prop-types";

import "./not-found4.css";

const NotFound4 = (props) => {
  return (
    <div className="not-found4-container thq-section-padding">
      <div className="not-found4-max-width thq-section-max-width">
        <div className="not-found4-container1">
          <div className="not-found4-container2">
            <h2 className="not-found4-text thq-heading-2">Oooops!</h2>
            <p className="not-found4-text1 thq-body-large">{props.content1}</p>
            <button className="thq-button-filled">
              <span className="thq-body-small">{props.action1}</span>
            </button>
          </div>
        </div>
        <div className="not-found4-container3">
          <h1 className="not-found4-text2 thq-heading-1">404</h1>
        </div>
      </div>
    </div>
  );
};

NotFound4.defaultProps = {
  action1: "Back to homepage",
  content1: "We can't seem to find the page you are looking for.",
};

NotFound4.propTypes = {
  action1: PropTypes.string,
  content1: PropTypes.string,
};

export default NotFound4;
