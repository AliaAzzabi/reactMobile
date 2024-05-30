import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirmer</button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  );
};

export default ConfirmationDialog;
