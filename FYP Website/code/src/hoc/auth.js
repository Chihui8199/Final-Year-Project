import React from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from 'src/context/UserContext'

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { user } = useUserContext();

    //check whether the JavaScript code is running in a browser 
    if (!user) { // If user is not logged in
      setTimeout(() => {
        // Redirect to login page if on the client-side
        if (typeof window !== 'undefined') {
          router.replace('/insights/login');
        }
      }, 2000); // 3000 milliseconds (3 seconds)

      return null; // Do not render anything
    }

    // If user is logged in, render the WrappedComponent
    return <WrappedComponent auth={!!user} {...props} />;
  };
};

export default withAuth;
