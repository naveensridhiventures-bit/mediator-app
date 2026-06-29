import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import BuyForm from './pages/BuyForm';
import SellForm from './pages/SellForm';
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import ThankYou from './pages/ThankYou';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/buy" element={<BuyForm />} />
        <Route path="/sell" element={<SellForm />} />
        <Route path="/listings" element={<Marketplace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
