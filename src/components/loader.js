import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';

const Loader = () => {
  return (
    <Flex align='center' justify='center' my='12'>
      <Heading size='md'>Cargando...</Heading>
    </Flex>
  );
};

export default Loader;
