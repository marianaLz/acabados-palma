import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { Link as RouterLink, navigate } from 'gatsby';

import {
  Container,
  Flex,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import Loader from '../components/loader';
import Navbar from '../components/navbar';

import { formatDate } from '../utils';
import { getQuotes } from '../firebase/quotes';

const AllQuotes = () => {
  const { currentUser } = getAuth();
  const [loading, setLoading] = React.useState(true);
  const [quotes, setQuotes] = React.useState([]);

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  React.useEffect(() => {
    getQuotes().then((res) => {
      setLoading(false);
      setQuotes(res);
    });
  }, []);

  return (
    <Container as='main'>
      <Navbar />
      <Flex justify='center' mb='8'>
        {loading ? (
          <Loader />
        ) : (
          <Table size={{ base: 'sm', lg: 'md' }} variant='striped'>
            <Thead>
              <Tr>
                <Th>Presupuesto</Th>
                <Th>Cliente</Th>
                <Th isNumeric>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {quotes?.map(({ name, client, date }, index) => (
                <Tr key={`quote-${index}`}>
                  <Td>{name}</Td>
                  <Td>{client}</Td>
                  <Td isNumeric>{formatDate(date)}</Td>
                  <Td>
                    <Link
                      display='flex'
                      as={RouterLink}
                      color='teal.500'
                      to='/quote'
                    >
                      Ver
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Flex>
    </Container>
  );
};

export default AllQuotes;
