// components/Layout.js
import React from 'react';
import withAuth from'../../hoc/auth'
import Error401 from  '../../pages/401'

const Layout = ({ auth, children }) => {
  return (
    <div>
      {auth ? (
        <>
          {/* Render Protected page */}
          {children}
        
        </>
      ) : (
        <Error401/>
       
      )}
    </div>
  );
};

export default withAuth(Layout);
