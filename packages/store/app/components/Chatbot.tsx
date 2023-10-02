import {useState} from 'react';
import styles from './Chatbot.module.css';
import {useLoaderData} from '@remix-run/react';

export const Chatbot = () => {
  const {chatbotUrl} = useLoaderData();
  const [display, setDisplay] = useState(false);

  const toggleDisplay = () => setDisplay(!display);

  return (
    !!chatbotUrl && (
      <div className={styles.chatbot}>
        <button onClick={toggleDisplay}>Chat</button>
        {display && <iframe title="chatbot" src={chatbotUrl}></iframe>}
      </div>
    )
  );
};
