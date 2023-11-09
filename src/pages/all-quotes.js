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
      setQuotes(res.sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
  }, []);

  return (
    <Container as='main' maxW='container.md'>
      <Navbar />
      <Flex justify='center' mb='8'>
        {loading ? (
          <Loader />
        ) : (
          <Table size='sm' variant='striped'>
            <Thead>
              <Tr>
                <Th>Presupuesto</Th>
                <Th>Cliente</Th>
                <Th isNumeric>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {quotes?.map(({ name, client, date, id }, index) => (
                <Tr key={`quote-${index}`}>
                  <Td>{name}</Td>
                  <Td>{client}</Td>
                  <Td isNumeric>{formatDate(date)}</Td>
                  <Td>
                    <Link
                      display='flex'
                      as={RouterLink}
                      color='teal.500'
                      to={`/quote?id=${id}`}
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
