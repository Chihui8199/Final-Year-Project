import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from 'src/context/UserContext';
import Error401 from '../../src/pages/401'


const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { user } = useUserContext();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      // Set isClient to true as this useEffect will only be run on the client.
      setIsClient(true);
    }, []);

    // If it is on the client and there is no user, redirect to login.
    if (isClient && !user) {
      setTimeout(() => {
        // Redirect to login page if on the client-side
        if (typeof window !== 'undefined') {
          router.replace('/insights/login');
        }
      }, 3000); 

      return <Error401/>;
    }

    // If it is on the server or user is logged in, render the WrappedComponent.
    if (!isClient || user) {
      return <WrappedComponent auth={!!user} {...props} />;
    }

    // Optionally return a loading component or null while waiting for client side to kick in.
    return null; // or <Loading />
  };
};

export default withAuth;
