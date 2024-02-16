import React from 'react';
import { getAuth } from 'firebase/auth';
import { Link, navigate } from 'gatsby';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import Loader from '../components/loader';
import Navbar from '../components/navbar';

import { formatDate } from '../utils';
import { deleteDocument, getDocument } from '../firebase/documents';

import firma from '../images/firma.png';
import logo from '../images/logo.png';

import '../index.css';

const Warranty = ({ location: { search } }) => {
  const { currentUser } = getAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = React.useState(true);
  const [warranty, setWarranty] = React.useState({});

  const cancelRef = React.useRef();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const toast = useToast();

  const printDoc = () => {
    window.print();
  };

  const handleDelete = () => {
    deleteDocument('warranties', id).then(() => {
      toast({
        title: 'Todo salió bien',
        description: 'Presupuesto eliminado de manera exitosa',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/all-documents');
      onClose();
    });
  };

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  React.useEffect(() => {
    getDocument('warranties', id).then((res) => {
      setLoading(false);
      setWarranty(res);
    });
  }, [id]);

  const renderSignature = (isFirst, hasDigitalSignature) => (
    <Flex
      align='center'
      flexDir='column'
      gap='1'
      key={isFirst ? 'signature-0' : 'signature-1'}
      mt={isFirst && hasDigitalSignature ? '0' : '20'}
      textAlign='center'
    >
      {isFirst && hasDigitalSignature && (
        <Image alt='Acabados Palma' mb='-20' src={firma} w='28' />
      )}
      <Divider w='56' />
      <Text fontWeight='semibold' textAlign='center'>
        {isFirst
          ? 'CARLOS ALBERTO PALMA BALLINA'
          : warranty.client.toUpperCase()}
      </Text>
    </Flex>
  );

  const renderSignatures = (hasDigitalSignature, requiresTwoSignatures) =>
    requiresTwoSignatures ? (
      <Flex align='flex-end' gap='16'>
        {Array.from({ length: 2 }).map((_, index) =>
          renderSignature(index === 0, hasDigitalSignature)
        )}
      </Flex>
    ) : (
      renderSignature(true, hasDigitalSignature)
    );

  return (
    <Container as='main' maxW='container.md'>
      <Navbar secondary />
      <Flex align='center' flexDir='column' gap='8' justify='center'>
        {loading ? (
          <Loader />
        ) : (
          <Flex
            align='center'
            flexDir='column'
            fontSize='xs'
            gap='12'
            id='document'
            w='full'
          >
            <Flex align='center' gap='8' justify='space-between' w='full'>
              <Image alt='Acabados Palma' src={logo} w='56' />
              <Flex flexDir='column'>
                <Text>
                  Fecha:{' '}
                  <Text as='span' fontWeight='medium'>
                    {formatDate(warranty.date, 'long')}
                  </Text>
                </Text>
                <Text>
                  Atención:{' '}
                  <Text as='span' fontWeight='medium'>
                    {warranty.client}
                  </Text>
                </Text>
              </Flex>
            </Flex>
            <Flex flexDir='column' gap='4'>
              <Text align='center' fontSize='sm' fontWeight='semibold'>
                {warranty.name}
              </Text>
              {warranty.paragraphs?.map((paragraph, index) => (
                <Text key={`paragraph-${index}`}>{paragraph}</Text>
              ))}
            </Flex>

            {renderSignatures(
              warranty.hasDigitalSignature === 'true',
              warranty.requiresTwoSignatures === 'true'
            )}

            <Flex fontSize='2xs' gap='4' justify='center'>
              <Text>(55) 3450 4035</Text>
              <Text>(55) 8410 0093</Text>
              <Text>capb_interiorismo@hotmail.com</Text>
            </Flex>
            <Flex
              align='center'
              className='no-printme'
              flexDir='column'
              gap='4'
              mb='8'
            >
              <Flex gap='4'>
                <Button as={Link} to={`/form-warranty?id=${id}`}>
                  Modificar
                </Button>
                <Button colorScheme='teal' onClick={printDoc}>
                  Imprimir
                </Button>
              </Flex>
              <Divider />
              <Button color='red.500' onClick={onOpen} size='sm' variant='link'>
                Eliminar
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Eliminar presupuesto
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de eliminar este presupuesto?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default Warranty;
