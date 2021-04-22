import React, { useEffect } from 'react';
import { Widget, addResponseMessage, deleteMessages, markAllAsRead, toggleInputDisabled, toggleMsgLoader } from 'react-chat-widget';
import constants from './constants.js';
import 'react-chat-widget/lib/styles.css';

const SERVER = constants.server_url;

//de sters comentariile aici
//verificare custommenubar - covid => de sters
//de sters in app.js

function ChatBot() {

    // useEffect(() => {
    //     addResponseMessage('Welcome to this awesome chat!');
    // }, []);

    const handleNewUserMessage = async (newMessage) => {
        try {
            //mesaj litere mici
            toggleInputDisabled();
            toggleMsgLoader();

            const response = await fetch(`${SERVER}/diagnostics/chatbot`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: newMessage.toLowerCase() })
            });

            const data = await response.json();

            if (response.status === 201) {
                toggleInputDisabled();
                toggleMsgLoader();
                addResponseMessage(data.answer)

            } else {
                toggleInputDisabled();
                toggleMsgLoader();
                addResponseMessage("There was an error in receiving your message")
            }
        } catch (err) {
            toggleInputDisabled();
            toggleMsgLoader();
            addResponseMessage("There was an error in receiving your message")
        }
    };

    return (
        <div>
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                subtitle="Ask questions about COVID-19 to stay informed"
            />
        </div>
    );
}

export default ChatBot;