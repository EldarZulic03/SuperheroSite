import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // Variables for create list
  const [listName, setListName] = useState('');
  const [listContent, setListContent] = useState('');

  // Variables for edit list
  const [editListName, setEditListName] = useState('');
  const [editListContent, setEditListContent] = useState('');

  // Variables for return list
  const [returnListName, setReturnListName] = useState('');

  // Variables for delete list
  const [deleteListName, setDeleteListName] = useState('');

  // Variables for search
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Variables for sort
  const [sortBy, setSortBy] = useState('none');
  const [displayNum, setDisplayNum] = useState('');

  // Function to handle create list
  const handleCreateList = () => {
    // Implement your create list functionality here
  };

  // Function to handle edit list
  const handleEditList = () => {
    // Implement your edit list functionality here
  };

  // Function to handle return list
  const handleReturnList = () => {
    // Implement your return list functionality here
  };

  // Function to handle delete list
  const handleDeleteList = () => {
    // Implement your delete list functionality here
  };

  // Function to handle search
  const handleSearch = () => {
    // Implement your search functionality here
  };

  // Function to handle sort
  const handleSort = () => {
    // Implement your sort functionality here
  };

  // Function to handle clear
  const handleClear = () => {
    // Implement your clear functionality here
  };
  return (
    <>
      <Head>
        <title>Superhero Database</title>
        <meta charSet='utf=8'/>
        <meta name="description" content="Web app to showcase the REST Api I built along with the front and back-end frameworks" />
        <link rel="stylesheet" href="placeholder" />
      </Head>
      <main className={styles.main}>
        <h1>Superheroes!</h1>

        <div className={styles.results} id = "results"></div>
        <div className={styles.favDiv}>
          <h2>Favourites List</h2>
        
          <div className={styles.createList}>
            <input type="text" value={listName} onChange={e => setListName(e.target.value)} placeholder="Enter List Name" />
            <input type="text" value={listContent} onChange={e => setListContent(e.target.value)} placeholder="Enter Hero IDs" />
            <button type="button" onClick={handleCreateList}>Create List</button>
          </div>
        
          <div className={styles.editList}>
            <input type="text" value={editListName} onChange={e => editListName(e.target.value)} placeholder='Enter List Name'/>
            <input type="text" value={editListContent} onChange={e => editListContent(e.target.value)} placeholder='Enter Hero IDs'/>
            <button type="button" onClick={handleEditList}>Edit List</button>
          </div>

          <div className={styles.returnList}>
            <input type="text" value={returnListName} onChange={e => returnListName(e.target.value)} placeholder='Enter List Name'/>
            <button type="button" onClick={handleReturnList}>Return List</button>
          </div>

          <div className={styles.deleteList}>
            <input type="text" value={deleteListName} onChange={e => deleteListName(e.target.value)} placeholder='Enter List Name'/>
            <button type="button" onClick={handleDeleteList}>Delete List</button>
          </div>
        </div>

        <ul id="lists"></ul>

        <div id="hero_search">
          <h2>Search For SuperHeroes</h2>

          <div className = {styles.search}>
            <input type="text" id="search" placeholder="Search for Superhero" />
            <select value={searchField} onChange={handleSearchFieldChange}>
              <option value='name'>Name</option>
              <option value='id'>Race</option>
              <option value='publisher'>Publisher</option>
              <option value="power">Power</option>
            </select>
            <button type="button" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div id="heroSort">
          <h2>Sort Heroes By:</h2>
          <select>
            <option value="none">None</option>
            <option value="name">Name</option>
            <option value="race">Race</option>
            <option value="publisher">Publisher</option>
            <option value="power">Power</option>
          </select>

          <div id="retrieveForm">
            <input type="text" id="displayNum" placeholder="Number of Results" />
          </div>
        </div>

        <div id="displayDiv">
          <h2>Displayed SuperHeroes</h2>
          <button onClick={handleClear}>Clear</button>
        </div>

        <div id="smallDisplay"></div>
        <div id="heroDisplay"></div>

      </main>
      </>
  )
}
