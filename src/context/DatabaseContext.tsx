import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('contexts.db');

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = () => {
    db.transaction(tx => {
      // Create conversations table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );

      // Create contexts table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS contexts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          conversation_id INTEGER,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (conversation_id) REFERENCES conversations (id)
        )`
      );

      // Create files table for offline storage
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          context_id INTEGER,
          name TEXT,
          content TEXT,
          language TEXT,
          FOREIGN KEY (context_id) REFERENCES contexts (id)
        )`
      );
    }, error => {
      console.error('Database initialization error:', error);
    }, () => {
      setInitialized(true);
    });
  };

  const saveContext = async (context, conversationId = null) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // If no conversation ID, create a new conversation
        if (!conversationId) {
          tx.executeSql(
            'INSERT INTO conversations (title) VALUES (?)',
            ['New Conversation'],
            (_, { insertId: newConversationId }) => {
              conversationId = newConversationId;
            }
          );
        }

        // Save context
        tx.executeSql(
          'INSERT INTO contexts (conversation_id, content) VALUES (?, ?)',
          [conversationId, JSON.stringify(context)],
          (_, { insertId: contextId }) => {
            // Save files
            context.files.forEach(file => {
              tx.executeSql(
                'INSERT INTO files (context_id, name, content, language) VALUES (?, ?, ?, ?)',
                [contextId, file.name, file.content, file.language]
              );
            });
            resolve(contextId);
          }
        );
      }, reject);
    });
  };

  const searchContexts = (query) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT c.*, co.content, co.created_at
           FROM conversations c
           JOIN contexts co ON c.id = co.conversation_id
           WHERE c.title LIKE ? OR co.content LIKE ?`,
          [`%${query}%`, `%${query}%`],
          (_, { rows: { _array } }) => resolve(_array)
        );
      }, reject);
    });
  };

  const value = {
    initialized,
    saveContext,
    searchContexts,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => useContext(DatabaseContext);