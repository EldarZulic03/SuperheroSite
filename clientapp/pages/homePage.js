import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import { set } from 'mongoose';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function HomePage() {
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

  const [searchResults, setSearchResults] = useState([]);

  const [expandedHeroes, setExpandedHeroes] = useState([]);

  const [listResults, setListResults] = useState([]);

  const [expandedList, setExpandedList] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditPublic, setIsEditPublic] = useState(false);

  const [userLists, setUserLists] = useState([]);
  const [username, setUsername] = useState('');

  // shows the user's lists
  useEffect(() => {
    const fetchUserNames = async () => {
      const token = localStorage.getItem('token');

      const userResponse = await fetch('http://localhost:5001/superheroes/verify/tokenEmail', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
      });
      if(!userResponse.ok){
        const errorData = await userResponse.json(); // Parse the error response to JSON
        console.error(`HTTP error! status: ${userResponse.status}, message: ${errorData.error}`); // Print the error message
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }
      const userData = await userResponse.json();
      return userData.username;
    };

    
    const fetchUserLists = async () => {
      const username = await fetchUserNames();
      const response = await fetch(`http://localhost:5001/superheroes/userlists/${username}`, {
        method: 'GET',
      });
      if(!response.ok){
        const errorData = await response.json();
        console.error(`HTTP error! status: ${response.status}, message: ${errorData.error}`); // Print the error message
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setUserLists(data);
      setUsername(username);
    };
    fetchUserLists();
  },[]);

  // Function to handle create list
  const handleCreateList = async (listName, heroIds, description, isPublic) => {
    // console.log('create button clicked');
    const heroIdsArray = heroIds.split(',').map(Number);
    
    const token = localStorage.getItem('token');

    const userResponse = await fetch('http://localhost:5001/superheroes/verify/tokenEmail', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if(!userResponse.ok){
        const errorData = await userResponse.json(); // Parse the error response to JSON
        console.error(`HTTP error! status: ${userResponse.status}, message: ${errorData.error}`); // Print the error message
        throw new Error(`HTTP error! status: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    const email = userData.email;

    const response = await fetch('http://localhost:5001/superheroes/newlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: listName,
        heroIds: heroIdsArray,
        description: description,
        isPublic: isPublic,
        email: email
      }),
    });
  
    if (!response.ok) {
        const errorData = await response.json(); // Parse the error response to JSON
        console.error(`HTTP error! status: ${response.status}, message: ${errorData.error}`); // Print the error message
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    alert(`List ${listName} created`);
    return data;
  };

  // Function to handle edit list
  const handleEditList = async (listName, heroIds, description, isPublic) => {
    // console.log('create button clicked');
    const heroIdsArray = heroIds.split(',').map(Number);
    
    const token = localStorage.getItem('token');

    const userResponse = await fetch('http://localhost:5001/superheroes/verify/tokenEmail', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if(!userResponse.ok){
        const errorData = await userResponse.json(); // Parse the error response to JSON
        console.error(`HTTP error! status: ${userResponse.status}, message: ${errorData.error}`); // Print the error message
        throw new Error(`HTTP error! status: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    const email = userData.email;

    const response = await fetch(`http://localhost:5001/superheroes/newlists/${listName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: listName,
        heroIds: heroIdsArray,
        description: description,
        isPublic: isPublic,
        email: email
      }),
    });
  
    if (!response.ok) {
        const errorData = await response.json(); // Parse the error response to JSON
        console.error(`HTTP error! status: ${response.status}, message: ${errorData.error}`); // Print the error message
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    alert(`List ${listName} edited`);
    return data;
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
  const handleSort = () => {
    
  };

  // Function to handle clear
  const handleClear = () => {
    window.location.reload();
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

  const handleDisplayNum = (event) =>{
    setDisplayNum(event.target.value);
  };
  
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePublicChange = (event) =>{
    setIsPublic(event.target.checked);
  }

  const handleEditDescriptionChange = (event) => {
    setEditDescription(event.target.value);
  };

  const handleEditPublicChange = (event) =>{
    setIsEditPublic(event.target.checked);
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
        <h3>Welcome! You Are Logged In, Have Fun!</h3>
        <Link href='/'>Public Home Page</Link>
        <div className={styles.results} id = "results"></div>
        <div className={styles.favDiv}>
          <h2>Favourites List</h2>

          {/* CREATE LISTS */}
          <div className={styles.createList}>
            <input type="text" value={listName} onChange={handleListName} placeholder="Enter List Name" />
            <input type="text" value={listContent} onChange={handleListContent} placeholder="Enter Hero IDs" />
            <input type="text" value={description} onChange={handleDescriptionChange} placeholder='Enter Description'/>
            <input type='checkbox' checked={isPublic} onChange={handlePublicChange}/>Public
            <button type="button" onClick={() =>handleCreateList(listName,listContent,description,isPublic)}>Create List</button>
          </div>
        
          {/* EDIT LISTS */}
          <div className={styles.editList}>
            <input type="text" value={editListName} onChange={handleEditListName} placeholder='Enter List Name'/>
            <input type="text" value={editListContent} onChange={handleEditListContent} placeholder='Enter Hero IDs'/>
            <input type='text' value={editDescription} onChange={handleEditDescriptionChange} placeholder='Enter Description'/>
            <input type='checkbox' checked={isEditPublic} onChange={handleEditPublicChange}/>Public
            <button type="button" onClick={() =>handleEditList(editListName, editListContent, editDescription,isEditPublic)}>Edit List</button>
          </div>

          {/* RETURN LISTS */}
          <div className={styles.returnList}>
            <input type="text" value={returnListName} onChange={handleReturnListName} placeholder='Enter List Name'/>
            <button type="button" onClick={() =>handleReturnList(returnListName)}>Return List</button>
            {/* <button type="button" onClick={() =>handleDisplayList()}>Display List</button> */}
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

        <h2>Your Lists: </h2>
        <div id="userLists">
          {Array.isArray(userLists) && userLists.length >0 && userLists.map((list, index) => {
            const averageRating = list.ratings.length > 0 ? 
            list.ratings.reduce((a, b) => a + b, 0) / list.ratings.length : 
            0;
            
            return(
              <div key={index}>
                <div>List Name: {list.name}</div>
                <div>Author: {list.username}</div>
                <div>Number of Heroes: {list.heroes.length}</div>
                <div>Average Rating: {averageRating}</div>
                <div> isPublic: {list.isPublic ? 'true' : 'false'}</div>
                <button onClick={() =>{
                  if (expandedList.includes(index)) {
                    setExpandedList(expandedList.filter(i => i !== index));
                  } else {
                    setExpandedList([...expandedList, index]);
                  }
                }}>Expand</button>
                {expandedList.includes(index) && (
                  <div>
                    <div>List Name: {list.name}</div>
                    <div>Heroes: 
                      {list.heroes.map((hero, heroIndex)=>(
                        <div key={heroIndex}>
                          <div>Name: {hero.name}</div>
                          <div>Info: 
                            <ul>
                              {Object.keys(hero.info).map((key,i)=>(
                                <li key={i}>{key}: {hero.info[key]}</li>
                              ))}
                            </ul>
                          </div>
                          <div>Powers:
                            <ul>
                              {Object.keys(hero.powers).map((key,i)=>(
                                <li key={i}>{key}: {hero.powers[key]}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })};
        </div>
      </main>
      </>
  )
}
