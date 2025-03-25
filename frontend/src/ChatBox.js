import React, { useState } from 'react';

const ChatBox = ({ species }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    if (!query.trim()) return;
    
    // Append the user's message to the conversation
    const updatedConversation = [
      ...conversation,
      { role: 'user', text: query }
    ];
    setConversation(updatedConversation);
    
    // Prepare the payload including the species and conversation history if needed
    const payload = {
      species,
      query,
      conversation: updatedConversation
    };

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error fetching chat response');
      }
      const data = await response.json();
      
      // Append the bot's response to the conversation
      setConversation(prev => [
        ...prev,
        { role: 'bot', text: data.response }
      ]);
      setQuery('');
    } catch (error) {
      console.error('Error in chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Ask about the species: {species}</h3>
      <div style={{ border: '1px solid #ccc', padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
        {conversation.map((msg, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <textarea
        rows="3"
        style={{ width: '100%', marginTop: '1rem' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your question here..."
      />
      <button onClick={sendMessage} style={{ marginTop: '0.5rem' }}>Send</button>
    </div>
  );
};

export default ChatBox;
