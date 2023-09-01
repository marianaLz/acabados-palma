import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { Link, navigate } from 'gatsby';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  List,
  ListItem,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import { logout } from '../firebase/auth';

import logo from '../images/logo.png';

const Navbar = ({ secondary = false }) => {
  const auth = getAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Button as={Link} to='/all-quotes' variant='outline'>
            Regresar
          </Button>
        ) : (
          <Image alt='Acabados Palma' src={logo} w='48' />
        )}
        <IconButton
          aria-label='Menú'
          colorScheme='teal'
          fontSize='2xl'
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant='outline'
        />
      </Flex>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menú</DrawerHeader>

          <DrawerBody>
            <List spacing='4'>
              <ListItem
                borderRadius='md'
                px='4'
                py='2'
                _hover={{
                  bg: 'gray.100',
                }}
              >
                <Link to='/form-quote'>Crear un nuevo presupuesto</Link>
              </ListItem>
              <ListItem
                borderRadius='md'
                px='4'
                py='2'
                _hover={{
                  bg: 'gray.100',
                }}
              >
                <Link to='/all-quotes'>Ver todos mis presupuestos</Link>
              </ListItem>
            </List>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme='teal' onClick={handleLogout} w='full'>
              Cerrar sesión
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default Navbar;
