import {useEffect, useState } from "react";

const App = () => {

    const [message, setMessage] = useState('');
    const [value, setValue] = useState('');
    const [oldChat, setOldChat] = useState([]);
    const [currentChat, setCurrentChat] = useState('');

    const createNewChat = () => {
      setMessage('');
      setValue('');
      setCurrentChat('');
    }

    const handleClick = (uniqueTitle) => {
      setCurrentChat(uniqueTitle);
      setMessage('');
      setValue('');
    }

    const getMessages = async () => {
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: value,
        })
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      //console.log("DATA: ", data);
      setMessage(data.choices[0].message);
    }
    catch(err){
        console.log("Error:", err);
    }
  }

  console.log("VAL: ", message);

  useEffect(() => {
    if(!currentChat && value && message) {
      setCurrentChat(value)
    }
    
    if(currentChat && value && message) {
      setOldChat(oldChat => (
        [...oldChat,
          {
            title: currentChat,
            role: "user",
            content: value
          },
          {
            title: currentChat,
            role: message.role,
            content: message.content
          }
        ]

      ))
    }

  }, [message, currentChat])

  console.log("prevch::", oldChat);

  const activeChat = oldChat.filter(oldChat => oldChat.title === currentChat)
  const uniqueTitles = Array.from(new Set(oldChat.map(oldChat => oldChat.title)));

  console.log("UT::", uniqueTitles);

  return (
    <div className="App">
      <section className='left-side'>
        <button onClick={createNewChat}>start chat +</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={ () => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
      </section>
      <section className='right-side'>
        <h1>Chat</h1>
        <ul className="feed">
          {activeChat?.map((chatMessage, index) => <li key={index}>
              <p>{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom">
          <div className="input-wrapper">
            <input value={value} onChange={e => setValue(e.target.value)}></input>
            <div id="submit" onClick={getMessages}>send</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
