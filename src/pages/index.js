import * as React from 'react';
import * as Yup from 'yup';
import { getAuth } from 'firebase/auth';
import { navigate } from 'gatsby';
import { useFormik } from 'formik';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { login } from '../firebase/auth';

import logo from '../images/logo.png';

const IndexPage = () => {
  const toast = useToast();
  const { currentUser } = getAuth();

  const [show, setShow] = React.useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo inválido')
        .required('Este campo es requerido'),
      password: Yup.string().required('Este campo es requerido'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      login(values).then(({ response, msg }) => {
        setSubmitting(false);
        if (response === 'error') {
          toast({
            title: 'Error',
            description: msg,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        } else {
          navigate('/all-quotes');
        }
      });
    },
  });

  const handleShow = () => setShow(!show);

  React.useEffect(() => {
    if (currentUser) navigate('/all-quotes');
  }, [currentUser]);

  return (
    <Container as='main' maxW='container.md'>
      <Flex align='center' justify='center' minH='100vh'>
        <Card as='form' onSubmit={formik.handleSubmit} w='sm'>
          <CardHeader
            align='center'
            as={Flex}
            flexDir='column'
            gap='4'
            justify='center'
          >
            <Image alt='Acabados Palma' maxW='48' src={logo} w='full' />
            <Heading color='blackAlpha.800'>Inicia sesión</Heading>
          </CardHeader>
          <CardBody as={Flex} flexDir='column' gap='4'>
            <FormControl isInvalid={!!formik.errors.email}>
              <FormLabel>Correo</FormLabel>
              <Input
                id='email'
                name='email'
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder='nombre@example.com'
                type='email'
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!formik.errors.password}>
              <FormLabel>Contraseña:</FormLabel>
              <InputGroup size='md'>
                <Input
                  id='password'
                  name='password'
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='Contraseña'
                />
                <InputRightElement width='4.5rem'>
                  <IconButton
                    bgColor={'transparent'}
                    icon={
                      show ? (
                        <ViewOffIcon w={5} h={5} color={'gray.500'} />
                      ) : (
                        <ViewIcon w={5} h={5} color={'gray.500'} />
                      )
                    }
                    color={'white'}
                    aria-label={show ? 'Hide' : 'Show'}
                    _hover={{ bgColor: 'gray.100' }}
                    onClick={handleShow}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <Button
              colorScheme='teal'
              isLoading={formik.isSubmitting}
              loadingText='Iniciando sesión'
              type='submit'
            >
              Iniciar sesión
            </Button>
          </CardBody>
        </Card>
      </Flex>
    </Container>
  );
};

export default IndexPage;

export const Head = () => <title>Acabados Palma</title>;
