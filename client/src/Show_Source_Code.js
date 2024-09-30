import React from 'react';

const Show_Source_Code = () => {
  const frontendUrl = 'https://github.com/DevlinW98/Frontend_TOC';
  const backendUrl = 'https://github.com/DevlinW98/Backend_TOC';

  return (
    <div style={styles.container}>
      <h1>GitHub Repositories</h1>
      <div style={styles.buttonContainer}>
        <a href={frontendUrl} target="_blank" rel="noopener noreferrer">
          <button style={styles.button}>Frontend Repository</button>
        </a>
        <a href={backendUrl} target="_blank" rel="noopener noreferrer">
          <button style={styles.button}>Backend Repository</button>
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
};

export default Show_Source_Code;
