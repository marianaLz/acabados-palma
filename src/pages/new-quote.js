import * as React from 'react';
import * as Yup from 'yup';
import { getAuth } from 'firebase/auth';
import { navigate } from 'gatsby';
import { useFormik } from 'formik';

import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
} from '@chakra-ui/react';

import Navbar from '../components/navbar';

const NewQuote = () => {
  const { currentUser } = getAuth();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      name: '',
      client: '',
      date: '',
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
      deliveryTime: Yup.string().required('Este campo es requerido'),
      validity: Yup.string().required('Este campo es requerido'),
      advancePaymentRate: Yup.string().required('Este campo es requerido'),
      hasTotalCalc: Yup.string().required('Este campo es requerido'),
      notes: Yup.array().required('Este campo es requerido'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      // login(values).then(({ response, msg }) => {
      //   setSubmitting(false);
      //   if (response === 'error') {
      //     toast({
      //       title: 'Error',
      //       description: msg,
      //       status: 'error',
      //       duration: 3000,
      //       isClosable: true,
      //       position: 'top-right',
      //     });
      //   } else {
      //     navigate('/all-quotes');
      //   }
      // });
    },
  });

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser]);

  return (
    <Container as='main'>
      <Navbar />
      <Flex align='center' justify='center' minH='calc(100vh - 121px)'>
        <Card as='form' onSubmit={formik.handleSubmit} w='full'>
          <CardBody as={Flex} flexDir='column' gap='4'>
            <Heading textAlign='center' color='blackAlpha.800' mb='0' size='lg'>
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
            <Flex flexDir={{ base: 'column', lg: 'row' }} gap='4'>
              <FormControl isInvalid={!!formik.errors.deliveryTime}>
                <FormLabel>Tiempo de entrega:</FormLabel>
                <Input
                  name='deliveryTime'
                  onChange={formik.handleChange}
                  placeholder='Escribe el número de días'
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
                  placeholder='Escribe el número de días'
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
                  <option value='yes'>Sí</option>
                  <option value='no'>No</option>
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
              Revisar
            </Button>
          </CardBody>
        </Card>
      </Flex>
    </Container>
  );
};

export default NewQuote;
