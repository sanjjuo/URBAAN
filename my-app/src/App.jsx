import React from 'react';
import StoreContext from './StoreContext/StoreContext'; // Ensure correct import
import FullRoutes from './Routes';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from 'react-hot-toast';
import "./App.css"

const App = () => {

  return (
    <StoreContext>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            textTransform: 'normal-case',
            fontSize:'15px',
            maxWidth: '650px',
            width: 'auto',
            padding: '14px',
            height: 'auto',
          },
        }}
      />
      <FullRoutes />
    </StoreContext>
  );
};

export default App;
