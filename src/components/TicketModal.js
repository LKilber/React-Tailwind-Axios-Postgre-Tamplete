import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/TicketModal.css';

const TicketModal = ({ isOpen, onClose, children, onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setAttachedFiles([...attachedFiles, file]);
    onFileChange(file);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
        <div className="modal-file-input">
          <label htmlFor="file-upload" className="custom-file-upload">
            {selectedFile ? selectedFile.name : 'Anexar Arquivo'}
          </label>
          <input id="file-upload" type="file" onChange={handleFileChange} />
        </div>
        {attachedFiles.length > 0 && (
          <div className="modal-dropdown">
            <label htmlFor="file-dropdown">Arquivos Anexados:</label>
            <select id="file-dropdown">
              {attachedFiles.map((file, index) => (
                <option key={index} value={file.name}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

TicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  onFileChange: PropTypes.func.isRequired,
};

export default TicketModal;
