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
          duration: 2000,
          style: {
            textTransform: 'capitalize',
            maxWidth: '650px',
            width: 'auto',
            padding: '20px',
            height: 'auto',
            color: '#000',
            backgroundColor: '#FFEDED',
          },
        }}
      />
      <FullRoutes />
    </StoreContext>
  );
};

export default App;
