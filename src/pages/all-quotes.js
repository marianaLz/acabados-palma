import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { navigate } from 'gatsby';

import { Container } from '@chakra-ui/react';

import Navbar from '../components/navbar';

const AllQuotes = () => {
  const { currentUser } = getAuth();

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  return (
    <Container as='main'>
      <Navbar />
    </Container>
  );
};

export default AllQuotes;
