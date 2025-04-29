import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import SwapPage from '../pages/SwapPage';
import PoolPage from '../pages/PoolPage';
import TokenDetailPage from '../pages/TokenDetailPage';
import LandingLayout from '../pages/LandingLayout';
import AppLayout from '../components/layout/AppLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing route using new layout */}
      <Route path="/" element={
        <>
          <Header />
          <LandingLayout />
        </>
      } />

      {/* App routes with expanded functionality */}
      <Route element={<AppLayout />}>
        {/* Swap routes */}
        <Route path="/swap" element={<SwapPage initialTab="swap" />} />
        <Route path="/swap/:tab" element={<SwapPage />} />
        
        {/* Pool routes */}
        <Route path="/pool" element={<PoolPage />} />
        
        {/* Token detail route */}
        <Route path="/tokens/:tokenId" element={<TokenDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;