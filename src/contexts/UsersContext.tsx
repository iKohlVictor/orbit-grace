import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockUsers, type MockUser } from "@/data/mock-users";

interface UsersContextValue {
  users: MockUser[];
  addUser: (user: Omit<MockUser, "id">) => MockUser;
  updateUser: (id: string, data: Partial<Omit<MockUser, "id">>) => void;
  deleteUser: (id: string) => void;
}

const UsersContext = createContext<UsersContextValue | null>(null);

let nextId = mockUsers.length + 100;

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<MockUser[]>(() => [...mockUsers]);

  const addUser = useCallback((data: Omit<MockUser, "id">): MockUser => {
    const newUser: MockUser = { ...data, id: String(nextId++) };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, []);

  const updateUser = useCallback((id: string, data: Partial<Omit<MockUser, "id">>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
}
