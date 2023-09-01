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
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import Loader from '../components/loader';
import Navbar from '../components/navbar';

import { calculateTotalPrice, formatDate, formatPrice } from '../utils';
import { deleteQuote, getQuote } from '../firebase/quotes';

import logo from '../images/logo.png';

import '../index.css';

const Quote = ({ location: { search } }) => {
  const { currentUser } = getAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = React.useState(true);
  const [quote, setQuote] = React.useState({});

  const cancelRef = React.useRef();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const toast = useToast();

  const printDoc = () => {
    window.print();
  };

  const handleDelete = () => {
    deleteQuote(id).then(() => {
      toast({
        title: 'Todo salió bien',
        description: 'Presupuesto eliminado de manera exitosa',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/all-quotes');
      onClose();
    });
  };

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  React.useEffect(() => {
    getQuote(id).then((res) => {
      setLoading(false);
      setQuote(res);
    });
  }, [id]);

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
                    {formatDate(quote.date, 'long')}
                  </Text>
                </Text>
                <Text>
                  Presupuesto:{' '}
                  <Text as='span' fontWeight='medium'>
                    {quote.name}
                  </Text>
                </Text>
                <Text>
                  Atención:{' '}
                  <Text as='span' fontWeight='medium'>
                    {quote.client}
                  </Text>
                </Text>
              </Flex>
            </Flex>
            <Table variant='striped'>
              <Thead>
                <Tr>
                  <Th>Concepto</Th>
                  <Th>Cantidad</Th>
                  <Th>Unidad</Th>
                  <Th minW='65px'>P. Unit.</Th>
                  <Th>Importe</Th>
                </Tr>
              </Thead>
              <Tbody>
                {quote.products?.map(
                  ({ concept, quantity, unit, price }, index) => (
                    <Tr key={`quote-${index}`}>
                      <Td>{concept}</Td>
                      <Td>{quantity}</Td>
                      <Td>{unit}</Td>
                      <Td>{formatPrice(price)}</Td>
                      <Td>{formatPrice(quantity * price)}</Td>
                    </Tr>
                  )
                )}
                {quote.hasTotalCalc === 'true' && (
                  <Tr>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td fontWeight='bold' isNumeric>
                      TOTAL
                    </Td>
                    <Td>{calculateTotalPrice(quote.products)}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Flex flexDir='column' gap='1' w='full'>
              <Text>Notas:</Text>
              <UnorderedList>
                {quote.notes?.map((note, index) => (
                  <ListItem key={`note-${index}`}>{note}</ListItem>
                ))}
                <ListItem>
                  {`Para ejecutar dichos trabajos, se requiere un anticipo del
                  ${quote.advancePaymentRate}%, el resto se cobrará conforme al
                  avance de obra`}
                </ListItem>
                <ListItem>
                  {`El tiempo de entrega es de ${quote.deliveryTime} días hábiles`}
                </ListItem>
                <ListItem>
                  {`Esta cotización tiene una vigencia de ${quote.validity} días
                  hábiles a partir de la fecha en la misma`}
                </ListItem>
              </UnorderedList>
            </Flex>
            <Flex flexDir='column' fontWeight='bold' textAlign='center'>
              <Text fontSize='2xs' letterSpacing='widest'>
                ATENTAMENTE
              </Text>
              <Text>CARLOS ALBERTO PALMA BALLINA</Text>
            </Flex>
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
                <Button as={Link} to={`/form-quote?id=${id}`}>
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

export default Quote;
