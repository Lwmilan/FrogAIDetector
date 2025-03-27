import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

const ChatBox = ({ species }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    const currentQuery = query;
    if (!currentQuery.trim()) return;

    // Append the user's message to the conversation and clear the input immediately
    const userMessage = { role: 'user', text: currentQuery };
    setConversation(prev => [...prev, userMessage]);
    setQuery(''); // Clear the input field right away

    // Create the payload with the current query (captured before clearing) and conversation history.
    const payload = {
      species,
      query: currentQuery,
      conversation: [...conversation, userMessage]
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error fetching chat response');
      }
      const data = await response.json();
      
      // Append the bot's response to the conversation
      setConversation(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error in chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5" gutterBottom>
        Chat about: {species}
      </Typography>
      <Paper sx={{ maxHeight: 300, overflowY: 'auto', padding: 2, marginBottom: 2 }}>
        {conversation.map((msg, index) => (
          <Box key={index} sx={{ marginBottom: 1 }}>
            <Typography variant="subtitle2" color={msg.role === 'user' ? 'primary' : 'secondary'}>
              {msg.role === 'user' ? 'You' : 'Bot'}:
            </Typography>
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Paper>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Type your question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button variant="contained" sx={{ marginTop: 1 }} onClick={sendMessage}>
        Send
      </Button>
    </Box>
  );
};

export default ChatBox;

