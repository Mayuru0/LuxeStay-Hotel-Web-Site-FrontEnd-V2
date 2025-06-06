import React from 'react';
import SideBar from './sideBar';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../../pages/admin page/dashboard/dashboard';
import AdminBooking from '../../pages/admin page/booking/booking';
import AdminCategories from '../../Pages/Admin Page/Categories/categories';
import AdminFeedback from '../../Pages/Admin Page/Feedback/feedback';
import AdminGallery from '../../Pages/Admin Page/Gallery/gallery';
import AdminUser from '../../Pages/Admin Page/Users/user';
import AdminRooms from '../../Pages/Admin Page/Rooms/rooms';

const LayOut = () => {
  return (
    <div className="w-full max-h-[100vh] overflow-hidden flex">
      <div className="w-[20%] h-[100vh] bg-blue-400">
        <SideBar />
      </div>

      <div className="w-[80%] max-h-[100vh] overflow-y-scroll bg-slate-900 text-white p-5">
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/booking" element={<AdminBooking />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/rooms" element={<AdminRooms />} />
          <Route path="/users" element={<AdminUser />} />
          <Route path="/feedback" element={<AdminFeedback />} />
          <Route path="/gallery" element={<AdminGallery />} />
        </Routes>
      </div>
    </div>
  );
};

export default LayOut;
