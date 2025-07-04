import React from 'react';
import { useState } from 'react';

export default function BatchForm({ onSubmit }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id, name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Batch ID" value={id} onChange={e => setId(e.target.value)} />
      <input placeholder="Batch Name" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

