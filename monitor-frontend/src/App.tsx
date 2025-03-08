import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Monitor from './components/Monitor';
import Notifications from './components/Notifications';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/monitor" element={<Monitor />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </Router>
    );
};

export default App;