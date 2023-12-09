import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import { set } from 'mongoose';
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // Variables for create list
  // const [listName, setListName] = useState('');
  // const [listContent, setListContent] = useState('');

  // Variables for edit list
  // const [editListName, setEditListName] = useState('');
  // const [editListContent, setEditListContent] = useState('');

  // Variables for return list
  const [returnListName, setReturnListName] = useState('');

  // Variables for delete list
  // const [deleteListName, setDeleteListName] = useState('');

  // Variables for search
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Variables for sort
  const [sortBy, setSortBy] = useState('none');
  const [displayNum, setDisplayNum] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const [expandedHeroes, setExpandedHeroes] = useState([]);

  const [listResults, setListResults] = useState([]);

  const [expandedList, setExpandedList] = useState([]);
  
  const [publicLists, setPublicLists] = useState([]);

  useEffect(() => {
    const fetchPublicLists = async () => {
      const response = await fetch('http://localhost:5001/superheroes/publiclists');
      const data = await response.json();
      setPublicLists(data);
    };
    fetchPublicLists();
  },[]);

  const searchbyField = async (field,name, n) => {
    if(!n){
      n = 7;
    };
    const response = await fetch(`http://localhost:5001/superheroes/search?field=${field}&pattern=${name}&n=${n}`);
    const data = await response.json();
    console.log(data);

    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
    }

    return data
  };

  // Function to handle search
  const handleSearch = async (searchField, searchQuery, displayNum) => {
    let n = searchNum(displayNum);
    const data = await searchbyField(searchField,searchQuery,n);
    setSearchResults(data);
  };

  // Function to handle return list
  const handleReturnList = async (listName) => {
    const response = await fetch(`http://localhost:5001/superheroes/lists/${listName}/superheroes`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
    }
    
    setListResults(data);
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
      return 7;
    }
    else if(isNaN(Number(n))){
      return 7;
    }else{
      return Number(n);
    };
  };
  // Function to handle sort
  // const handleSort = () => {
    
  // };

  // Function to handle clear
  const handleClear = () => {
    // Clear textboxes
    // setListName('');
    // setListContent('');
    // setEditListName('');
    // setEditListContent('');
    setReturnListName('');
    // setDeleteListName('');
    setSearchField('name');
    setSearchQuery('');
    setDisplayNum('');
    setListResults([]);

    // Clear search results
    setSearchResults([]);
    setExpandedHeroes([]);
  };
  
  // const handleListName = (event) =>{
  //   setListName(event.target.value);
  // };

  // const handleListContent = (event) =>{
  //   setListContent(event.target.value);
  // };

  // const handleEditListName = (event) =>{
  //   setEditListName(event.target.value);
  // };

  // const handleEditListContent = (event) =>{
  //   setEditListContent(event.target.value);
  // };

  const handleReturnListName = (event) =>{
    setReturnListName(event.target.value);
  };
  
  // const handleDeleteListName = (event) =>{
  //   setDeleteListName(event.target.value);
  // };

  const handleDisplayNum = (event) =>{
    setDisplayNum(event.target.value);
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

        <Link href='/loginPage'>
          <button type="button">Login</button>
        </Link>

        <Link href='/newPage'>
            <button type="button">Authenticate</button>
        </Link>

        <h1>Superheroes!</h1>

        <div className={styles.results} id = "results"></div>
        <div className={styles.favDiv}>
          <h2>Favourites List</h2>

          {/* CREATE LISTS */}
          {/* <div className={styles.createList}>
            <input type="text" value={listName} onChange={handleListName} placeholder="Enter List Name" />
            <input type="text" value={listContent} onChange={handleListContent} placeholder="Enter Hero IDs" />
            <button type="button" onClick={() =>handleCreateList(listName,listContent)}>Create List</button>
          </div> */}
        
          {/* EDIT LISTS */}
          {/* <div className={styles.editList}>
            <input type="text" value={editListName} onChange={handleEditListName} placeholder='Enter List Name'/>
            <input type="text" value={editListContent} onChange={handleEditListContent} placeholder='Enter Hero IDs'/>
            <button type="button" onClick={() =>handleEditList(editListName, editListContent)}>Edit List</button>
          </div> */}

          {/* RETURN LISTS */}
          <div className={styles.returnList}>
            <input type="text" value={returnListName} onChange={handleReturnListName} placeholder='Enter List Name'/>
            <button type="button" onClick={() =>handleReturnList(returnListName)}>Return List</button>
            {/* <button type="button" onClick={() =>handleDisplayList()}>Display List</button> */}
          </div>

          {/* <div className={styles.deleteList}>
            <input type="text" value={deleteListName} onChange={handleDeleteListName} placeholder='Enter List Name'/>
            <button type="button" onClick={() => handleDeleteList(deleteListName)}>Delete List</button>
          </div>*/}
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
          <div id="retrieveForm">
            <input type="text" value={displayNum} onChange={handleDisplayNum} placeholder="Number of Results" />
          </div>
        </div>

        <div id="heroSort">
          <h2>Sort Heroes By:</h2>
          <select value={sortBy} onChange={setSortBy}>
            <option value="none">None</option>
            <option value="name">Name</option>
            <option value="race">Race</option>
            <option value="publisher">Publisher</option>
            <option value="id">ID</option>
          </select>
        </div>

        <div id="displayDiv">
          <h2>Displayed SuperHeroes</h2>
          <button onClick={() =>handleClear}>Clear</button>
        </div>

        <h2>List Content:</h2>
        <div id="smallDisplay">
          {listResults && listResults.map((hero, index) => (
            <div key={index}>
              {hero.name}
              <button onClick={() =>{
                if (expandedList.includes(index)) {
                  setExpandedList(expandedList.filter(i => i !== index));
                } else {
                  setExpandedList([...expandedList, index]);
                }
              }}>
                Expand
              </button>
              {expandedList.includes(index) && (
                <div>
                  <div>Info: {JSON.stringify(hero.info)}</div>
                  <div>Powers: {JSON.stringify(hero.powers)}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>Search Results:</h2>
        <div id="heroDisplay">
          {searchResults.superheroes && searchResults.superheroes.map((hero, index) => (
          <div key={index}>
            {hero.name}
            <button onClick={() => {
              if (expandedHeroes.includes(index)) {
              setExpandedHeroes(expandedHeroes.filter(i => i !== index));
            } else {
              setExpandedHeroes([...expandedHeroes, index]);
            }
            }}>
            Expand
            </button>
            {expandedHeroes.includes(index) && (
            <div>
              <div>Info: {JSON.stringify(hero.info)}</div>
              <div>Powers: {JSON.stringify(hero.powers)}</div>
            </div>
            )}
          </div>
          ))}
        </div>
        
        <h2>Public Lists:</h2>
        <div id="publicListsDisplay">
          {publicLists && publicLists.map((list, index) => (
          <div key={index}>
            <div>List Name: {list.name}</div>
            <div>Author: {list.username}</div>
            <div>Number of Heroes: {list.heroes.length}</div>
            <button onClick={() => {
              if (expandedList.includes(index)) {
                setExpandedList(expandedList.filter(i => i !== index));
              } else {
                setExpandedList([...expandedList, index]);
              }
            }}>
            Expand
            </button>
            {expandedList.includes(index) && (
            <div>
              <div>List Name: {list.name}</div>
              <div>Heroes: {JSON.stringify(list.heroes)}</div>
            </div>
            )}
          </div>
          ))}
        </div>
      </main>
      </>
  )
}
