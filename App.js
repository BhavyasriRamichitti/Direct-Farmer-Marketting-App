import React from 'react';
import { TailwindProvider } from 'tailwindcss-react-native';
import Layout from './path-to-Layout'; // Adjust the path accordingly

const App = () => {
  return (
    <TailwindProvider>
      <Layout />
    </TailwindProvider>
  );
};

export default App;
