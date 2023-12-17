import * as React from 'react';
import * as Yup from 'yup';
import { getAuth } from 'firebase/auth';
import { navigate } from 'gatsby';
import { FieldArray, FormikProvider, useFormik } from 'formik';

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

import Navbar from '../components/navbar';

import {
  createDocument,
  getDocument,
  updateDocument,
} from '../firebase/documents';

const FormWarranty = ({ location: { search } }) => {
  const params = new URLSearchParams(search);
  const id = params.get('id');

  const toast = useToast();
  const { currentUser } = getAuth();
  const [quote, setQuote] = React.useState({});

  const request = !!id ? updateDocument : createDocument;

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: !!id
      ? quote
      : {
          name: '',
          client: '',
          date: '',
          paragraphs: [],
        },
    validationSchema: Yup.object({
      name: Yup.string().required('Este campo es requerido'),
      client: Yup.string().required('Este campo es requerido'),
      date: Yup.string().required('Este campo es requerido'),
      paragraphs: Yup.array().required('Este campo es requerido'),
    }),
    onSubmit: (values, { resetForm, setSubmitting }) => {
      request('warranties', values, id).then(() => {
        setSubmitting(false);
        toast({
          title: 'Todo salió bien',
          description: `Garantía ${
            !!id ? 'modificada' : 'creada'
          } de manera exitosa`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        resetForm({ values: formik.initialValues });
        navigate('/all-documents');
      });
    },
  });

  React.useEffect(() => {
    !!id &&
      getDocument('warranties', id).then((res) => {
        setQuote(res);
      });
  }, [id]);

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  return (
    <Container as='main' maxW='container.md'>
      <Navbar secondary />
      <Flex mb='8'>
        <Box as='form' onSubmit={formik.handleSubmit} w='full'>
          <Flex align='center' flexDir='column' gap='4'>
            <Heading textAlign='center' color='blackAlpha.800' size='lg'>
              {!!id ? 'Modifica tu garantía' : 'Crea tu garantía'}
            </Heading>
            <FormControl isInvalid={!!formik.errors.name}>
              <FormLabel>Nombre de la garantía:</FormLabel>
              <Input
                name='name'
                onChange={formik.handleChange}
                placeholder='Ej. Garantía de colocación de piso'
                value={formik.values.name}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <Flex flexDir={{ base: 'column', lg: 'row' }} gap='4' w='full'>
              <FormControl isInvalid={!!formik.errors.client}>
                <FormLabel>Cliente:</FormLabel>
                <Input
                  name='client'
                  onChange={formik.handleChange}
                  placeholder='Ej. Srita. Mariana López'
                  value={formik.values.client}
                />
                <FormErrorMessage>{formik.errors.client}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.date}>
                <FormLabel>Fecha:</FormLabel>
                <Input
                  name='date'
                  onChange={formik.handleChange}
                  type='date'
                  value={formik.values.date}
                />
                <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl isInvalid={!!formik.errors.paragraphs}>
              <FormLabel>Párrafos:</FormLabel>
              <FormikProvider value={formik}>
                <FieldArray name='paragraphs'>
                  {({ remove, push }) => (
                    <Flex flexDirection='column' w='full' gap='8'>
                      {formik.values.paragraphs?.map((_, index) => (
                        <Flex gap='4' key={`paragraph-${index}`}>
                          <Textarea
                            name={`paragraphs.${index}`}
                            onChange={formik.handleChange}
                            value={formik.values.paragraphs?.[index] || ''}
                            error={formik.errors.paragraphs?.[index]}
                          />
                          <IconButton
                            bgColor='red.500'
                            icon={<DeleteIcon color='white' />}
                            onClick={() => remove(index)}
                            _hover={{ bgColor: 'red.300' }}
                          />
                        </Flex>
                      ))}
                      <Button
                        border={
                          !!formik.errors.paragraphs
                            ? '2px solid red'
                            : '2px solid transparent'
                        }
                        onClick={() => push('')}
                        rightIcon={<AddIcon />}
                        w={{ base: 'full', lg: '48' }}
                      >
                        Agregar párrafo
                      </Button>
                    </Flex>
                  )}
                </FieldArray>
              </FormikProvider>
              <FormErrorMessage>{formik.errors.paragraphs}</FormErrorMessage>
            </FormControl>
            <Button
              colorScheme='teal'
              isLoading={formik.isSubmitting}
              loadingText='Cargando...'
              type='submit'
            >
              {!!id ? 'Modificar garantía' : 'Generar garantía'}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default FormWarranty;
