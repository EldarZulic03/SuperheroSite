import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const data = async () => {
      await handleSearch(searchField, searchQuery, displayNum)
    };

    data();
  },[searchField,searchQuery,displayNum]);
  
  
  // Function to handle create list
  const handleCreateList = async (listName, heroIds) => {
    // console.log('create button clicked');
    const heroIdsArray = heroIds.split(',').map(Number);
  
    const response = await fetch('http://localhost:5001/superheroes/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: listName,
        heroIds: heroIdsArray,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  };

  // Function to handle edit list
  const handleEditList = async (listName, heroIds) => {
    // console.log('edit button clicked');
    const heroIdsArray = heroIds.split(',').map(Number);
  
    const response = await fetch(`http://localhost:5001/superheroes/lists/${listName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: listName,
        heroIds: heroIdsArray,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  };

  // Function to handle return list
  const handleReturnList = async (listName) => {
    const response = await fetch(`http://localhost:5001/superheroes/lists/${listName}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
  
    // Assuming the data is an array of superheroes
    const list = data.map(hero => hero.name).join(', ');
  
    alert(`List: ${list}`);
  };

  // Function to handle delete list
  const handleDeleteList = async (listName) => {
    // console.log('delete button clicked');
    const response = await fetch(`http://localhost:5001/superheroes/lists/${listName}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  };

  const searchbyField = async (field,name, n) => {
    const response = await fetch(`http://localhost:5001/superheroes/search?field=${field}&pattern=${name}&n=${n}`);
    const data = await response.json();
    console.log(data);
    return data
  };

  // Function to handle search
  const handleSearch = async (searchField, searchQuery, displayNum) => {
    let n = searchNum(displayNum);
    if(searchField === 'name'){
      searchbyField('name',searchQuery, n);
    }
    // else if(searchField === 'race'){
    //   searchbyField('race', searchQuery, n);
    // }
    // else if(searchField === 'publisher'){
    //   searchbyField('publisher',searchQuery, n);
    // }
    // else if(searchField === 'id'){
    //   searchById(searchQuery, n);
    // }
    else{
      console.log("Invalid Search Field");
    } 
  };

  const handleSearchQuery = (event) =>{
    setSearchQuery(event.target.value);
  };
  
  const handleSearchFieldChange = (event) =>{
    setSearchField(event.target.value);
  };

  

  const searchNum = (displayNum) => {
    const n = displayNum;
    if (n === ''||n===undefined) {
      return 11;
    }
    else if(isNaN(Number(n))){
      return 11;
    }else{
      return Number(n);
    };
  };
  // Function to handle sort
  const handleSort = () => {
    
  };

  // Function to handle clear
  const handleClear = () => {
    
  };
  
  const handleListName = (event) =>{
    setListName(event.target.value);
  };

  const handleListContent = (event) =>{
    setListContent(event.target.value);
  };

  const handleEditListName = (event) =>{
    setEditListName(event.target.value);
  };

  const handleEditListContent = (event) =>{
    setEditListContent(event.target.value);
  };

  const handleReturnListName = (event) =>{
    setReturnListName(event.target.value);
  };
  
  const handleDeleteListName = (event) =>{
    setDeleteListName(event.target.value);
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

          {/* CREATE LISTS */}
          <div className={styles.createList}>
            <input type="text" value={listName} onChange={handleListName} placeholder="Enter List Name" />
            <input type="text" value={listContent} onChange={handleListContent} placeholder="Enter Hero IDs" />
            <button type="button" onClick={() =>handleCreateList(listName,listContent)}>Create List</button>
          </div>
        
          {/* EDIT LISTS */}
          <div className={styles.editList}>
            <input type="text" value={editListName} onChange={handleEditListName} placeholder='Enter List Name'/>
            <input type="text" value={editListContent} onChange={handleEditListContent} placeholder='Enter Hero IDs'/>
            <button type="button" onClick={() =>handleEditList(editListName, editListContent)}>Edit List</button>
          </div>

          {/* RETURN LISTS */}
          <div className={styles.returnList}>
            <input type="text" value={returnListName} onChange={handleReturnListName} placeholder='Enter List Name'/>
            <button type="button" onClick={() =>handleReturnList(returnListName)}>Return List</button>
          </div>

          <div className={styles.deleteList}>
            <input type="text" value={deleteListName} onChange={handleDeleteListName} placeholder='Enter List Name'/>
            <button type="button" onClick={() => handleDeleteList(deleteListName)}>Delete List</button>
          </div>
        </div>

        <ul id="lists"></ul>



        
        
        {/* search bar */}
        <div id="hero_search">
          <h2>Search For SuperHeroes</h2>

          <div className = {styles.search}>
            <input type="text" value={searchQuery} onChange={handleSearchQuery} placeholder="Search for Superhero" />
            <select value={searchField} onChange={handleSearchFieldChange}>
              <option value='name'>Name</option>
              <option value='race'>Race</option>
              <option value='publisher'>Publisher</option>
              <option value="id">ID</option>
            </select>
            <button id='searchBtn' type="button" onClick={() => handleSearch(searchField,searchQuery,displayNum)}>Search</button>
          </div>
        </div>

        <div id="heroSort">
          <h2>Sort Heroes By:</h2>
          <select value={sortBy} onChange={setSortBy}>
            <option value="none">None</option>
            <option value="name">Name</option>
            <option value="race">Race</option>
            <option value="publisher">Publisher</option>
            <option value="power">Power</option>
          </select>

          <div id="retrieveForm">
            <input type="text" value={displayNum} onChange={setDisplayNum} placeholder="Number of Results" />
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
