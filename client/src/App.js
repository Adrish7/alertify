import React, {useState} from 'react';
import {Header} from './components/layout/Header';
import Content from './components/layout/Content';
import { ProjectsProvider, SelectedProjectProvider } from './context';


function App() {

  const [darkMode, setDarkMode] = useState(false);
// put header above content
  return (
    <SelectedProjectProvider>
      <ProjectsProvider>
        <main
        data-testid="application"
        className={darkMode ? 'darkmode' : undefined}
        >

        <Content />

        </main>

      </ProjectsProvider> 
    </SelectedProjectProvider>
  );
}

export default App;
