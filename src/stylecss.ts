// めっちゃ嫌だけど一旦
export  const styles = `
  body {
    font-family: "Helvetica Neue",
      Arial,
      "Hiragino Kaku Gothic ProN",
      "Hiragino Sans",
      Meiryo,
      sans-serif;
    padding: 2rem 3rem;
    font-size: 14px;
  }
  @media (max-width: 600px) {
    body {
      padding: 1rem 1.25rem;
    }
  }
  @media print {
    .no-print {
      display: none;
    }
  }

  .grid-container {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: center;
  }

  h1 {
    background-color: #93c5fd;
    padding-left: 0.25rem;
  }
  h2 {
    background-color: #bfdbfe;
    padding-left: 0.25rem;
  }
  h3 {
    background-color: #dbeafe;
    padding-left: 0.25rem;
  }

  table {
    border-collapse: collapse;
    border: 1px solid #bae6fd;
    margin-bottom: 2rem;
  }

  thead {
    background-color: #eff6ff;
  }

  thead th {
    text-align: left;
    padding: 12px 10px;
    font-weight: bold;
    border-bottom: 2px solid #bae6fd;
  }

  tbody td {
    padding: 10px;
    vertical-align: top;
  }

  tbody td:last-child {
    border-right: none;
  }

  table th:first-child, table td:first-child {
    width: 80px;
  }

  table tr:nth-child(even) {
    background-color: #eff6ff;
  }

  button {
    border: none;
    margin: 0 0.25rem;
    padding: 2px 8px;
    font-size: 0.75rem;
    background-color: #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
  }
`
