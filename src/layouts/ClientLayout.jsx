import Navbar from '../components/client/Navbar.jsx';
import Footer from '../components/client/Footer.jsx';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default ClientLayout;
