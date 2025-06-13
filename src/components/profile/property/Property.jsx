import React, { useState } from 'react';
import AddPropertyPreview from './Preview';
import AddPropertyForm from './Form';

const AddProperty = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const handleSuccess = () => {
    setShowForm(false);
  };

  return (
    <>
      {!showForm ? (
        <AddPropertyPreview onAddClick={handleAddClick} />
      ) : (
        <AddPropertyForm onClose={handleClose} onSuccess={handleSuccess} />
      )}
    </>
  );
};

export default AddProperty; 