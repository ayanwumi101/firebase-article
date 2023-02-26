import React, {useState} from 'react'
import { Box, FormControl, FormLabel, Button, Heading, Text, VStack, Input, useToast } from '@chakra-ui/react'
import { LoginCurve } from 'iconsax-react'
import { app } from '../../firebaseConfig'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  //initialise firebase auth
  const auth = getAuth();

  //initialise toast component from chakra Ui
  const toast = useToast();

  //initialise navigate from react-router-dom
  const navigate = useNavigate();

  //states for each of the imputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const handleClick = async  () => {
    if(email && password){
      try {
        await signInWithEmailAndPassword(auth, email, password).then((cred) => {
          console.log(cred.user);
          toast({
            title: "Login Successful.",
            description: "You have been logged in successfully!.",
            status: "success",
            duration: 3000,
            isClosable: true,
            variant: 'left-accent',
            position: 'top-right',

          });
          setEmail('');
          setPassword('');
          navigate('/profile')
        })
      } catch (error) {
        toast({
          title: "Error!",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          variant: 'left-accent',
          position: 'top',
        });
      }
    }else{
      toast({
        title: "Error!",
        description: "Please fill in your details.",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top',
      });
    }
  }

  return (
    <Box mt='10'>
      <VStack spacing={6}>

        <Heading>Login</Heading>

        <Box maxW='400px'>
          <FormControl>
            <VStack spacing={4}>
              <Box>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Input your email' fontSize='14px' w='400px' value={email} onChange={(e) => setEmail(e.target.value)} />
              </Box>

              <Box>
                <FormLabel>Password</FormLabel>
                <Input type='password' placeholder='Input your password' fontSize='14px' w='400px' value={password} onChange={(e) => setPassword(e.target.value)} />
              </Box>

              <Box>
                <Button type='submit' w='400px' colorScheme='teal' onClick={handleClick}>Login <LoginCurve style={{ marginLeft: '5px' }} /></Button>
              </Box>
            </VStack>
          </FormControl>
        </Box>
      </VStack>
    </Box>
  )
}

export default Login