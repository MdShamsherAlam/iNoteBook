import React from 'react';

export default function Alert(props) {
  const handleCloseClick = () => {
    props.setAlert(null); // Set the alert state to null to hide the alert
  };

  return (
    props.alert && (
      <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
        <strong>{props.alert.type.toUpperCase()}</strong> {props.alert.msg}
       
      </div>
    )
  );
}
