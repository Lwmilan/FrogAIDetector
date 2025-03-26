import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

const ChatBox = ({ species }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    if (!query.trim()) return;
    
    // Add user's message to conversation
    const updatedConversation = [...conversation, { role: 'user', text: query }];
    setConversation(updatedConversation);
    
    const payload = { species, query, conversation: updatedConversation };

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
      
      // Add bot's reply to conversation
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
