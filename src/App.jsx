import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/client page/home'
import Aboute from './pages/client page/about'
import NotFound from './components/NotFound';
function App() {
  return (
    <BrowserRouter>
     <Routes>

     <Route path="/" element={<Home />} />
     <Route path="/about" element={<Aboute />} />


     <Route path="/*" element={<NotFound />} />

     </Routes>
    
    </BrowserRouter>
  );
}

export default App;
