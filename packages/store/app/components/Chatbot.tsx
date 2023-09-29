import { useState } from "react"
import styles from './Chatbot.module.css'
import { useLoaderData } from "@remix-run/react"

export const Chatbot = () => {
  const {chatbotUrl} = useLoaderData()
  const [display, setDisplay] = useState(false)

  const toggleDisplay = () => setDisplay(!display)

  console.log({chatbotUrl})
  return (
  <div className={styles.chatbot}>
      <button onClick={toggleDisplay}>Chat</button>
      {display && (
      <iframe src={chatbotUrl}></iframe>
      )}

    </div>
  )
}


