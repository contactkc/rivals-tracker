import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then((res) => res.text())
      .then((data) => console.log(data));
  }, []);

  return (
    <>
      <h1>Hello World!</h1>
    </>
  )
}

export default App
