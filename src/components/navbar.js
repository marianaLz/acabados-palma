import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { Link, navigate } from 'gatsby';

import { Button, Flex, IconButton, Image } from '@chakra-ui/react';
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';

import { logout } from '../firebase/auth';

import logo from '../images/logo.png';

const Navbar = ({ secondary = false }) => {
  const auth = getAuth();

  const handleLogout = () => logout(auth).then(() => navigate('/'));

  return (
    <React.Fragment>
      <Flex
        align='center'
        className='no-printme'
        justify='space-between'
        mb='4'
        py='2'
      >
        {secondary ? (
          <Button
            as={Link}
            leftIcon={<ArrowBackIcon />}
            to='/all-quotes'
            variant='outline'
          >
            Regresar
          </Button>
        ) : (
          <Image alt='Acabados Palma' src={logo} w='48' />
        )}
        <Flex gap={{ base: '2', lg: '4' }}>
          {!secondary && (
            <IconButton
              as={Link}
              colorScheme='teal'
              to='/form-quote'
              icon={<AddIcon />}
            />
          )}
          <Button colorScheme='teal' onClick={handleLogout} variant='outline'>
            Salir
          </Button>
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default Navbar;
