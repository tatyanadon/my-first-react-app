import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useState, useCallback } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { UserList, UserForm } from './components';
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [editingUser, setEditingUser] = useState(null);

  const handleUserEditClick = useCallback((user) => {
    setEditingUser(user)
  }, [])


  const handleFormCancelClick = useCallback(() => {
    setEditingUser(null)
  }, [])
  
  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <UserForm editingUser={editingUser} onCancel={handleFormCancelClick} />
        <hr />
        <UserList handleUserEditClick={handleUserEditClick} />
      </QueryClientProvider>
    </PrimeReactProvider>
  );
}

export default App;
