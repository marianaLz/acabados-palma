import * as React from 'react';
import * as Yup from 'yup';
import { getAuth } from 'firebase/auth';
import { navigate } from 'gatsby';
import { FieldArray, FormikProvider, useFormik } from 'formik';

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

import Navbar from '../components/navbar';

import { createQuote } from '../firebase/quotes';

const NewQuote = () => {
  const toast = useToast();
  const { currentUser } = getAuth();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      name: '',
      client: '',
      date: '',
      products: [],
      deliveryTime: '',
      validity: '',
      advancePaymentRate: '',
      hasTotalCalc: '',
      notes: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Este campo es requerido'),
      client: Yup.string().required('Este campo es requerido'),
      date: Yup.string().required('Este campo es requerido'),
      products: Yup.array().required('Este campo es requerido'),
      deliveryTime: Yup.string().required('Este campo es requerido'),
      validity: Yup.string().required('Este campo es requerido'),
      advancePaymentRate: Yup.string().required('Este campo es requerido'),
      hasTotalCalc: Yup.string().required('Este campo es requerido'),
      notes: Yup.array().required('Este campo es requerido'),
    }),
    onSubmit: (values, { resetForm, setSubmitting }) => {
      createQuote(values).then(() => {
        setSubmitting(false);
        toast({
          title: 'Todo salió bien',
          description: 'Presupuesto creado de manera exitosa',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        resetForm({ values: formik.initialValues });
        navigate('/all-quotes');
      });
    },
  });

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  return (
    <Container as='main' maxW='container.md'>
      <Navbar />
      <Flex mb='8'>
        <Box as='form' onSubmit={formik.handleSubmit} w='full'>
          <Flex flexDir='column' gap='4'>
            <Heading textAlign='center' color='blackAlpha.800' size='lg'>
              Crea tu presupuesto
            </Heading>
            <FormControl isInvalid={!!formik.errors.name}>
              <FormLabel>Nombre del presupuesto:</FormLabel>
              <Input
                name='name'
                onChange={formik.handleChange}
                placeholder='Ej. Cocina integral - Polanco'
                value={formik.values.name}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <Flex flexDir={{ base: 'column', lg: 'row' }} gap='4'>
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
            <FormControl isInvalid={!!formik.errors.products}>
              <FormLabel>Productos:</FormLabel>
              <FormikProvider value={formik}>
                <FieldArray name='products'>
                  {({ remove, push }) => (
                    <Flex flexDirection='column' w='full' gap='8'>
                      {formik.values.products?.map((_, index) => (
                        <Flex gap='4' key={`product-${index}`}>
                          <Flex flexDir='column' gap='4'>
                            <Textarea
                              name={`products.${index}.concept`}
                              onChange={formik.handleChange}
                              placeholder='Concepto'
                              value={formik.values.products?.[index]?.concept}
                              error={formik.errors.products?.[index]?.concept}
                            />

                            <Flex gap='4'>
                              <Input
                                name={`products.${index}.quantity`}
                                onChange={formik.handleChange}
                                placeholder='Cantidad'
                                type='number'
                                value={
                                  formik.values.products?.[index]?.quantity
                                }
                                error={
                                  formik.errors.products?.[index]?.quantity
                                }
                              />
                              <Select
                                name={`products.${index}.unit`}
                                onChange={formik.handleChange}
                                placeholder='Unidad'
                                value={formik.values.products?.[index]?.unit}
                                error={formik.errors.products?.[index]?.unit}
                              >
                                <option value='m'>m</option>
                                <option value='m²'>m²</option>
                                <option value='m³'>m³</option>
                                <option value='kg'>kg.</option>
                                <option value='pza.'>pza.</option>
                                <option value='lote'>lote</option>
                              </Select>
                              <Input
                                name={`products.${index}.price`}
                                onChange={formik.handleChange}
                                placeholder='Precio'
                                type='number'
                                value={formik.values.products?.[index]?.price}
                                error={formik.errors.products?.[index]?.price}
                              />
                            </Flex>
                          </Flex>
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
                          !!formik.errors.products
                            ? '2px solid red'
                            : '2px solid transparent'
                        }
                        onClick={() => push({})}
                        rightIcon={<AddIcon />}
                        w={{ base: 'full', lg: '48' }}
                      >
                        Agregar producto
                      </Button>
                    </Flex>
                  )}
                </FieldArray>
              </FormikProvider>
              <FormErrorMessage>{formik.errors.products}</FormErrorMessage>
            </FormControl>
            <Flex flexDir={{ base: 'column', lg: 'row' }} gap='4'>
              <FormControl isInvalid={!!formik.errors.deliveryTime}>
                <FormLabel>Tiempo de entrega:</FormLabel>
                <Input
                  name='deliveryTime'
                  onChange={formik.handleChange}
                  placeholder='Número de días hábiles'
                  type='number'
                  value={formik.values.deliveryTime}
                />
                <FormErrorMessage>
                  {formik.errors.deliveryTime}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.validity}>
                <FormLabel>Vigencia:</FormLabel>
                <Input
                  name='validity'
                  onChange={formik.handleChange}
                  placeholder='Número de días hábiles'
                  type='number'
                  value={formik.values.validity}
                />
                <FormErrorMessage>{formik.errors.validity}</FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex flexDir={{ base: 'column', lg: 'row' }} gap='4'>
              <FormControl isInvalid={!!formik.errors.advancePaymentRate}>
                <FormLabel>Porcentaje de anticipo:</FormLabel>
                <Input
                  name='advancePaymentRate'
                  onChange={formik.handleChange}
                  placeholder='Ej. 70'
                  type='number'
                  value={formik.values.advancePaymentRate}
                />
                <FormErrorMessage>
                  {formik.errors.advancePaymentRate}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.hasTotalCalc}>
                <FormLabel>¿Lleva cálculo total?</FormLabel>
                <Select
                  name='hasTotalCalc'
                  onChange={formik.handleChange}
                  placeholder='Selecciona una opción'
                  value={formik.values.hasTotalCalc}
                >
                  <option value='true'>Sí</option>
                  <option value='false'>No</option>
                </Select>
                <FormErrorMessage>
                  {formik.errors.hasTotalCalc}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl
              as={Flex}
              flexDir='column'
              gap='2'
              isInvalid={!!formik.errors.notes}
            >
              <FormLabel>Selecciona las notas que lleva</FormLabel>
              <CheckboxGroup
                colorScheme='teal'
                onChange={(value) => formik.setFieldValue('notes', value)}
                value={formik.values.notes}
              >
                <Checkbox value='En caso de requerir factura, se cobrará el 16% de I.V.A. sobre presupuesto de obra'>
                  En caso de requerir factura, se cobrará el 16% de I.V.A. sobre
                  presupuesto de obra
                </Checkbox>
                <Checkbox value='Estos costos incluyen todo lo necesario para su correcta ejecución'>
                  Estos costos incluyen todo lo necesario para su correcta
                  ejecución
                </Checkbox>
              </CheckboxGroup>
              <FormErrorMessage>{formik.errors.notes}</FormErrorMessage>
            </FormControl>
            <Button
              colorScheme='teal'
              isLoading={formik.isSubmitting}
              loadingText='Iniciando sesión'
              type='submit'
            >
              Generar presupuesto
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default NewQuote;
