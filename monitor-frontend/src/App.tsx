import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Monitor from './components/Monitor';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Monitor />} />
            </Routes>
        </Router>
    );
};

export default App;