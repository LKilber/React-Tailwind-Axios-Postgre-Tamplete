import React from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'application/pdf':
      return <PictureAsPdfIcon style={{ color: 'red' }} />;
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return <InsertDriveFileIcon style={{ color: 'green' }} />;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <DescriptionIcon style={{ color: 'blue' }} />;
    default:
      return <InsertDriveFileIcon style={{ color: 'grey' }} />;
  }
};

const AttachmentDropzone = ({ name, formData, onDrop, onRemove }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleRemoveClick = (e, fileIndex) => {
    e.stopPropagation(); // Previne a propagação do evento de clique
    onRemove(fileIndex);
  };

  return (
    <div
      style={{
        border: '2px dashed #cccccc',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f9f9f9',
        transition: 'border .24s ease-in-out',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centraliza horizontalmente
        justifyContent: 'center', // Centraliza verticalmente
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} name={name} />
      <p style={{ margin: '10px 0', color: '#888', fontSize: '16px' }}>
        Arraste e solte anexos aqui, ou clique para selecionar arquivos.
      </p>
      <List dense>
        {formData.attachments.map((file, fileIndex) => (
          <ListItem key={fileIndex}>
            <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
            <ListItemText primary={file.name} />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => handleRemoveClick(e, fileIndex)}
              style={{ color: '#888', transition: 'color 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'red')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              <CloseIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

AttachmentDropzone.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default AttachmentDropzone;
